/**
 * Générateur de signaux synthétiques pour tester l'accordeur
 * Génère des sinusoïdes pures aux fréquences de référence de la guitare
 */

export interface SynthTestResult {
  frequency: number
  expectedNote: string
  detectedFrequency: number
  detectedNote: string
  frequencyError: number
  centsError: number
  confidence: number
  passed: boolean
}

export interface NoiseTestResult {
  snr: number
  detectionRate: number
  averageConfidence: number
  stabilityScore: number
  passed: boolean
}

/**
 * Générateur de signaux de test
 */
export class SignalSynthesizer {
  private sampleRate: number

  constructor(sampleRate: number = 48000) {
    this.sampleRate = sampleRate
  }

  /**
   * Génère une sinusoïde pure à la fréquence spécifiée
   */
  generateSineWave(frequency: number, duration: number, amplitude: number = 0.5): Float32Array {
    const samples = Math.floor(duration * this.sampleRate)
    const buffer = new Float32Array(samples)
    
    for (let i = 0; i < samples; i++) {
      const t = i / this.sampleRate
      buffer[i] = amplitude * Math.sin(2 * Math.PI * frequency * t)
    }
    
    return buffer
  }

  /**
   * Génère un signal avec harmoniques (plus réaliste pour une guitare)
   */
  generateGuitarLikeSignal(
    fundamental: number, 
    duration: number, 
    amplitude: number = 0.5
  ): Float32Array {
    const samples = Math.floor(duration * this.sampleRate)
    const buffer = new Float32Array(samples)
    
    // Harmoniques typiques d'une guitare avec leurs amplitudes relatives
    const harmonics = [
      { freq: fundamental, amp: 1.0 },        // Fondamentale
      { freq: fundamental * 2, amp: 0.6 },    // 2ème harmonique
      { freq: fundamental * 3, amp: 0.3 },    // 3ème harmonique
      { freq: fundamental * 4, amp: 0.2 },    // 4ème harmonique
      { freq: fundamental * 5, amp: 0.1 },    // 5ème harmonique
      { freq: fundamental * 6, amp: 0.05 }    // 6ème harmonique
    ]
    
    for (let i = 0; i < samples; i++) {
      const t = i / this.sampleRate
      let sample = 0
      
      for (const harmonic of harmonics) {
        if (harmonic.freq < this.sampleRate / 2) { // Éviter l'aliasing
          sample += harmonic.amp * Math.sin(2 * Math.PI * harmonic.freq * t)
        }
      }
      
      buffer[i] = amplitude * sample / harmonics.length
    }
    
    return buffer
  }

  /**
   * Génère du bruit rose (plus naturel que le bruit blanc)
   */
  generatePinkNoise(duration: number, amplitude: number = 0.1): Float32Array {
    const samples = Math.floor(duration * this.sampleRate)
    const buffer = new Float32Array(samples)
    
    // Générateur de bruit rose simple (approximation)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
    
    for (let i = 0; i < samples; i++) {
      const white = Math.random() * 2 - 1
      
      b0 = 0.99886 * b0 + white * 0.0555179
      b1 = 0.99332 * b1 + white * 0.0750759
      b2 = 0.96900 * b2 + white * 0.1538520
      b3 = 0.86650 * b3 + white * 0.3104856
      b4 = 0.55000 * b4 + white * 0.5329522
      b5 = -0.7616 * b5 - white * 0.0168980
      
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362
      b6 = white * 0.115926
      
      buffer[i] = amplitude * pink * 0.11
    }
    
    return buffer
  }

  /**
   * Mélange deux signaux avec un ratio SNR spécifié
   */
  mixSignalWithNoise(
    signal: Float32Array, 
    noise: Float32Array, 
    snrDb: number
  ): Float32Array {
    if (signal.length !== noise.length) {
      throw new Error('Signal and noise must have the same length')
    }
    
    // Calcul des puissances RMS
    const signalRms = this.calculateRMS(signal)
    const noiseRms = this.calculateRMS(noise)
    
    // Calcul du facteur de scaling pour le bruit
    const snrLinear = Math.pow(10, snrDb / 20)
    const noiseScale = signalRms / (noiseRms * snrLinear)
    
    const mixed = new Float32Array(signal.length)
    for (let i = 0; i < signal.length; i++) {
      mixed[i] = signal[i] + noise[i] * noiseScale
    }
    
    return mixed
  }

