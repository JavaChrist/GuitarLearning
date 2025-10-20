import type { TablatureData } from '../components/AnimatedTablature'

// Exercices de tablature animée
export const PENTATONIC_EXERCISES: TablatureData[] = [
  {
    title: 'Pentatonique Mineure Am - Position 1 (Montée)',
    tempo: 120,
    notes: [
      // Montée de la pentatonique mineure en Am (5ème position)
      { string: 6, fret: 5, duration: 480, note: 'A' },   // 6ème corde, 5ème frette (A)
      { string: 6, fret: 8, duration: 480, note: 'C' },   // 6ème corde, 8ème frette (C)
      { string: 5, fret: 5, duration: 480, note: 'D' },   // 5ème corde, 5ème frette (D)
      { string: 5, fret: 7, duration: 480, note: 'E' },   // 5ème corde, 7ème frette (E)
      { string: 5, fret: 8, duration: 480, note: 'G' },   // 5ème corde, 8ème frette (G)
      { string: 4, fret: 5, duration: 480, note: 'G' },   // 4ème corde, 5ème frette (G)
      { string: 4, fret: 7, duration: 480, note: 'A' },   // 4ème corde, 7ème frette (A)
      { string: 3, fret: 5, duration: 480, note: 'C' },   // 3ème corde, 5ème frette (C)
      { string: 3, fret: 7, duration: 480, note: 'D' },   // 3ème corde, 7ème frette (D)
      { string: 2, fret: 5, duration: 480, note: 'E' },   // 2ème corde, 5ème frette (E)
      { string: 2, fret: 8, duration: 480, note: 'G' },   // 2ème corde, 8ème frette (G)
      { string: 1, fret: 5, duration: 480, note: 'A' },   // 1ère corde, 5ème frette (A)
      { string: 1, fret: 8, duration: 480, note: 'C' },   // 1ère corde, 8ème frette (C)
    ]
  },
  {
    title: 'Pentatonique Mineure Am - Descente',
    tempo: 120,
    notes: [
      // Descente de la pentatonique mineure en Am
      { string: 1, fret: 8, duration: 480, note: 'C' },   // 1ère corde, 8ème frette (C)
      { string: 1, fret: 5, duration: 480, note: 'A' },   // 1ère corde, 5ème frette (A)
      { string: 2, fret: 8, duration: 480, note: 'G' },   // 2ème corde, 8ème frette (G)
      { string: 2, fret: 5, duration: 480, note: 'E' },   // 2ème corde, 5ème frette (E)
      { string: 3, fret: 7, duration: 480, note: 'D' },   // 3ème corde, 7ème frette (D)
      { string: 3, fret: 5, duration: 480, note: 'C' },   // 3ème corde, 5ème frette (C)
      { string: 4, fret: 7, duration: 480, note: 'A' },   // 4ème corde, 7ème frette (A)
      { string: 4, fret: 5, duration: 480, note: 'G' },   // 4ème corde, 5ème frette (G)
      { string: 5, fret: 8, duration: 480, note: 'G' },   // 5ème corde, 8ème frette (G)
      { string: 5, fret: 7, duration: 480, note: 'E' },   // 5ème corde, 7ème frette (E)
      { string: 5, fret: 5, duration: 480, note: 'D' },   // 5ème corde, 5ème frette (D)
      { string: 6, fret: 8, duration: 480, note: 'C' },   // 6ème corde, 8ème frette (C)
      { string: 6, fret: 5, duration: 480, note: 'A' },   // 6ème corde, 5ème frette (A)
    ]
  },
  {
    title: 'Lick Blues Pentatonique - Classique',
    tempo: 140,
    notes: [
      // Lick blues classique en Am
      { string: 1, fret: 8, duration: 240, note: 'C' },   // Rapide
      { string: 1, fret: 5, duration: 240, note: 'A' },
      { string: 2, fret: 8, duration: 480, note: 'G' },   // Plus long
      { string: 2, fret: 5, duration: 240, note: 'E' },
      { string: 3, fret: 7, duration: 240, note: 'D' },
      { string: 3, fret: 5, duration: 960, note: 'C' },   // Note tenue
      { string: 4, fret: 7, duration: 480, note: 'A' },
      { string: 4, fret: 5, duration: 480, note: 'G' },
    ]
  },
  {
    title: 'Exercice Technique - Hammer-on/Pull-off',
    tempo: 100,
    notes: [
      // Simulation d'hammer-on et pull-off
      { string: 1, fret: 5, duration: 240, note: 'A' },
      { string: 1, fret: 8, duration: 240, note: 'C' },   // Hammer-on
      { string: 1, fret: 5, duration: 240, note: 'A' },   // Pull-off
      { string: 2, fret: 5, duration: 240, note: 'E' },
      { string: 2, fret: 8, duration: 240, note: 'G' },
      { string: 2, fret: 5, duration: 240, note: 'E' },
      { string: 3, fret: 5, duration: 240, note: 'C' },
      { string: 3, fret: 7, duration: 240, note: 'D' },
      { string: 3, fret: 5, duration: 240, note: 'C' },
      { string: 4, fret: 5, duration: 480, note: 'G' },
    ]
  },
  {
    title: 'Pentatonique Majeure C - Joyeuse',
    tempo: 130,
    notes: [
      // Pentatonique majeure en C (8ème position)
      { string: 6, fret: 8, duration: 480, note: 'C' },
      { string: 6, fret: 10, duration: 480, note: 'D' },
      { string: 5, fret: 7, duration: 480, note: 'E' },
      { string: 5, fret: 9, duration: 480, note: 'G' },
      { string: 5, fret: 10, duration: 480, note: 'A' },
      { string: 4, fret: 7, duration: 480, note: 'A' },
      { string: 4, fret: 9, duration: 480, note: 'C' },
      { string: 4, fret: 10, duration: 480, note: 'D' },
      { string: 3, fret: 9, duration: 480, note: 'E' },
      { string: 3, fret: 10, duration: 480, note: 'G' },
      { string: 2, fret: 8, duration: 480, note: 'G' },
      { string: 2, fret: 10, duration: 480, note: 'A' },
      { string: 1, fret: 8, duration: 480, note: 'C' },
    ]
  }
]

// Fonction pour trouver un exercice par nom
export function findExerciseByName(name: string): TablatureData | undefined {
  return PENTATONIC_EXERCISES.find(ex => ex.title.toLowerCase().includes(name.toLowerCase()))
}


