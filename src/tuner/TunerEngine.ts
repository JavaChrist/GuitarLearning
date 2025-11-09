/**
 * Moteur principal de l'accordeur
 * Gère la détection de pitch, le mapping note/fréquence, et les états
 */

import { PitchDetector, type PitchResult } from './PitchDetector'
import { NoiseGate, type NoiseGateSettings } from './filters/NoiseGate'

// Types et interfaces
export interface TunerState {
  noteName: string
  noteNameFr: string
  octave: number
  frequency: number
  cents: number
  confidence: number
  isInTune: boolean
  detune: 'flat' | 'sharp' | 'in'
  a4Hz: number
  targetNote?: string
  targetFrequency?: number
  isActive: boolean
  noiseGateOpen: boolean
  voiceDetected: boolean
}

export interface TuningPreset {
  name: string
  nameFr: string
  notes: string[]
  frequencies: number[]
}

export type TunerMode = 'auto' | 'string'

export interface TunerSettings {
  a4Hz: number
  sensitivity: number
  noiseGate: NoiseGateSettings
  inTuneThreshold: number
  sharpFlatThreshold: number
  smoothingFactor: number
  useYIN: boolean // true = YIN, false = MPM
}

// Constantes
const NOTE_NAMES_EN = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
const NOTE_NAMES_FR = ['Do', 'Do#', 'Ré', 'Ré#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']

