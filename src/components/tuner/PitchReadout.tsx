/**
 * Affichage de la note détectée avec octave et fréquence
 */

import React from 'react'

interface PitchReadoutProps {
  noteName: string
  noteNameFr: string
  octave: number
  frequency: number
  isActive: boolean
  confidence: number
  useFrenchNames?: boolean
  className?: string
}

const PitchReadout: React.FC<PitchReadoutProps> = ({
  noteName,
  noteNameFr,
  octave,
  frequency,
  isActive,
  confidence,
  useFrenchNames = true,
  className = ''
}) => {
  const displayNoteName = useFrenchNames ? noteNameFr : noteName

  return (
    <div className={`text-center space-y-2 ${className}`}>
      {/* Note principale */}
      <div className="flex items-center justify-center space-x-2">
        <div className={`text-6xl font-bold transition-all duration-200 ${
          !isActive 
            ? 'text-gray-300' 
            : confidence > 0.9
              ? 'text-gray-900'
              : confidence > 0.7
                ? 'text-gray-700'
                : 'text-gray-500'
        }`}>
          {isActive ? displayNoteName : '--'}
        </div>
        
        {/* Octave */}
        <div className={`text-2xl font-medium transition-colors duration-200 ${
          !isActive 
            ? 'text-gray-300' 
            : 'text-gray-600'
        }`}>
          {isActive ? octave : '-'}
        </div>
      </div>

      {/* Fréquence */}
      <div className={`text-lg font-medium transition-colors duration-200 ${
        !isActive 
          ? 'text-gray-400' 
          : 'text-gray-700'
      }`}>
        {isActive ? `${frequency.toFixed(1)} Hz` : '--- Hz'}
      </div>

      {/* Barre de confiance */}
      {isActive && (
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="text-gray-500">Confiance:</span>
          <div className="flex-1 max-w-32 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${
                confidence > 0.9 
                  ? 'bg-green-500' 
                  : confidence > 0.7 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(confidence * 100, 100)}%` }}
            />
          </div>
          <span className="text-gray-600 font-medium min-w-[3ch]">
            {Math.round(confidence * 100)}%
          </span>
        </div>
      )}

      {/* Alternative anglaise/française */}
      {isActive && noteName !== noteNameFr && (
        <div className="text-sm text-gray-500">
          ({useFrenchNames ? noteName : noteNameFr})
        </div>
      )}
    </div>
  )
}

export default PitchReadout
