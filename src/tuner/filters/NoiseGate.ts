/**
 * Porte de bruit (Noise Gate) pour filtrer les signaux faibles
 * et éviter les déclenchements indésirables de l'accordeur
 */

export interface NoiseGateSettings {
  threshold: number // Seuil en dBFS (-60 à 0)
  attack: number    // Temps d'ouverture en ms
  release: number   // Temps de fermeture en ms
  ratio: number     // Ratio de réduction (1-10)
}

export class NoiseGate {
  private settings: NoiseGateSettings
  private sampleRate: number
  private isOpen: boolean = false
  private envelope: number = 0
  private attackCoeff: number = 0
  private releaseCoeff: number = 0

  constructor(sampleRate: number = 48000, settings?: Partial<NoiseGateSettings>) {
    this.sampleRate = sampleRate
    this.settings = {
      threshold: -40, // -40 dBFS par défaut
      attack: 1,      // 1ms d'attaque
      release: 100,   // 100ms de relâchement
      ratio: 4,       // Ratio 4:1
      ...settings
    }
    
    this.updateCoefficients()
  }

  /**
   * Traite un buffer audio avec la porte de bruit
   */
  process(inputBuffer: Float32Array): Float32Array {
    const outputBuffer = new Float32Array(inputBuffer.length)
    
    for (let i = 0; i < inputBuffer.length; i++) {
      const inputLevel = this.calculateLevel(inputBuffer[i])
      const inputLevelDb = this.linearToDb(inputLevel)
      
      // Calcul de l'enveloppe
      const targetEnvelope = inputLevelDb > this.settings.threshold ? 1.0 : 0.0
      
      if (targetEnvelope > this.envelope) {
        // Attaque - ouverture rapide
        this.envelope = targetEnvelope + (this.envelope - targetEnvelope) * this.attackCoeff
      } else {
        // Relâchement - fermeture lente
        this.envelope = targetEnvelope + (this.envelope - targetEnvelope) * this.releaseCoeff
      }
      
      // Application du gain
      let gain = this.envelope
      
      // Si le signal est en dessous du seuil, applique le ratio de réduction
      if (inputLevelDb < this.settings.threshold) {
        const reduction = (this.settings.threshold - inputLevelDb) / this.settings.ratio
        gain *= this.dbToLinear(-reduction)
      }
      
      outputBuffer[i] = inputBuffer[i] * gain
      this.isOpen = this.envelope > 0.1
    }
    
    return outputBuffer
  }

  /**
   * Analyse le niveau RMS d'un buffer pour décider de l'ouverture
   */
  analyzeLevel(buffer: Float32Array): { level: number, levelDb: number, shouldOpen: boolean } {
    const rms = this.calculateRMS(buffer)
    const levelDb = this.linearToDb(rms)
    const shouldOpen = levelDb > this.settings.threshold
    
    return {
      level: rms,
      levelDb,
      shouldOpen
    }
  }

  /**
   * Calcule le niveau RMS d'un buffer
   */
  private calculateRMS(buffer: Float32Array): number {
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    return Math.sqrt(sum / buffer.length)
  }

  /**
   * Calcule le niveau instantané (valeur absolue lissée)
   */
  private calculateLevel(sample: number): number {
    return Math.abs(sample)
  }

  /**
   * Conversion linéaire vers dB
   */
  private linearToDb(linear: number): number {
    return linear > 0 ? 20 * Math.log10(linear) : -100
  }

  /**
   * Conversion dB vers linéaire
   */
  private dbToLinear(db: number): number {
    return Math.pow(10, db / 20)
  }

  /**
   * Met à jour les coefficients d'attaque et de relâchement
   */
  private updateCoefficients(): void {
    // Conversion temps en coefficients exponentiels
    this.attackCoeff = Math.exp(-1 / (this.settings.attack * 0.001 * this.sampleRate))
    this.releaseCoeff = Math.exp(-1 / (this.settings.release * 0.001 * this.sampleRate))
  }

  /**
   * Met à jour les paramètres de la porte de bruit
   */
  updateSettings(newSettings: Partial<NoiseGateSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    this.updateCoefficients()
  }

  /**
   * Réinitialise l'état interne
   */
  reset(): void {
    this.isOpen = false
    this.envelope = 0
  }

  /**
   * Indique si la porte est ouverte
   */
  getIsOpen(): boolean {
    return this.isOpen
  }

  /**
   * Récupère le niveau d'enveloppe actuel
   */
  getEnvelope(): number {
    return this.envelope
  }

  /**
   * Détecteur simple de voix/parole pour éviter les interférences
   * Basé sur l'analyse spectrale des formants
   */
  detectVoice(buffer: Float32Array): boolean {
    // Analyse des fréquences caractéristiques de la voix (300-3400 Hz)
    const fft = this.simpleFFT(buffer)
    const voiceEnergyRatio = this.calculateVoiceEnergyRatio(fft)
    
    // Si plus de 60% de l'énergie est dans la bande vocale, c'est probablement de la voix
    return voiceEnergyRatio > 0.6
  }

  /**
   * FFT simple pour l'analyse spectrale
   */
  private simpleFFT(buffer: Float32Array): Float32Array {
    // Implémentation simplifiée - dans un vrai projet, utiliser une bibliothèque FFT
    const N = buffer.length
    const spectrum = new Float32Array(N / 2)
    
    for (let k = 0; k < spectrum.length; k++) {
      let real = 0
      let imag = 0
      
      for (let n = 0; n < N; n++) {
        const angle = -2 * Math.PI * k * n / N
        real += buffer[n] * Math.cos(angle)
        imag += buffer[n] * Math.sin(angle)
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag)
    }
    
    return spectrum
  }

  /**
   * Calcule le ratio d'énergie dans la bande vocale
   */
  private calculateVoiceEnergyRatio(spectrum: Float32Array): number {
    const nyquist = this.sampleRate / 2
    const binSize = nyquist / spectrum.length
    
    // Indices des fréquences vocales (300-3400 Hz)
    const voiceStartBin = Math.floor(300 / binSize)
    const voiceEndBin = Math.floor(3400 / binSize)
    
    let totalEnergy = 0
    let voiceEnergy = 0
    
    for (let i = 0; i < spectrum.length; i++) {
      const energy = spectrum[i] * spectrum[i]
      totalEnergy += energy
      
      if (i >= voiceStartBin && i <= voiceEndBin) {
        voiceEnergy += energy
      }
    }
    
    return totalEnergy > 0 ? voiceEnergy / totalEnergy : 0
  }
}
