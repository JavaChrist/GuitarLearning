/**
 * Indicateurs LED de qualité d'accordage
 * Affiche l'état trop bas / juste / trop haut avec seuils configurables
 */

import React from 'react'
import { TrendingDown, CheckCircle, TrendingUp } from 'lucide-react'

interface QualityLEDProps {
  cents: number
  isActive: boolean
  isInTune: boolean
  detune: 'flat' | 'sharp' | 'in'
  inTuneThreshold?: number
  sharpFlatThreshold?: number
  className?: string
}

const QualityLED: React.FC<QualityLEDProps> = ({
  cents,
  isActive,
  isInTune,
  detune,
  inTuneThreshold = 5,
  sharpFlatThreshold = 15,
  className = ''
}) => {
  const absCents = Math.abs(cents)

  // Détermination de l'état et des couleurs
  const getState = () => {
    if (!isActive) {
      return {
        flat: { active: false, intensity: 0 },
        inTune: { active: false, intensity: 0 },
        sharp: { active: false, intensity: 0 }
      }
    }

    const flatActive = detune === 'flat'
    const sharpActive = detune === 'sharp'
    const inTuneActive = detune === 'in'

    // Intensité basée sur l'écart
    let intensity = 0
    if (absCents <= inTuneThreshold) {
      intensity = 1 // Vert plein
    } else if (absCents <= sharpFlatThreshold) {
      intensity = 0.7 // Orange
    } else {
      intensity = 1 // Rouge plein
    }

    return {
      flat: { 
        active: flatActive, 
        intensity: flatActive ? intensity : 0 
      },
      inTune: { 
        active: inTuneActive, 
        intensity: inTuneActive ? intensity : 0 
      },
      sharp: { 
        active: sharpActive, 
        intensity: sharpActive ? intensity : 0 
      }
    }
  }

  const state = getState()

  // Composant LED individuel
  const LED: React.FC<{
    active: boolean
    intensity: number
    color: 'red' | 'green' | 'orange'
    icon: React.ReactNode
    label: string
  }> = ({ active, intensity, color, icon, label }) => {
    const getColorClasses = () => {
      const baseClasses = "transition-all duration-200 rounded-lg p-3 flex flex-col items-center space-y-1"
      
      if (!active || intensity === 0) {
        return `${baseClasses} bg-gray-100 text-gray-400`
      }

      switch (color) {
        case 'red':
          return intensity > 0.7 
            ? `${baseClasses} bg-red-500 text-white shadow-lg shadow-red-500/30` 
            : `${baseClasses} bg-red-200 text-red-700`
        case 'green':
          return `${baseClasses} bg-green-500 text-white shadow-lg shadow-green-500/30 animate-pulse`
        case 'orange':
          return intensity > 0.7 
            ? `${baseClasses} bg-orange-500 text-white shadow-lg shadow-orange-500/30` 
            : `${baseClasses} bg-orange-200 text-orange-700`
        default:
          return `${baseClasses} bg-gray-100 text-gray-400`
      }
    }

    return (
      <div className={getColorClasses()}>
        <div className="text-2xl">
          {icon}
        </div>
        <div className="text-xs font-medium text-center leading-tight">
          {label}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex justify-center space-x-4 ${className}`}>
      {/* LED Trop bas (flat) */}
      <LED
        active={state.flat.active}
        intensity={state.flat.intensity}
        color="red"
        icon={<TrendingDown className="w-6 h-6" />}
        label="Trop bas"
      />

      {/* LED Juste */}
      <LED
        active={state.inTune.active}
        intensity={state.inTune.intensity}
        color="green"
        icon={<CheckCircle className="w-6 h-6" />}
        label="Juste"
      />

      {/* LED Trop haut (sharp) */}
      <LED
        active={state.sharp.active}
        intensity={state.sharp.intensity}
        color="red"
        icon={<TrendingUp className="w-6 h-6" />}
        label="Trop haut"
      />
    </div>
  )
}

export default QualityLED
