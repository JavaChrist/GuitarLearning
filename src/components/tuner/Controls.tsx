/**
 * Contrôles de l'accordeur
 * Calibration A4, sensibilité, mute, son de référence
 */

import React, { useState } from 'react'
import { Settings, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react'

interface ControlsProps {
  a4Hz: number
  sensitivity: number
  noiseGateThreshold: number
  isReferenceAudioPlaying: boolean
  referenceFrequency?: number
  onA4Change: (a4Hz: number) => void
  onSensitivityChange: (sensitivity: number) => void
  onNoiseGateThresholdChange: (threshold: number) => void
  onReferenceAudioToggle: () => void
  onResetToDefaults: () => void
  className?: string
}

const Controls: React.FC<ControlsProps> = ({
  a4Hz,
  sensitivity,
  noiseGateThreshold,
  isReferenceAudioPlaying,
  referenceFrequency,
  onA4Change,
  onSensitivityChange,
  onNoiseGateThresholdChange,
  onReferenceAudioToggle,
  onResetToDefaults,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Contrôles principaux */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
        
        {/* Calibration A4 */}
        <div>
          <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
            <span>Calibration A4</span>
            <span className="text-blue-600 font-mono">{a4Hz.toFixed(1)} Hz</span>
          </label>
          <div className="flex items-center space-x-3">
            <span className="text-xs text-gray-500">415</span>
            <input
              type="range"
              min="415"
              max="466"
              step="0.1"
              value={a4Hz}
              onChange={(e) => onA4Change(parseFloat(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-xs text-gray-500">466</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Baroque</span>
            <span>440 Hz</span>
            <span>Moderne</span>
          </div>
        </div>

        {/* Son de référence */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Son de référence
          </label>
          <button
            onClick={onReferenceAudioToggle}
            className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors duration-200 ${
              isReferenceAudioPlaying
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isReferenceAudioPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Arrêter le son</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Jouer le son de référence</span>
              </>
            )}
          </button>
          {referenceFrequency && (
            <div className="text-xs text-gray-500 text-center mt-1">
              {referenceFrequency.toFixed(1)} Hz
            </div>
          )}
        </div>
      </div>

      {/* Contrôles avancés */}
      <div className="bg-white rounded-lg border border-gray-200">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors duration-200"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Paramètres avancés
            </span>
          </div>
          <div className={`transform transition-transform duration-200 ${
            showAdvanced ? 'rotate-180' : ''
          }`}>
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {showAdvanced && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
            
            {/* Sensibilité */}
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Sensibilité</span>
                <span className="text-blue-600 font-mono">{Math.round(sensitivity * 100)}%</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">Faible</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.99"
                  step="0.01"
                  value={sensitivity}
                  onChange={(e) => onSensitivityChange(parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-500">Élevée</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Ajuste la précision de détection des notes
              </div>
            </div>

            {/* Seuil de bruit */}
            <div>
              <label className="flex items-center justify-between text-sm font-medium text-gray-700 mb-2">
                <span>Seuil de bruit</span>
                <span className="text-blue-600 font-mono">{noiseGateThreshold} dB</span>
              </label>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">-60</span>
                <input
                  type="range"
                  min="-60"
                  max="0"
                  step="1"
                  value={noiseGateThreshold}
                  onChange={(e) => onNoiseGateThresholdChange(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-xs text-gray-500">0</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Filtre les signaux trop faibles pour éviter les fausses détections
              </div>
            </div>

            {/* Bouton de réinitialisation */}
            <div className="pt-2 border-t border-gray-100">
              <button
                onClick={onResetToDefaults}
                className="w-full flex items-center justify-center space-x-2 py-2 px-4 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Réinitialiser aux valeurs par défaut</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Indicateurs d'état */}
      <div className="grid grid-cols-2 gap-4 text-xs">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-gray-600 font-medium mb-1">Algorithme</div>
          <div className="text-gray-800">YIN</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <div className="text-gray-600 font-medium mb-1">Latence</div>
          <div className="text-gray-800">~50ms</div>
        </div>
      </div>
    </div>
  )
}

export default Controls
