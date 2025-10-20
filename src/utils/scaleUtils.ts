import type { ScaleNote } from '../components/ScaleDiagram'

// Notes chromatiques
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

// Accordage standard de la guitare (notes à vide)
const OPEN_STRINGS = ['E', 'B', 'G', 'D', 'A', 'E'] // De la 1ère à la 6ème corde

// Convertir une note en index chromatique
function noteToIndex(note: string): number {
  return CHROMATIC_NOTES.indexOf(note)
}

// Convertir un index chromatique en note
function indexToNote(index: number): string {
  return CHROMATIC_NOTES[index % 12]
}

// Obtenir la note à une frette donnée sur une corde donnée
function getNoteAtFret(string: number, fret: number): string {
  const openNote = OPEN_STRINGS[string - 1] // string 1-6 -> index 0-5
  const openIndex = noteToIndex(openNote)
  return indexToNote(openIndex + fret)
}

// Pattern de base pour la pentatonique mineure (position relative)
export const PENTATONIC_MINOR_PATTERN = [
  { fret: 0, string: 6, degree: 1, isRoot: true },   // Tonique sur 6ème corde
  { fret: 3, string: 6, degree: 3, isRoot: false },  // 3ème sur 6ème corde
  { fret: 0, string: 5, degree: 4, isRoot: false },  // 4ème sur 5ème corde
  { fret: 2, string: 5, degree: 5, isRoot: false },  // 5ème sur 5ème corde
  { fret: 3, string: 5, degree: 6, isRoot: false },  // 6ème sur 5ème corde
  { fret: 0, string: 4, degree: 7, isRoot: false },  // 7ème sur 4ème corde
  { fret: 2, string: 4, degree: 1, isRoot: true },   // Tonique sur 4ème corde
  { fret: 0, string: 3, degree: 3, isRoot: false },  // 3ème sur 3ème corde
  { fret: 2, string: 3, degree: 4, isRoot: false },  // 4ème sur 3ème corde
  { fret: 0, string: 2, degree: 5, isRoot: false },  // 5ème sur 2ème corde
  { fret: 3, string: 2, degree: 7, isRoot: false },  // 7ème sur 2ème corde
  { fret: 0, string: 1, degree: 1, isRoot: true },   // Tonique sur 1ère corde
  { fret: 3, string: 1, degree: 3, isRoot: false },  // 3ème sur 1ère corde
]

// Pattern pour la pentatonique majeure
export const PENTATONIC_MAJOR_PATTERN = [
  { fret: 0, string: 6, degree: 1, isRoot: true },   // Tonique
  { fret: 2, string: 6, degree: 2, isRoot: false },  // 2ème
  { fret: 4, string: 6, degree: 3, isRoot: false },  // 3ème
  { fret: 2, string: 5, degree: 3, isRoot: false },  // 3ème
  { fret: 4, string: 5, degree: 5, isRoot: false },  // 5ème
  { fret: 2, string: 4, degree: 6, isRoot: false },  // 6ème
  { fret: 4, string: 4, degree: 1, isRoot: true },   // Tonique
  { fret: 2, string: 3, degree: 2, isRoot: false },  // 2ème
  { fret: 4, string: 3, degree: 3, isRoot: false },  // 3ème
  { fret: 2, string: 2, degree: 5, isRoot: false },  // 5ème
  { fret: 4, string: 2, degree: 6, isRoot: false },  // 6ème
  { fret: 2, string: 1, degree: 1, isRoot: true },   // Tonique
  { fret: 4, string: 1, degree: 2, isRoot: false },  // 2ème
]

// Pattern pour la gamme majeure
export const MAJOR_SCALE_PATTERN = [
  { fret: 0, string: 6, degree: 1, isRoot: true },   // Tonique
  { fret: 2, string: 6, degree: 2, isRoot: false },  // 2ème
  { fret: 4, string: 6, degree: 3, isRoot: false },  // 3ème
  { fret: 2, string: 5, degree: 3, isRoot: false },  // 3ème
  { fret: 3, string: 5, degree: 4, isRoot: false },  // 4ème
  { fret: 0, string: 5, degree: 5, isRoot: false },  // 5ème (corde à vide décalée)
  { fret: 2, string: 5, degree: 6, isRoot: false },  // 6ème
  { fret: 4, string: 4, degree: 7, isRoot: false },  // 7ème
  { fret: 0, string: 4, degree: 1, isRoot: true },   // Tonique
  { fret: 2, string: 4, degree: 2, isRoot: false },  // 2ème
  { fret: 4, string: 3, degree: 3, isRoot: false },  // 3ème
  { fret: 0, string: 3, degree: 4, isRoot: false },  // 4ème
  { fret: 2, string: 3, degree: 5, isRoot: false },  // 5ème
  { fret: 4, string: 2, degree: 6, isRoot: false },  // 6ème
  { fret: 0, string: 2, degree: 7, isRoot: false },  // 7ème
  { fret: 2, string: 2, degree: 1, isRoot: true },   // Tonique
  { fret: 0, string: 1, degree: 1, isRoot: true },   // Tonique
  { fret: 2, string: 1, degree: 2, isRoot: false },  // 2ème
  { fret: 4, string: 1, degree: 3, isRoot: false },  // 3ème
]

// Générer les notes pour une position donnée
export function generateScaleNotes(
  pattern: Array<{ fret: number; string: number; degree: number; isRoot: boolean }>,
  position: number,
  _rootNote: string // Préfixe _ pour indiquer que c'est intentionnellement inutilisé pour l'instant
): ScaleNote[] {
  return pattern.map(patternNote => {
    const actualFret = position + patternNote.fret
    const actualNote = getNoteAtFret(patternNote.string, actualFret)
    
    return {
      fret: actualFret,
      string: patternNote.string,
      note: actualNote,
      degree: patternNote.degree,
      isRoot: patternNote.isRoot
    }
  })
}

// Calculer l'intervalle entre deux notes
export function getInterval(fromNote: string, toNote: string): number {
  const fromIndex = noteToIndex(fromNote)
  const toIndex = noteToIndex(toNote)
  return (toIndex - fromIndex + 12) % 12
}

// Transposer un pattern vers une nouvelle tonalité
export function transposePattern(
  pattern: Array<{ fret: number; string: number; degree: number; isRoot: boolean }>,
  fromRoot: string,
  toRoot: string
): Array<{ fret: number; string: number; degree: number; isRoot: boolean }> {
  const interval = getInterval(fromRoot, toRoot)

  return pattern.map(patternNote => ({
    ...patternNote,
    fret: patternNote.fret + interval
  }))
}


