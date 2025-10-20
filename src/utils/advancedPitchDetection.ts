// Améliorations inspirées de GuitarTuna pour ton accordeur

// Filtre passe-bas pour supprimer les hautes fréquences parasites
export function lowPassFilter(data: Float32Array, cutoffFreq: number, sampleRate: number): Float32Array {
  const filtered = new Float32Array(data.length)
  const rc = 1.0 / (cutoffFreq * 2 * Math.PI)
  const dt = 1.0 / sampleRate
  const alpha = dt / (rc + dt)

  filtered[0] = data[0]
  for (let i = 1; i < data.length; i++) {
    filtered[i] = alpha * data[i] + (1 - alpha) * filtered[i - 1]
  }

  return filtered
}

// Normalisation adaptative du signal
export function adaptiveNormalize(data: Float32Array): Float32Array {
  const normalized = new Float32Array(data.length)

  // Trouver le pic maximum
  let maxAbs = 0
  for (let i = 0; i < data.length; i++) {
    maxAbs = Math.max(maxAbs, Math.abs(data[i]))
  }

  // Normaliser seulement si le signal est assez fort
  if (maxAbs > 0.01) {
    const scale = 0.8 / maxAbs // Normaliser à 80% pour éviter la saturation
    for (let i = 0; i < data.length; i++) {
      normalized[i] = data[i] * scale
    }
  } else {
    // Signal trop faible, retourner tel quel
    normalized.set(data)
  }

  return normalized
}

// Fenêtrage de Hamming pour réduire les artefacts
export function hammingWindow(data: Float32Array): Float32Array {
  const windowed = new Float32Array(data.length)
  const N = data.length

  for (let i = 0; i < N; i++) {
    const window = 0.54 - 0.46 * Math.cos(2 * Math.PI * i / (N - 1))
    windowed[i] = data[i] * window
  }

  return windowed
}

// Médiane mobile pour lisser les résultats
export class MedianFilter {
  private buffer: number[] = []
  private size: number

  constructor(size: number = 5) {
    this.size = size
  }

  filter(value: number): number {
    this.buffer.push(value)
    if (this.buffer.length > this.size) {
      this.buffer.shift()
    }

    // Calculer la médiane
    const sorted = [...this.buffer].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)

    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid]
  }

  reset() {
    this.buffer = []
  }
}

// Validateur de cohérence temporelle
export class PitchValidator {
  private recentPitches: number[] = []
  private confidence: number = 0
  private lastValidPitch: number | null = null

  validate(pitch: number, signalStrength: number): { pitch: number | null; confidence: number } {
    // Ajouter à l'historique
    this.recentPitches.push(pitch)
    if (this.recentPitches.length > 10) {
      this.recentPitches.shift()
    }

    // Calculer la variance des mesures récentes
    if (this.recentPitches.length >= 3) {
      const mean = this.recentPitches.reduce((sum, p) => sum + p, 0) / this.recentPitches.length
      const variance = this.recentPitches.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / this.recentPitches.length
      const stdDev = Math.sqrt(variance)

      // Si la variance est faible (mesures cohérentes), augmenter la confiance
      const stability = Math.max(0, 1 - stdDev / 10) // Normaliser la stabilité
      const strengthFactor = Math.min(1, signalStrength / 10) // Factor de force du signal

      this.confidence = (stability * 0.7 + strengthFactor * 0.3) * 100

      // Valider seulement si confiance > 50% et proche des mesures précédentes
      if (this.confidence > 50 && stdDev < 5) {
        this.lastValidPitch = mean
        return { pitch: mean, confidence: this.confidence }
      }
    }

    // Pas assez de confiance
    return { pitch: null, confidence: this.confidence }
  }

  reset() {
    this.recentPitches = []
    this.confidence = 0
    this.lastValidPitch = null
  }
}

// Détecteur de fondamentale amélioré (anti-harmoniques)
export function findFundamental(frequency: number): number {
  // Si la fréquence est dans la gamme guitare, la retourner
  if (frequency >= 70 && frequency <= 400) {
    return frequency
  }

  // Sinon, essayer de trouver la fondamentale par division simple
  // Tester d'abord les divisions qui donnent des notes de guitare précises
  const guitarTargets = [82.41, 110.00, 146.83, 196.00, 246.94, 329.63]

  // Chercher la division qui donne la note la plus proche
  let bestMatch: { fundamental: number; divisor: number; error: number } | null = null

  for (let divisor = 2; divisor <= 500; divisor++) {
    const fundamental = frequency / divisor

    // Vérifier si c'est dans la gamme guitare
    if (fundamental >= 70 && fundamental <= 400) {
      // Calculer l'erreur par rapport aux notes de guitare standard
      for (const target of guitarTargets) {
        const error = Math.abs(fundamental - target)
        if (!bestMatch || error < bestMatch.error) {
          bestMatch = { fundamental, divisor, error }
        }
      }
    }
  }

  // Si on a trouvé une bonne correspondance (erreur < 5 Hz)
  if (bestMatch && bestMatch.error < 5) {
    console.log(`🎯 Fondamentale PRÉCISE: ${bestMatch.fundamental.toFixed(1)} Hz (était ${frequency.toFixed(1)} Hz ÷ ${bestMatch.divisor}, erreur: ${bestMatch.error.toFixed(1)} Hz)`)
    return bestMatch.fundamental
  }

  // Sinon, utiliser la première division dans la gamme
  for (let divisor = 2; divisor <= 500; divisor++) {
    const fundamental = frequency / divisor
    if (fundamental >= 70 && fundamental <= 400) {
      console.log(`🎯 Fondamentale trouvée: ${fundamental.toFixed(1)} Hz (était ${frequency.toFixed(1)} Hz ÷ ${divisor})`)
      return fundamental
    }
  }

  // Aucune fondamentale trouvée
  console.log(`❌ Aucune fondamentale trouvée pour ${frequency.toFixed(1)} Hz`)
  return frequency
}