// Accordages prédéfinis
export const TUNING_PRESETS: TuningPreset[] = [
  {
    name: 'Standard',
    nameFr: 'Standard',
    notes: ['E2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    frequencies: [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]
  },
  {
    name: 'Drop D',
    nameFr: 'Drop D',
    notes: ['D2', 'A2', 'D3', 'G3', 'B3', 'E4'],
    frequencies: [73.42, 110.00, 146.83, 196.00, 246.94, 329.63]
  },
  {
    name: 'DADGAD',
    nameFr: 'DADGAD',
    notes: ['D2', 'A2', 'D3', 'G3', 'A3', 'D4'],
    frequencies: [73.42, 110.00, 146.83, 196.00, 220.00, 293.66]
  },
  {
    name: 'Open G',
    nameFr: 'Sol ouvert',
    notes: ['D2', 'G2', 'D3', 'G3', 'B3', 'D4'],
    frequencies: [73.42, 98.00, 146.83, 196.00, 246.94, 293.66]
  },
  {
    name: 'Open D',
    nameFr: 'Ré ouvert',
    notes: ['D2', 'A2', 'D3', 'F#3', 'A3', 'D4'],
    frequencies: [73.42, 110.00, 146.83, 185.00, 220.00, 293.66]
  }
]

export class TunerEngine {
  private pitchDetector: PitchDetector
  private noiseGate: NoiseGate
  private audioContext: AudioContext | null = null
  private mediaStream: MediaStream | null = null
  private audioWorkletNode: AudioWorkletNode | null = null
  private scriptProcessor: ScriptProcessorNode | null = null
  private isRunning = false
  private mode: TunerMode = 'auto'
  private targetStringIndex = -1
  private currentPreset = TUNING_PRESETS[0]
  
  private settings: TunerSettings = {
    a4Hz: 440,
    sensitivity: 0.8,
    noiseGate: {
      threshold: -40,
      attack: 1,
      release: 100,
      ratio: 4
    },
    inTuneThreshold: 5,      // ±5 cents = juste
    sharpFlatThreshold: 15,  // ±15 cents = limite orange/rouge
    smoothingFactor: 0.2,    // Lissage exponentiel
    useYIN: true
  }

  // État lissé pour éviter les oscillations
  private smoothedCents = 0
  private smoothedFrequency = 0
  private lastUpdateTime = 0

  // Callbacks
  private updateCallback?: (state: TunerState) => void
  private errorCallback?: (error: string) => void

  constructor(sampleRate: number = 48000) {
    this.pitchDetector = new PitchDetector(sampleRate, 2048, 0.15, this.settings.sensitivity)
    this.noiseGate = new NoiseGate(sampleRate, this.settings.noiseGate)
    
    // Charger les paramètres depuis localStorage
    this.loadSettings()
  }

  /**
   * Démarre l'accordeur
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      return
    }

    try {
      // Demande d'accès au microphone
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: false,
          sampleRate: 48000
        }
      })

      // Création du contexte audio
      this.audioContext = new AudioContext({ sampleRate: 48000 })
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream)
      
      // Tentative d'utilisation d'AudioWorklet (plus performant)
      try {
        await this.setupAudioWorklet(source)
      } catch (error) {
        console.warn('AudioWorklet non disponible, utilisation de ScriptProcessorNode:', error)
        this.setupScriptProcessor(source)
      }

      this.isRunning = true
      this.lastUpdateTime = performance.now()
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      this.handleError(`Impossible d'accéder au microphone: ${errorMessage}`)
    }
  }

  /**
   * Arrête l'accordeur
   */
  stop(): void {
    if (!this.isRunning) {
      return
    }

    this.isRunning = false
    
    if (this.audioWorkletNode) {
      this.audioWorkletNode.disconnect()
      this.audioWorkletNode = null
    }
    
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect()
      this.scriptProcessor = null
    }
    
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }
    
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
  }

  /**
   * Configuration AudioWorklet (préféré)
   */
  private async setupAudioWorklet(source: MediaStreamAudioSourceNode): Promise<void> {
    if (!this.audioContext) return

    // Chargement du worklet
    await this.audioContext.audioWorklet.addModule('/tuner-audio-worklet.js')
    
    this.audioWorkletNode = new AudioWorkletNode(this.audioContext, 'tuner-processor', {
      processorOptions: {
        bufferSize: 2048
      }
    })

    this.audioWorkletNode.port.onmessage = (event) => {
      if (event.data.type === 'audio-data') {
        this.processAudioData(event.data.buffer)
      }
    }

    source.connect(this.audioWorkletNode)
    this.audioWorkletNode.connect(this.audioContext.destination)
  }

  /**
   * Configuration ScriptProcessorNode (fallback)
   */
  private setupScriptProcessor(source: MediaStreamAudioSourceNode): void {
    if (!this.audioContext) return

    this.scriptProcessor = this.audioContext.createScriptProcessor(2048, 1, 1)
    
    this.scriptProcessor.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer.getChannelData(0)
      this.processAudioData(inputBuffer)
    }

    source.connect(this.scriptProcessor)
    this.scriptProcessor.connect(this.audioContext.destination)
  }

  /**
   * Traitement des données audio
   */
  private processAudioData(buffer: Float32Array): void {
    if (!this.isRunning) return

    const currentTime = performance.now()
    
    // Limitation du taux de rafraîchissement (60 FPS max)
    if (currentTime - this.lastUpdateTime < 16) {
      return
    }
    this.lastUpdateTime = currentTime

    // Application de la porte de bruit
    const gatedBuffer = this.noiseGate.process(buffer)
    const noiseGateOpen = this.noiseGate.getIsOpen()
    
    // Détection de voix
    const voiceDetected = this.noiseGate.detectVoice(buffer)
    
    if (!noiseGateOpen || voiceDetected) {
      this.emitState({
        isActive: false,
        noiseGateOpen,
        voiceDetected
      })
      return
    }

    // Détection de pitch
    const pitchResult = this.settings.useYIN 
      ? this.pitchDetector.detect(gatedBuffer)
      : this.pitchDetector.detectMPM(gatedBuffer)

    if (!pitchResult) {
      this.emitState({
        isActive: false,
        noiseGateOpen,
        voiceDetected
      })
      return
    }

    // Traitement du résultat
    this.processPitchResult(pitchResult, noiseGateOpen, voiceDetected)
  }

  /**
   * Traitement du résultat de détection de pitch
   */
  private processPitchResult(pitchResult: PitchResult, noiseGateOpen: boolean, voiceDetected: boolean): void {
    const { frequency, confidence } = pitchResult

    // Lissage de la fréquence
    const alpha = this.settings.smoothingFactor
    this.smoothedFrequency = this.smoothedFrequency * (1 - alpha) + frequency * alpha

    // Calcul de la note la plus proche
    const noteInfo = this.frequencyToNote(this.smoothedFrequency, this.settings.a4Hz)
    
    let cents = noteInfo.cents
    let targetFrequency: number | undefined
    let targetNote: string | undefined

    // Mode corde spécifique
    if (this.mode === 'string' && this.targetStringIndex >= 0) {
      const targetNoteInfo = this.currentPreset.notes[this.targetStringIndex]
      const targetFreq = this.currentPreset.frequencies[this.targetStringIndex] * (this.settings.a4Hz / 440)
      
      cents = this.frequencyToCents(this.smoothedFrequency, targetFreq)
      targetFrequency = targetFreq
      targetNote = targetNoteInfo
    }

    // Lissage des cents
    this.smoothedCents = this.smoothedCents * (1 - alpha) + cents * alpha

    // Limitation à ±50 cents pour l'aiguille
    const displayCents = Math.max(-50, Math.min(50, this.smoothedCents))

    // Détermination de l'état d'accordage
    const absDisplayCents = Math.abs(displayCents)
    const isInTune = absDisplayCents <= this.settings.inTuneThreshold
    
    let detune: 'flat' | 'sharp' | 'in' = 'in'
    if (!isInTune) {
      detune = displayCents < 0 ? 'flat' : 'sharp'
    }

    this.emitState({
      noteName: noteInfo.noteName,
      noteNameFr: noteInfo.noteNameFr,
      octave: noteInfo.octave,
      frequency: this.smoothedFrequency,
      cents: displayCents,
      confidence,
      isInTune,
      detune,
      a4Hz: this.settings.a4Hz,
      targetNote,
      targetFrequency,
      isActive: true,
      noiseGateOpen,
      voiceDetected
    })
  }

  /**
   * Conversion fréquence vers note
   */
  private frequencyToNote(frequency: number, a4Hz: number): {
    noteName: string
    noteNameFr: string
    octave: number
    cents: number
  } {
    const noteNumber = 12 * Math.log2(frequency / a4Hz) + 69
    const roundedNoteNumber = Math.round(noteNumber)
    const cents = Math.round((noteNumber - roundedNoteNumber) * 100)
    
    const noteIndex = ((roundedNoteNumber - 12) % 12 + 12) % 12
    const octave = Math.floor((roundedNoteNumber - 12) / 12)
    
    return {
      noteName: NOTE_NAMES_EN[noteIndex],
      noteNameFr: NOTE_NAMES_FR[noteIndex],
      octave,
      cents
    }
  }

  /**
   * Conversion fréquence vers cents par rapport à une cible
   */
  private frequencyToCents(frequency: number, targetFrequency: number): number {
    return Math.round(1200 * Math.log2(frequency / targetFrequency))
  }

  /**
   * Émet l'état actuel
   */
  private emitState(partialState: Partial<TunerState>): void {
    const defaultState: TunerState = {
      noteName: '',
      noteNameFr: '',
      octave: 0,
      frequency: 0,
      cents: 0,
      confidence: 0,
      isInTune: false,
      detune: 'in',
      a4Hz: this.settings.a4Hz,
      isActive: false,
      noiseGateOpen: false,
      voiceDetected: false
    }

    const state = { ...defaultState, ...partialState }
    this.updateCallback?.(state)
  }

  /**
   * Gestion des erreurs
   */
  private handleError(message: string): void {
    console.error('TunerEngine Error:', message)
    this.errorCallback?.(message)
  }

  // Méthodes publiques de configuration

  setMode(mode: TunerMode): void {
    this.mode = mode
    this.targetStringIndex = -1
  }

  setTargetString(stringIndex: number): void {
    if (stringIndex >= 0 && stringIndex < this.currentPreset.notes.length) {
      this.mode = 'string'
      this.targetStringIndex = stringIndex
    }
  }

  setTuningPreset(presetIndex: number): void {
    if (presetIndex >= 0 && presetIndex < TUNING_PRESETS.length) {
      this.currentPreset = TUNING_PRESETS[presetIndex]
      this.targetStringIndex = -1
    }
  }

  setCalibration(a4Hz: number): void {
    this.settings.a4Hz = Math.max(415, Math.min(466, a4Hz))
    this.saveSettings()
  }

  setSensitivity(sensitivity: number): void {
    this.settings.sensitivity = Math.max(0.1, Math.min(0.99, sensitivity))
    this.pitchDetector.updateSettings(undefined, this.settings.sensitivity)
    this.saveSettings()
  }

  setNoiseGateThreshold(threshold: number): void {
    this.settings.noiseGate.threshold = Math.max(-60, Math.min(0, threshold))
    this.noiseGate.updateSettings({ threshold: this.settings.noiseGate.threshold })
    this.saveSettings()
  }

  setAlgorithm(useYIN: boolean): void {
    this.settings.useYIN = useYIN
    this.saveSettings()
  }

  onUpdate(callback: (state: TunerState) => void): void {
    this.updateCallback = callback
  }

  onError(callback: (error: string) => void): void {
    this.errorCallback = callback
  }

  // Sauvegarde/chargement des paramètres
  private saveSettings(): void {
    try {
      localStorage.setItem('tuner-settings', JSON.stringify(this.settings))
    } catch (error) {
      console.warn('Impossible de sauvegarder les paramètres:', error)
    }
  }

  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('tuner-settings')
      if (saved) {
        const parsed = JSON.parse(saved)
        this.settings = { ...this.settings, ...parsed }
      }
    } catch (error) {
      console.warn('Impossible de charger les paramètres:', error)
    }
  }

  // Getters
  getSettings(): TunerSettings {
    return { ...this.settings }
  }

  getCurrentPreset(): TuningPreset {
    return this.currentPreset
  }

  getMode(): TunerMode {
    return this.mode
  }

  getTargetStringIndex(): number {
    return this.targetStringIndex
  }

  isActive(): boolean {
    return this.isRunning
  }
}
