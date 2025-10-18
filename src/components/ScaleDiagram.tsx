import React from 'react'
import { generateScaleNotes } from '../utils/scaleUtils'

export interface ScaleNote {
  fret: number
  string: number // 1-6 (1 = corde la plus aiguë, 6 = corde la plus grave)
  note: string // Nom de la note (C, D, E, F, G, A, B)
  isRoot: boolean // Si c'est la note fondamentale
  degree: number // Degré dans la gamme (1-7)
}

export interface ScaleData {
  name: string
  description: string
  pattern: Array<{ fret: number; string: number; degree: number; isRoot: boolean }>
  positions: number[] // Positions sur le manche (frettes de départ)
  difficulty: 'facile' | 'moyen' | 'difficile'
  tonality: 'majeure' | 'mineure' | 'modale' | 'pentatonique'
  rootNote: string // Note fondamentale
}

interface ScaleDiagramProps {
  scale: ScaleData
  position?: number // Position sur le manche (frette de départ)
  size?: 'small' | 'medium' | 'large'
  onPositionChange?: (position: number) => void
}

const ScaleDiagram: React.FC<ScaleDiagramProps> = ({
  scale,
  position = scale.positions[0],
  size = 'medium',
  onPositionChange
}) => {
  const sizeConfig = {
    small: { width: 200, height: 120, fretWidth: 25, stringSpacing: 18 },
    medium: { width: 280, height: 160, fretWidth: 35, stringSpacing: 24 },
    large: { width: 360, height: 200, fretWidth: 45, stringSpacing: 30 }
  }

  const config = sizeConfig[size]
  const { width, height, fretWidth, stringSpacing } = config

  // Calculer les positions des cordes et frettes
  const stringPositions = Array.from({ length: 6 }, (_, i) => (i * stringSpacing) + 20)
  const fretPositions = Array.from({ length: 5 }, (_, i) => (i * fretWidth) + 30)

  // Générer les notes pour la position sélectionnée
  const visibleNotes = generateScaleNotes(scale.pattern, position, scale.rootNote)

  // Couleurs pour les degrés de gamme
  const degreeColors = {
    1: '#ef4444', // Rouge - Tonique
    2: '#f97316', // Orange
    3: '#eab308', // Jaune
    4: '#22c55e', // Vert
    5: '#3b82f6', // Bleu
    6: '#8b5cf6', // Violet
    7: '#ec4899', // Rose
  }

  return (
    <div className="flex flex-col items-center space-y-3">
      {/* Nom de la gamme */}
      <div className="text-center">
        <h3 className={`font-bold text-bank-text ${size === 'small' ? 'text-base' : size === 'medium' ? 'text-lg' : 'text-xl'
          }`}>{scale.name}</h3>
        <p className="text-xs text-bank-text-light mt-1">{scale.description}</p>
      </div>

      {/* Sélecteur de position */}
      {scale.positions.length > 1 && (
        <div className="flex space-x-1">
          {scale.positions.map((pos, index) => (
            <button
              key={pos}
              onClick={() => onPositionChange?.(pos)}
              className={`px-2 py-1 text-xs rounded transition-all duration-200 ${position === pos
                ? 'bg-bank-blue text-white'
                : 'bg-bank-gray text-bank-text hover:bg-bank-gray-dark'
                }`}
            >
              Pos {index + 1}
            </button>
          ))}
        </div>
      )}

      {/* Diagramme SVG */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-3 shadow-sm">
        <svg width={width} height={height} className="overflow-visible">
          {/* Cordes (horizontales) */}
          {stringPositions.map((y, stringIndex) => (
            <line
              key={`string-${stringIndex}`}
              x1={20}
              y1={y}
              x2={width - 20}
              y2={y}
              stroke="#666"
              strokeWidth="1.5"
            />
          ))}

          {/* Frettes (verticales) */}
          {fretPositions.map((x, fretIndex) => (
            <line
              key={`fret-${fretIndex}`}
              x1={x}
              y1={15}
              x2={x}
              y2={height - 15}
              stroke="#666"
              strokeWidth="1.5"
            />
          ))}

          {/* Numéros de frettes */}
          {fretPositions.map((x, fretIndex) => (
            <text
              key={`fret-num-${fretIndex}`}
              x={x - (fretWidth / 2)}
              y={12}
              fontSize="10"
              fill="#666"
              textAnchor="middle"
              className="font-medium"
            >
              {position + fretIndex}
            </text>
          ))}

          {/* Notes de la gamme */}
          {visibleNotes.map((note, noteIndex) => {
            const stringY = stringPositions[6 - note.string] // Inverser pour avoir la 1ère corde en bas
            const fretX = fretPositions[note.fret - position] - (fretWidth / 2)
            const color = degreeColors[note.degree as keyof typeof degreeColors] || '#666'

            return (
              <g key={`note-${noteIndex}`}>
                <circle
                  cx={fretX}
                  cy={stringY}
                  r={note.isRoot ? "10" : "8"}
                  fill={color}
                  stroke={note.isRoot ? "#fff" : "none"}
                  strokeWidth={note.isRoot ? "2" : "0"}
                />
                <text
                  x={fretX}
                  y={stringY + 1}
                  fontSize={size === 'small' ? "8" : "9"}
                  fill="white"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold"
                >
                  {note.note}
                </text>
              </g>
            )
          })}

          {/* Noms des cordes */}
          {['E', 'B', 'G', 'D', 'A', 'E'].map((stringName, index) => (
            <text
              key={`string-name-${index}`}
              x={8}
              y={stringPositions[index] + 1}
              fontSize="10"
              fill="#666"
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-medium"
            >
              {stringName}
            </text>
          ))}
        </svg>
      </div>

      {/* Légende des degrés */}
      <div className="flex flex-wrap gap-1 justify-center">
        {[1, 2, 3, 4, 5, 6, 7].map(degree => {
          const hasNote = visibleNotes.some(note => note.degree === degree)
          if (!hasNote) return null

          return (
            <div key={degree} className="flex items-center space-x-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: degreeColors[degree as keyof typeof degreeColors] }}
              />
              <span className="text-xs text-bank-text-light">{degree}</span>
            </div>
          )
        })}
      </div>

      {/* Niveau de difficulté */}
      <div className={`px-2 py-1 rounded-full text-xs font-medium text-center ${scale.difficulty === 'facile' ? 'bg-green-100 text-green-700' :
        scale.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
        {scale.difficulty}
      </div>
    </div>
  )
}

export default ScaleDiagram
