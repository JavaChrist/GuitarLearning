import type { ChordData } from '../components/ChordDiagram'

export interface ChordGroup {
  name: string
  description: string
  icon: string
  chords: ChordData[]
}

// Base de données complète des accords de guitare
export const CHORD_GROUPS: ChordGroup[] = [
  {
    name: 'Accords Majeurs',
    description: 'Les accords majeurs essentiels pour débuter',
    icon: '😊',
    chords: [
      {
        name: 'C',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: 3, finger: 3 },   // 5ème corde, 3ème frette, annulaire
          { fret: 2, finger: 2 },   // 4ème corde, 2ème frette, majeur
          { fret: 1, finger: 1 },   // 3ème corde, 1ère frette, index
          { fret: 0, finger: 0 },   // 2ème corde (à vide)
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'moyen'
      },
      {
        name: 'G',
        positions: [
          { fret: 3, finger: 2 },   // 6ème corde, 3ème frette, majeur
          { fret: 2, finger: 1 },   // 5ème corde, 2ème frette, index
          { fret: 0, finger: 0 },   // 4ème corde (à vide)
          { fret: 0, finger: 0 },   // 3ème corde (à vide)
          { fret: 3, finger: 4 },   // 2ème corde, 3ème frette, auriculaire
          { fret: 3, finger: 3 }    // 1ère corde, 3ème frette, annulaire
        ],
        baseFret: 1,
        difficulty: 'moyen'
      },
      {
        name: 'D',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: -1, finger: -1 }, // 5ème corde (non jouée)
          { fret: 0, finger: 0 },   // 4ème corde (à vide)
          { fret: 2, finger: 1 },   // 3ème corde, 2ème frette, index
          { fret: 3, finger: 3 },   // 2ème corde, 3ème frette, annulaire
          { fret: 2, finger: 2 }    // 1ère corde, 2ème frette, majeur
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'A',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: 0, finger: 0 },   // 5ème corde (à vide)
          { fret: 2, finger: 2 },   // 4ème corde, 2ème frette, majeur
          { fret: 2, finger: 3 },   // 3ème corde, 2ème frette, annulaire
          { fret: 2, finger: 4 },   // 2ème corde, 2ème frette, auriculaire
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'E',
        positions: [
          { fret: 0, finger: 0 },   // 6ème corde (à vide)
          { fret: 2, finger: 2 },   // 5ème corde, 2ème frette, majeur
          { fret: 2, finger: 3 },   // 4ème corde, 2ème frette, annulaire
          { fret: 1, finger: 1 },   // 3ème corde, 1ère frette, index
          { fret: 0, finger: 0 },   // 2ème corde (à vide)
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'F',
        positions: [
          { fret: 1, finger: 1 },   // 6ème corde, 1ère frette, barré
          { fret: 1, finger: 1 },   // 5ème corde, 1ère frette, barré
          { fret: 3, finger: 3 },   // 4ème corde, 3ème frette, annulaire
          { fret: 3, finger: 4 },   // 3ème corde, 3ème frette, auriculaire
          { fret: 2, finger: 2 },   // 2ème corde, 2ème frette, majeur
          { fret: 1, finger: 1 }    // 1ère corde, 1ère frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      }
    ]
  },
  {
    name: 'Accords Mineurs',
    description: 'Les accords mineurs pour une sonorité plus mélancolique',
    icon: '😔',
    chords: [
      {
        name: 'Am',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: 0, finger: 0 },   // 5ème corde (à vide)
          { fret: 2, finger: 2 },   // 4ème corde, 2ème frette, majeur
          { fret: 2, finger: 3 },   // 3ème corde, 2ème frette, annulaire
          { fret: 1, finger: 1 },   // 2ème corde, 1ère frette, index
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'Em',
        positions: [
          { fret: 0, finger: 0 },   // 6ème corde (à vide)
          { fret: 2, finger: 2 },   // 5ème corde, 2ème frette, majeur
          { fret: 2, finger: 3 },   // 4ème corde, 2ème frette, annulaire
          { fret: 0, finger: 0 },   // 3ème corde (à vide)
          { fret: 0, finger: 0 },   // 2ème corde (à vide)
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'Dm',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: -1, finger: -1 }, // 5ème corde (non jouée)
          { fret: 0, finger: 0 },   // 4ème corde (à vide)
          { fret: 2, finger: 2 },   // 3ème corde, 2ème frette, majeur
          { fret: 3, finger: 4 },   // 2ème corde, 3ème frette, auriculaire
          { fret: 1, finger: 1 }    // 1ère corde, 1ère frette, index
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'Bm',
        positions: [
          { fret: 2, finger: 1 },   // 6ème corde, 2ème frette, barré
          { fret: 2, finger: 1 },   // 5ème corde, 2ème frette, barré
          { fret: 4, finger: 3 },   // 4ème corde, 4ème frette, annulaire
          { fret: 4, finger: 4 },   // 3ème corde, 4ème frette, auriculaire
          { fret: 3, finger: 2 },   // 2ème corde, 3ème frette, majeur
          { fret: 2, finger: 1 }    // 1ère corde, 2ème frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      },
      {
        name: 'Fm',
        positions: [
          { fret: 1, finger: 1 },   // 6ème corde, 1ère frette, barré
          { fret: 1, finger: 1 },   // 5ème corde, 1ère frette, barré
          { fret: 3, finger: 3 },   // 4ème corde, 3ème frette, annulaire
          { fret: 3, finger: 4 },   // 3ème corde, 3ème frette, auriculaire
          { fret: 1, finger: 1 },   // 2ème corde, 1ère frette, barré
          { fret: 1, finger: 1 }    // 1ère corde, 1ère frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      },
      {
        name: 'Cm',
        positions: [
          { fret: 3, finger: 1 },   // 6ème corde, 3ème frette, barré
          { fret: 3, finger: 1 },   // 5ème corde, 3ème frette, barré
          { fret: 5, finger: 3 },   // 4ème corde, 5ème frette, annulaire
          { fret: 5, finger: 4 },   // 3ème corde, 5ème frette, auriculaire
          { fret: 4, finger: 2 },   // 2ème corde, 4ème frette, majeur
          { fret: 3, finger: 1 }    // 1ère corde, 3ème frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      }
    ]
  },
  {
    name: 'Accords de 7ème',
    description: 'Accords avec une sonorité jazz et blues',
    icon: '🎷',
    chords: [
      {
        name: 'G7',
        positions: [
          { fret: 3, finger: 3 },   // 6ème corde, 3ème frette, annulaire
          { fret: 2, finger: 2 },   // 5ème corde, 2ème frette, majeur
          { fret: 0, finger: 0 },   // 4ème corde (à vide)
          { fret: 0, finger: 0 },   // 3ème corde (à vide)
          { fret: 0, finger: 0 },   // 2ème corde (à vide)
          { fret: 1, finger: 1 }    // 1ère corde, 1ère frette, index
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'C7',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: 3, finger: 3 },   // 5ème corde, 3ème frette, annulaire
          { fret: 2, finger: 2 },   // 4ème corde, 2ème frette, majeur
          { fret: 3, finger: 4 },   // 3ème corde, 3ème frette, auriculaire
          { fret: 1, finger: 1 },   // 2ème corde, 1ère frette, index
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'moyen'
      },
      {
        name: 'D7',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: -1, finger: -1 }, // 5ème corde (non jouée)
          { fret: 0, finger: 0 },   // 4ème corde (à vide)
          { fret: 2, finger: 2 },   // 3ème corde, 2ème frette, majeur
          { fret: 1, finger: 1 },   // 2ème corde, 1ère frette, index
          { fret: 2, finger: 3 }    // 1ère corde, 2ème frette, annulaire
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'A7',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: 0, finger: 0 },   // 5ème corde (à vide)
          { fret: 2, finger: 2 },   // 4ème corde, 2ème frette, majeur
          { fret: 0, finger: 0 },   // 3ème corde (à vide)
          { fret: 2, finger: 3 },   // 2ème corde, 2ème frette, annulaire
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'E7',
        positions: [
          { fret: 0, finger: 0 },   // 6ème corde (à vide)
          { fret: 2, finger: 2 },   // 5ème corde, 2ème frette, majeur
          { fret: 0, finger: 0 },   // 4ème corde (à vide)
          { fret: 1, finger: 1 },   // 3ème corde, 1ère frette, index
          { fret: 0, finger: 0 },   // 2ème corde (à vide)
          { fret: 0, finger: 0 }    // 1ère corde (à vide)
        ],
        baseFret: 1,
        difficulty: 'facile'
      },
      {
        name: 'B7',
        positions: [
          { fret: -1, finger: -1 }, // 6ème corde (non jouée)
          { fret: 2, finger: 2 },   // 5ème corde, 2ème frette, majeur
          { fret: 1, finger: 1 },   // 4ème corde, 1ère frette, index
          { fret: 2, finger: 3 },   // 3ème corde, 2ème frette, annulaire
          { fret: 0, finger: 0 },   // 2ème corde (à vide)
          { fret: 2, finger: 4 }    // 1ère corde, 2ème frette, auriculaire
        ],
        baseFret: 1,
        difficulty: 'moyen'
      }
    ]
  },
  {
    name: 'Accords Barrés',
    description: 'Accords barrés pour les guitaristes avancés',
    icon: '💪',
    chords: [
      {
        name: 'F',
        positions: [
          { fret: 1, finger: 1 },   // 6ème corde, 1ère frette, barré
          { fret: 1, finger: 1 },   // 5ème corde, 1ère frette, barré
          { fret: 3, finger: 3 },   // 4ème corde, 3ème frette, annulaire
          { fret: 3, finger: 4 },   // 3ème corde, 3ème frette, auriculaire
          { fret: 2, finger: 2 },   // 2ème corde, 2ème frette, majeur
          { fret: 1, finger: 1 }    // 1ère corde, 1ère frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      },
      {
        name: 'Bm',
        positions: [
          { fret: 2, finger: 1 },   // 6ème corde, 2ème frette, barré
          { fret: 2, finger: 1 },   // 5ème corde, 2ème frette, barré
          { fret: 4, finger: 3 },   // 4ème corde, 4ème frette, annulaire
          { fret: 4, finger: 4 },   // 3ème corde, 4ème frette, auriculaire
          { fret: 3, finger: 2 },   // 2ème corde, 3ème frette, majeur
          { fret: 2, finger: 1 }    // 1ère corde, 2ème frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      },
      {
        name: 'F#m',
        positions: [
          { fret: 2, finger: 1 },   // 6ème corde, 2ème frette, barré
          { fret: 2, finger: 1 },   // 5ème corde, 2ème frette, barré
          { fret: 4, finger: 3 },   // 4ème corde, 4ème frette, annulaire
          { fret: 4, finger: 4 },   // 3ème corde, 4ème frette, auriculaire
          { fret: 2, finger: 1 },   // 2ème corde, 2ème frette, barré
          { fret: 2, finger: 1 }    // 1ère corde, 2ème frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      },
      {
        name: 'B',
        positions: [
          { fret: 2, finger: 1 },   // 6ème corde, 2ème frette, barré
          { fret: 2, finger: 1 },   // 5ème corde, 2ème frette, barré
          { fret: 4, finger: 3 },   // 4ème corde, 4ème frette, annulaire
          { fret: 4, finger: 4 },   // 3ème corde, 4ème frette, auriculaire
          { fret: 4, finger: 4 },   // 2ème corde, 4ème frette, auriculaire
          { fret: 2, finger: 1 }    // 1ère corde, 2ème frette, barré
        ],
        baseFret: 1,
        difficulty: 'difficile'
      }
    ]
  }
]

// Fonction utilitaire pour trouver un accord par nom
export function findChordByName(name: string): ChordData | undefined {
  for (const group of CHORD_GROUPS) {
    const chord = group.chords.find(c => c.name.toLowerCase() === name.toLowerCase())
    if (chord) return chord
  }
  return undefined
}
