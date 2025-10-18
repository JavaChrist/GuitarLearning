import React from 'react'

export interface ChordPosition {
  fret: number
  finger: number // 1-4 pour les doigts, 0 pour corde à vide, -1 pour corde non jouée
}

export interface ChordData {
  name: string
  positions: ChordPosition[] // 6 positions pour les 6 cordes (de la plus grave à la plus aiguë)
  baseFret: number // Frette de base (1 pour les accords ouverts)
  difficulty: 'facile' | 'moyen' | 'difficile'
}

interface ChordDiagramProps {
  chord: ChordData
  size?: 'small' | 'medium' | 'large'
}

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chord, size = 'medium' }) => {
  const sizeConfig = {
    small: { width: 80, height: 100, fretHeight: 12, stringSpacing: 12 },
    medium: { width: 120, height: 150, fretHeight: 18, stringSpacing: 18 },
    large: { width: 160, height: 200, fretHeight: 24, stringSpacing: 24 }
  }

  const config = sizeConfig[size]
  const { width, height, fretHeight, stringSpacing } = config

  // Calculer les positions des cordes et frettes
  const stringPositions = Array.from({ length: 6 }, (_, i) => (i * stringSpacing) + 20)
  const fretPositions = Array.from({ length: 5 }, (_, i) => (i * fretHeight) + 30)

  // Couleurs pour les doigts
  const fingerColors = {
    1: '#ef4444', // rouge
    2: '#f97316', // orange  
    3: '#eab308', // jaune
    4: '#22c55e', // vert
  }

  return (
    <div className="flex flex-col items-center space-y-2 w-full max-w-[140px]">
      {/* Nom de l'accord */}
      <h3 className={`font-bold text-bank-text ${size === 'small' ? 'text-base' : size === 'medium' ? 'text-lg' : 'text-xl'
        }`}>{chord.name}</h3>

      {/* Diagramme SVG */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-2 shadow-sm w-full flex justify-center">
        <svg width={width} height={height} className="overflow-visible">
          {/* Cordes (verticales) */}
          {stringPositions.map((x, stringIndex) => (
            <line
              key={`string-${stringIndex}`}
              x1={x}
              y1={20}
              x2={x}
              y2={height - 20}
              stroke="#666"
              strokeWidth="1.5"
            />
          ))}

          {/* Frettes (horizontales) */}
          {fretPositions.map((y, fretIndex) => (
            <line
              key={`fret-${fretIndex}`}
              x1={15}
              y1={y}
              x2={width - 15}
              y2={y}
              stroke="#666"
              strokeWidth={fretIndex === 0 && chord.baseFret === 1 ? "3" : "1.5"}
            />
          ))}

          {/* Numéro de frette de base si différent de 1 */}
          {chord.baseFret > 1 && (
            <text
              x={width - 5}
              y={35}
              fontSize="12"
              fill="#666"
              textAnchor="start"
              className="font-medium"
            >
              {chord.baseFret}fr
            </text>
          )}

          {/* Positions des doigts et cordes à vide */}
          {chord.positions.map((position, stringIndex) => {
            const x = stringPositions[stringIndex]

            if (position.finger === -1) {
              // Corde non jouée (X)
              return (
                <g key={`pos-${stringIndex}`}>
                  <line x1={x - 4} y1={8} x2={x + 4} y2={16} stroke="#ef4444" strokeWidth="2" />
                  <line x1={x + 4} y1={8} x2={x - 4} y2={16} stroke="#ef4444" strokeWidth="2" />
                </g>
              )
            } else if (position.finger === 0) {
              // Corde à vide (O)
              return (
                <circle
                  key={`pos-${stringIndex}`}
                  cx={x}
                  cy={12}
                  r="6"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
              )
            } else {
              // Doigt sur une frette
              const fretY = fretPositions[position.fret - chord.baseFret] - (fretHeight / 2)
              return (
                <g key={`pos-${stringIndex}`}>
                  <circle
                    cx={x}
                    cy={fretY}
                    r="8"
                    fill={fingerColors[position.finger as keyof typeof fingerColors] || '#666'}
                    stroke="#fff"
                    strokeWidth="1"
                  />
                  <text
                    x={x}
                    y={fretY + 1}
                    fontSize="10"
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-bold"
                  >
                    {position.finger}
                  </text>
                </g>
              )
            }
          })}
        </svg>
      </div>

      {/* Niveau de difficulté */}
      <div className={`px-2 py-1 rounded-full text-xs font-medium text-center w-full ${chord.difficulty === 'facile' ? 'bg-green-100 text-green-700' :
        chord.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-700'
        }`}>
        {chord.difficulty}
      </div>
    </div>
  )
}

export default ChordDiagram
