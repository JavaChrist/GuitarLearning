/**
 * Sélecteur de corde pour l'accordeur
 * Mode auto / corde ciblée avec presets d'accordages
 */

import React from 'react'
import { Music, Target } from 'lucide-react'
import type { TuningPreset } from '../../tuner/TunerEngine'

interface StringSelectorProps {
  mode: 'auto' | 'string'
  currentPreset: TuningPreset
  targetStringIndex: number
  tuningPresets: TuningPreset[]
  onModeChange: (mode: 'auto' | 'string') => void
  onStringSelect: (stringIndex: number) => void
  onPresetChange: (presetIndex: number) => void
  className?: string
}

const StringSelector: React.FC<StringSelectorProps> = ({
  mode,
  currentPreset,
  targetStringIndex,
  tuningPresets,
  onModeChange,
  onStringSelect,
  onPresetChange,
  className = ''
}) => {
  // Couleurs pour chaque corde (de la plus grave à la plus aiguë)
  const stringColors = [
    'bg-red-500 hover:bg-red-600',      // E2 (6ème corde)
    'bg-orange-500 hover:bg-orange-600', // A2 (5ème corde)
    'bg-yellow-500 hover:bg-yellow-600', // D3 (4ème corde)
    'bg-green-500 hover:bg-green-600',   // G3 (3ème corde)
    'bg-blue-500 hover:bg-blue-600',     // B3 (2ème corde)
    'bg-purple-500 hover:bg-purple-600'  // E4 (1ère corde)
  ]

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Sélecteur de mode */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => onModeChange('auto')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors duration-200 ${
            mode === 'auto'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Music className="w-4 h-4" />
          <span className="font-medium">Auto</span>
        </button>
        
        <button
          onClick={() => onModeChange('string')}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors duration-200 ${
            mode === 'string'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span className="font-medium">Corde</span>
        </button>
      </div>

      {/* Mode corde spécifique */}
      {mode === 'string' && (
        <div className="space-y-3">
          {/* Sélecteur d'accordage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accordage
            </label>
            <select
              value={tuningPresets.findIndex(preset => preset.name === currentPreset.name)}
              onChange={(e) => onPresetChange(parseInt(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {tuningPresets.map((preset, index) => (
                <option key={preset.name} value={index}>
                  {preset.nameFr} ({preset.name})
                </option>
              ))}
            </select>
          </div>

          {/* Sélecteur de corde */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Corde cible
            </label>
            <div className="grid grid-cols-6 gap-2">
              {currentPreset.notes.map((note, index) => {
                const isSelected = targetStringIndex === index
                const stringNumber = currentPreset.notes.length - index // 6, 5, 4, 3, 2, 1
                const frequency = currentPreset.frequencies[index]
                
                return (
                  <button
                    key={index}
                    onClick={() => onStringSelect(index)}
                    className={`relative p-3 rounded-lg text-white font-bold transition-all duration-200 ${
                      isSelected
                        ? `${stringColors[index]} ring-2 ring-offset-2 ring-blue-500 scale-105`
                        : `${stringColors[index]} opacity-75 hover:opacity-100`
                    }`}
                  >
                    {/* Numéro de corde */}
                    <div className="text-xs opacity-75 leading-none">
                      {stringNumber}
                    </div>
                    
                    {/* Note */}
                    <div className="text-lg leading-none">
                      {note}
                    </div>
                    
                    {/* Fréquence */}
                    <div className="text-xs opacity-75 leading-none">
                      {frequency.toFixed(0)}Hz
                    </div>

                    {/* Indicateur de sélection */}
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Légende */}
          <div className="text-xs text-gray-500 text-center">
            Cliquez sur une corde pour l'accorder spécifiquement
          </div>
        </div>
      )}

      {/* Mode automatique */}
      {mode === 'auto' && (
        <div className="text-center py-4">
          <div className="text-gray-600 mb-2">
            <Music className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Mode automatique</p>
          </div>
          <div className="text-sm text-gray-500">
            L'accordeur détecte automatiquement la note jouée
          </div>
        </div>
      )}

      {/* Visualisation de l'accordage actuel */}
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="text-sm font-medium text-gray-700 mb-2">
          {currentPreset.nameFr}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          {currentPreset.notes.map((note, index) => (
            <div key={index} className="text-center">
              <div className="font-medium">{note}</div>
              <div className="text-gray-500">
                {currentPreset.frequencies[index].toFixed(0)}Hz
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StringSelector
