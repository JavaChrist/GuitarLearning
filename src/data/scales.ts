import type { ScaleData } from '../components/ScaleDiagram'
import { PENTATONIC_MINOR_PATTERN, PENTATONIC_MAJOR_PATTERN } from '../utils/scaleUtils'

export interface ScaleGroup {
  name: string
  description: string
  icon: string
  scales: ScaleData[]
}

// Base de données complète des gammes de guitare
export const SCALE_GROUPS: ScaleGroup[] = [
  {
    name: 'Gammes Pentatoniques',
    description: 'Les gammes à 5 notes, essentielles pour le blues et le rock',
    icon: '🎸',
    scales: [
      {
        name: 'Pentatonique Mineure (Am)',
        description: 'La gamme la plus utilisée en blues et rock',
        pattern: PENTATONIC_MINOR_PATTERN,
        positions: [5, 7, 9, 12, 15],
        difficulty: 'facile',
        tonality: 'pentatonique',
        rootNote: 'A'
      },
      {
        name: 'Pentatonique Majeure (C)',
        description: 'Version majeure de la pentatonique, plus joyeuse',
        pattern: PENTATONIC_MAJOR_PATTERN,
        positions: [8, 10, 12, 15, 3],
        difficulty: 'facile',
        tonality: 'pentatonique',
        rootNote: 'C'
      }
    ]
  }
]

// Fonction utilitaire pour trouver une gamme par nom
export function findScaleByName(name: string): ScaleData | undefined {
  for (const group of SCALE_GROUPS) {
    const scale = group.scales.find(s => s.name.toLowerCase().includes(name.toLowerCase()))
    if (scale) return scale
  }
  return undefined
}