  /**
   * Calcule la puissance RMS d'un signal
   */
  private calculateRMS(buffer: Float32Array): number {
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    return Math.sqrt(sum / buffer.length)
  }

  /**
   * Ajoute un fade in/out pour éviter les clics
   */
  applyFade(buffer: Float32Array, fadeTime: number = 0.01): Float32Array {
    const fadeLength = Math.floor(fadeTime * this.sampleRate)
    const result = new Float32Array(buffer)
    
    // Fade in
    for (let i = 0; i < Math.min(fadeLength, buffer.length); i++) {
      const factor = i / fadeLength
      result[i] *= factor
    }
    
    // Fade out
    for (let i = Math.max(0, buffer.length - fadeLength); i < buffer.length; i++) {
      const factor = (buffer.length - 1 - i) / fadeLength
      result[i] *= factor
    }
    
    return result
  }
}

/**
 * Testeur de l'accordeur avec signaux synthétiques
 */
export class TunerTester {
  private synthesizer: SignalSynthesizer

  // Fréquences de référence des cordes de guitare en accordage standard
  private readonly GUITAR_FREQUENCIES = [
    { freq: 82.41, note: 'E2', name: '6ème corde (Mi grave)' },
    { freq: 110.00, note: 'A2', name: '5ème corde (La)' },
    { freq: 146.83, note: 'D3', name: '4ème corde (Ré)' },
    { freq: 196.00, note: 'G3', name: '3ème corde (Sol)' },
    { freq: 246.94, note: 'B3', name: '2ème corde (Si)' },
    { freq: 329.63, note: 'E4', name: '1ère corde (Mi aigu)' },
    { freq: 440.00, note: 'A4', name: 'La de référence' },
    { freq: 659.25, note: 'E5', name: 'Mi aigu (12ème frette)' }
  ]

  constructor(sampleRate: number = 48000) {
    this.synthesizer = new SignalSynthesizer(sampleRate)
  }

  /**
   * Test de précision sur les fréquences de guitare
   */
  async testFrequencyAccuracy(
    pitchDetector: any,
    maxFrequencyError: number = 0.5,
    maxCentsError: number = 3
  ): Promise<SynthTestResult[]> {
    const results: SynthTestResult[] = []

    for (const reference of this.GUITAR_FREQUENCIES) {
      // Génère un signal de guitare réaliste
      const signal = this.synthesizer.generateGuitarLikeSignal(reference.freq, 2.0, 0.7)
      const fadedSignal = this.synthesizer.applyFade(signal, 0.05)

      // Détection sur plusieurs fenêtres pour la stabilité
      const detections = []
      const windowSize = 2048
      const hopSize = windowSize / 2

      for (let i = 0; i < fadedSignal.length - windowSize; i += hopSize) {
        const window = fadedSignal.slice(i, i + windowSize)
        const result = pitchDetector.detect(window)
        
        if (result && result.confidence > 0.7) {
          detections.push(result)
        }
      }

      if (detections.length === 0) {
        results.push({
          frequency: reference.freq,
          expectedNote: reference.note,
          detectedFrequency: 0,
          detectedNote: 'NONE',
          frequencyError: 100,
          centsError: 1200,
          confidence: 0,
          passed: false
        })
        continue
      }

      // Moyenne des détections valides
      const avgFrequency = detections.reduce((sum, d) => sum + d.frequency, 0) / detections.length
      const avgConfidence = detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length

      // Calcul des erreurs
      const frequencyError = Math.abs(avgFrequency - reference.freq) / reference.freq * 100
      const centsError = Math.abs(1200 * Math.log2(avgFrequency / reference.freq))

      // Détermination de la note détectée
      const detectedNote = this.frequencyToNote(avgFrequency)

      const passed = frequencyError <= maxFrequencyError && centsError <= maxCentsError

      results.push({
        frequency: reference.freq,
        expectedNote: reference.note,
        detectedFrequency: avgFrequency,
        detectedNote,
        frequencyError,
        centsError,
        confidence: avgConfidence,
        passed
      })
    }

    return results
  }

