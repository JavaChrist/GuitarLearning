/**
 * Détecteur de pitch utilisant l'algorithme YIN pour une détection précise de fréquence
 * Implémentation basée sur "YIN, a fundamental frequency estimator for speech and music"
 * de Alain de Cheveigné et Hideki Kawahara
 */

export interface PitchResult {
  frequency: number
  confidence: number
  clarity: number
}

export class PitchDetector {
  private sampleRate: number
  private bufferSize: number
  private threshold: number
  private yinBuffer: Float32Array
  private probabilityThreshold: number

  constructor(
    sampleRate: number = 48000,
    bufferSize: number = 2048,
    threshold: number = 0.15,
    probabilityThreshold: number = 0.8
  ) {
    this.sampleRate = sampleRate
    this.bufferSize = bufferSize
    this.threshold = threshold
    this.probabilityThreshold = probabilityThreshold
    this.yinBuffer = new Float32Array(bufferSize / 2)
  }

  /**
   * Détecte la fréquence fondamentale d'un buffer audio
   */
  detect(audioBuffer: Float32Array): PitchResult | null {
    if (audioBuffer.length < this.bufferSize) {
      return null
    }

    // Étape 1: Calcul de la différence (autocorrélation)
    this.difference(audioBuffer)
    
    // Étape 2: Normalisation cumulative
    this.cumulativeMeanNormalizedDifference()
    
    // Étape 3: Recherche du minimum absolu
    const tauEstimate = this.absoluteThreshold()
    
    if (tauEstimate === -1) {
      return null
    }

    // Étape 4: Interpolation parabolique pour plus de précision
    const betterTau = this.parabolicInterpolation(tauEstimate)
    
    // Calcul de la fréquence
    const frequency = this.sampleRate / betterTau
    
    // Calcul de la confiance
    const confidence = 1 - this.yinBuffer[tauEstimate]
    
    // Vérification des limites de fréquence (E2 à C7: ~82-2093 Hz)
    if (frequency < 70 || frequency > 2200 || confidence < this.probabilityThreshold) {
      return null
    }

    // Calcul de la clarté harmonique
    const clarity = this.calculateClarity(audioBuffer, frequency)

    return {
      frequency,
      confidence,
      clarity
    }
  }

  /**
   * Étape 1: Calcul de la fonction de différence
   */
  private difference(buffer: Float32Array): void {
    let delta: number
    for (let tau = 0; tau < this.yinBuffer.length; tau++) {
      this.yinBuffer[tau] = 0
      for (let i = 0; i < this.yinBuffer.length; i++) {
        delta = buffer[i] - buffer[i + tau]
        this.yinBuffer[tau] += delta * delta
      }
    }
  }

  /**
   * Étape 2: Normalisation cumulative de la fonction de différence
   */
  private cumulativeMeanNormalizedDifference(): void {
    let runningSum = 0
    this.yinBuffer[0] = 1

    for (let tau = 1; tau < this.yinBuffer.length; tau++) {
      runningSum += this.yinBuffer[tau]
      this.yinBuffer[tau] *= tau / runningSum
    }
  }

  /**
   * Étape 3: Recherche du minimum absolu
   */
  private absoluteThreshold(): number {
    let tau = 2 // Commence à tau=2 pour éviter les fausses détections
    
    // Recherche du premier minimum sous le seuil
    while (tau < this.yinBuffer.length) {
      if (this.yinBuffer[tau] < this.threshold) {
        while (tau + 1 < this.yinBuffer.length && this.yinBuffer[tau + 1] < this.yinBuffer[tau]) {
          tau++
        }
        return tau
      }
      tau++
    }

    // Si aucun minimum sous le seuil, cherche le minimum global
    let minTau = 2
    let minValue = this.yinBuffer[2]
    for (let tau = 3; tau < this.yinBuffer.length; tau++) {
      if (this.yinBuffer[tau] < minValue) {
        minValue = this.yinBuffer[tau]
        minTau = tau
      }
    }

    return minValue < 0.8 ? minTau : -1
  }

