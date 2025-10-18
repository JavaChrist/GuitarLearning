// Fréquences guitare standard en Hz
export const GUITAR_TUNING = {
  E2: { frequency: 82.41, name: 'E', octave: 2, string: 6, label: '6ème corde (Mi grave)' },
  A2: { frequency: 110.00, name: 'A', octave: 2, string: 5, label: '5ème corde (La)' },
  D3: { frequency: 146.83, name: 'D', octave: 3, string: 4, label: '4ème corde (Ré)' },
  G3: { frequency: 196.00, name: 'G', octave: 3, string: 3, label: '3ème corde (Sol)' },
  B3: { frequency: 246.94, name: 'B', octave: 3, string: 2, label: '2ème corde (Si)' },
  E4: { frequency: 329.63, name: 'E', octave: 4, string: 1, label: '1ère corde (Mi aigu)' }
} as const

export type GuitarNote = keyof typeof GUITAR_TUNING

// Convertir une fréquence en cents (différence par rapport à la note cible)
export function frequencyToCents(frequency: number, targetFrequency: number): number {
  return Math.round(1200 * Math.log2(frequency / targetFrequency))
}

// Trouver la note la plus proche
export function findClosestNote(frequency: number): {
  note: GuitarNote
  cents: number
  accuracy: 'perfect' | 'good' | 'fair' | 'poor'
} {
  let closestNote: GuitarNote = 'E2'
  let minCentsDifference = Infinity

  for (const [note, info] of Object.entries(GUITAR_TUNING)) {
    const cents = Math.abs(frequencyToCents(frequency, info.frequency))
    if (cents < minCentsDifference) {
      minCentsDifference = cents
      closestNote = note as GuitarNote
    }
  }

  const cents = frequencyToCents(frequency, GUITAR_TUNING[closestNote].frequency)

  let accuracy: 'perfect' | 'good' | 'fair' | 'poor'
  if (Math.abs(cents) <= 5) accuracy = 'perfect'
  else if (Math.abs(cents) <= 15) accuracy = 'good'
  else if (Math.abs(cents) <= 30) accuracy = 'fair'
  else accuracy = 'poor'

  return { note: closestNote, cents, accuracy }
}