  /**
   * Test de stabilité avec bruit de fond
   */
  async testNoiseRobustness(
    pitchDetector: any,
    testFrequency: number = 440,
    snrDb: number = 20,
    duration: number = 2.0
  ): Promise<NoiseTestResult> {
    // Génère le signal et le bruit
    const signal = this.synthesizer.generateGuitarLikeSignal(testFrequency, duration, 0.7)
    const noise = this.synthesizer.generatePinkNoise(duration, 1.0)
    const noisySignal = this.synthesizer.mixSignalWithNoise(signal, noise, snrDb)
    const fadedSignal = this.synthesizer.applyFade(noisySignal, 0.05)

    // Test sur plusieurs fenêtres
    const detections = []
    const windowSize = 2048
    const hopSize = windowSize / 4 // Plus de chevauchement pour la stabilité

    for (let i = 0; i < fadedSignal.length - windowSize; i += hopSize) {
      const window = fadedSignal.slice(i, i + windowSize)
      const result = pitchDetector.detect(window)
      detections.push(result)
    }

    // Analyse des résultats
    const validDetections = detections.filter(d => d && d.confidence > 0.5)
    const detectionRate = validDetections.length / detections.length

    if (validDetections.length === 0) {
      return {
        snr: snrDb,
        detectionRate: 0,
        averageConfidence: 0,
        stabilityScore: 0,
        passed: false
      }
    }

    const frequencies = validDetections.map(d => d.frequency)
    const confidences = validDetections.map(d => d.confidence)

    const avgConfidence = confidences.reduce((sum, c) => sum + c, 0) / confidences.length
    const freqMean = frequencies.reduce((sum, f) => sum + f, 0) / frequencies.length
    const freqStdDev = Math.sqrt(
      frequencies.reduce((sum, f) => sum + Math.pow(f - freqMean, 2), 0) / frequencies.length
    )

    // Score de stabilité basé sur l'écart-type en cents
    const stabilityScore = Math.max(0, 100 - (freqStdDev / freqMean * 1200 * 20))

    const passed = detectionRate > 0.8 && avgConfidence > 0.7 && stabilityScore > 80

    return {
      snr: snrDb,
      detectionRate,
      averageConfidence: avgConfidence,
      stabilityScore,
      passed
    }
  }

  /**
   * Conversion fréquence vers note (approximation)
   */
  private frequencyToNote(frequency: number): string {
    const A4 = 440
    const noteNumber = Math.round(12 * Math.log2(frequency / A4) + 69)
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const noteIndex = ((noteNumber - 12) % 12 + 12) % 12
    const octave = Math.floor((noteNumber - 12) / 12)
    return `${noteNames[noteIndex]}${octave}`
  }

  /**
   * Exécute une suite complète de tests
   */
  async runFullTestSuite(pitchDetector: any): Promise<{
    accuracyResults: SynthTestResult[]
    noiseResults: NoiseTestResult[]
    summary: {
      accuracyPassRate: number
      averageFrequencyError: number
      averageCentsError: number
      noiseRobustness: boolean
    }
  }> {
    console.log('🎵 Démarrage des tests de l\'accordeur...')

    // Test de précision
    console.log('📊 Test de précision des fréquences...')
    const accuracyResults = await this.testFrequencyAccuracy(pitchDetector)

    // Tests de robustesse au bruit
    console.log('🔊 Test de robustesse au bruit...')
    const noiseResults = []
    const snrLevels = [30, 20, 15, 10] // dB

    for (const snr of snrLevels) {
      const result = await this.testNoiseRobustness(pitchDetector, 440, snr)
      noiseResults.push(result)
    }

    // Calcul du résumé
    const passedAccuracy = accuracyResults.filter(r => r.passed).length
    const accuracyPassRate = passedAccuracy / accuracyResults.length
    
    const avgFreqError = accuracyResults.reduce((sum, r) => sum + r.frequencyError, 0) / accuracyResults.length
    const avgCentsError = accuracyResults.reduce((sum, r) => sum + r.centsError, 0) / accuracyResults.length
    
    const noiseRobustness = noiseResults.some(r => r.passed)

    console.log('✅ Tests terminés')

    return {
      accuracyResults,
      noiseResults,
      summary: {
        accuracyPassRate,
        averageFrequencyError: avgFreqError,
        averageCentsError: avgCentsError,
        noiseRobustness
      }
    }
  }
}