  /**
   * Étape 4: Interpolation parabolique pour améliorer la précision
   */
  private parabolicInterpolation(tauEstimate: number): number {
    if (tauEstimate === 0 || tauEstimate === this.yinBuffer.length - 1) {
      return tauEstimate
    }

    const s0 = this.yinBuffer[tauEstimate - 1]
    const s1 = this.yinBuffer[tauEstimate]
    const s2 = this.yinBuffer[tauEstimate + 1]

    const a = (s0 - 2 * s1 + s2) / 2
    const b = (s2 - s0) / 2

    if (a !== 0) {
      return tauEstimate - b / (2 * a)
    }
    
    return tauEstimate
  }

  /**
   * Calcule la clarté harmonique du signal
   */
  private calculateClarity(buffer: Float32Array, frequency: number): number {
    const period = this.sampleRate / frequency
    let correlation = 0
    let energy = 0

    // Calcule l'autocorrélation à la période fondamentale
    for (let i = 0; i < buffer.length - period; i++) {
      const sample1 = buffer[i]
      const sample2 = buffer[Math.floor(i + period)]
      correlation += sample1 * sample2
      energy += sample1 * sample1
    }

    return energy > 0 ? Math.abs(correlation) / energy : 0
  }

  /**
   * Met à jour les paramètres du détecteur
   */
  updateSettings(threshold?: number, probabilityThreshold?: number): void {
    if (threshold !== undefined) {
      this.threshold = Math.max(0.01, Math.min(0.99, threshold))
    }
    if (probabilityThreshold !== undefined) {
      this.probabilityThreshold = Math.max(0.1, Math.min(0.99, probabilityThreshold))
    }
  }

  /**
   * Alternative: Méthode MPM (McLeod Pitch Method) pour comparaison
   */
  detectMPM(audioBuffer: Float32Array): PitchResult | null {
    if (audioBuffer.length < this.bufferSize) {
      return null
    }

    const nsdf = this.normalizedSquareDifference(audioBuffer)
    const peaks = this.findPeaks(nsdf)
    
    if (peaks.length === 0) {
      return null
    }

    // Prend le pic le plus haut au-dessus du seuil
    const bestPeak = peaks.find(peak => peak.value > this.probabilityThreshold) || peaks[0]
    
    if (bestPeak.value < 0.3) {
      return null
    }

    const frequency = this.sampleRate / bestPeak.index
    
    if (frequency < 70 || frequency > 2200) {
      return null
    }

    return {
      frequency,
      confidence: bestPeak.value,
      clarity: bestPeak.value
    }
  }

  /**
   * Calcul NSDF pour MPM
   */
  private normalizedSquareDifference(buffer: Float32Array): Float32Array {
    const nsdf = new Float32Array(buffer.length / 2)
    
    for (let tau = 0; tau < nsdf.length; tau++) {
      let acf = 0 // Autocorrélation
      let divisorM = 0 // Normalisation

      for (let i = 0; i < buffer.length - tau; i++) {
        acf += buffer[i] * buffer[i + tau]
        divisorM += buffer[i] * buffer[i] + buffer[i + tau] * buffer[i + tau]
      }

      nsdf[tau] = divisorM > 0 ? (2 * acf) / divisorM : 0
    }

    return nsdf
  }

  /**
   * Trouve les pics dans le signal NSDF
   */
  private findPeaks(nsdf: Float32Array): Array<{index: number, value: number}> {
    const peaks: Array<{index: number, value: number}> = []
    
    for (let i = 1; i < nsdf.length - 1; i++) {
      if (nsdf[i] > nsdf[i - 1] && nsdf[i] > nsdf[i + 1] && nsdf[i] > 0.1) {
        peaks.push({ index: i, value: nsdf[i] })
      }
    }

    // Trie par valeur décroissante
    return peaks.sort((a, b) => b.value - a.value)
  }
}
