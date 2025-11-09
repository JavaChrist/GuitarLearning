/**
 * Composant aiguille pour l'accordeur
 * Affiche une jauge fluide de -50 à +50 cents avec animation lissée
 */

import React, { useEffect, useState } from 'react'

interface NeedleProps {
  cents: number
  isActive: boolean
  isInTune: boolean
  className?: string
}

const Needle: React.FC<NeedleProps> = ({ 
  cents, 
  isActive, 
  isInTune,
  className = '' 
}) => {
  const [displayCents, setDisplayCents] = useState(0)
  const [animationId, setAnimationId] = useState<number>()

  // Animation lissée de l'aiguille
  useEffect(() => {
    if (!isActive) {
      setDisplayCents(0)
      return
    }

    const targetCents = Math.max(-50, Math.min(50, cents))
    
    const animate = () => {
      setDisplayCents(prevCents => {
        const diff = targetCents - prevCents
        const step = diff * 0.15 // Facteur de lissage
        
        if (Math.abs(diff) < 0.1) {
          return targetCents
        }
        
        const newCents = prevCents + step
        const id = requestAnimationFrame(animate)
        setAnimationId(id)
        
        return newCents
      })
    }

    const id = requestAnimationFrame(animate)
    setAnimationId(id)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [cents, isActive])

  // Calcul de l'angle de l'aiguille (-90° à +90°)
  const needleAngle = (displayCents / 50) * 90

  // Couleur de l'aiguille selon l'état
  const getNeedleColor = () => {
    if (!isActive) return 'text-gray-400'
    if (isInTune) return 'text-green-500'
    if (Math.abs(displayCents) <= 15) return 'text-orange-500'
    return 'text-red-500'
  }

  // Génération des ticks de graduation
  const generateTicks = () => {
    const ticks = []
    
    // Ticks principaux tous les 10 cents
    for (let i = -50; i <= 50; i += 10) {
      const angle = (i / 50) * 90
      const isCenter = i === 0
      const isMajor = i % 20 === 0
      
      ticks.push(
        <g key={`tick-${i}`}>
          {/* Ligne de graduation */}
          <line
            x1="0"
            y1={isCenter ? "-85" : isMajor ? "-82" : "-80"}
            x2="0"
            y2={isCenter ? "-75" : isMajor ? "-78" : "-79"}
            stroke={isCenter ? "#10b981" : isActive ? "#374151" : "#9ca3af"}
            strokeWidth={isCenter ? "2" : "1"}
            transform={`rotate(${angle})`}
          />
          
          {/* Étiquettes pour les graduations principales */}
          {isMajor && (
            <text
              x={Math.sin(angle * Math.PI / 180) * 70}
              y={-Math.cos(angle * Math.PI / 180) * 70}
              textAnchor="middle"
              dominantBaseline="central"
              className="text-xs font-medium fill-gray-600"
            >
              {i === 0 ? "0" : i > 0 ? `+${i}` : i.toString()}
            </text>
          )}
        </g>
      )
    }

    // Ticks mineurs tous les 5 cents
    for (let i = -45; i <= 45; i += 10) {
      const subTicks = [i - 5, i + 5].filter(tick => tick >= -50 && tick <= 50 && tick % 10 !== 0)
      
      subTicks.forEach(tick => {
        const angle = (tick / 50) * 90
        ticks.push(
          <line
            key={`subtick-${tick}`}
            x1="0"
            y1="-80"
            x2="0"
            y2="-78.5"
            stroke={isActive ? "#6b7280" : "#9ca3af"}
            strokeWidth="0.5"
            transform={`rotate(${angle})`}
          />
        )
      })
    }

    return ticks
  }

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Conteneur SVG pour l'aiguille */}
      <div className="relative w-80 h-40 flex items-end justify-center">
        <svg 
          viewBox="-100 -100 200 100" 
          className="w-full h-full"
        >
          {/* Arc de fond */}
          <path
            d="M -70.71 -70.71 A 100 100 0 0 1 70.71 -70.71"
            fill="none"
            stroke={isActive ? "#e5e7eb" : "#f3f4f6"}
            strokeWidth="2"
          />
          
          {/* Zone verte (juste) */}
          <path
            d="M -17.36 -98.48 A 100 100 0 0 1 17.36 -98.48"
            fill="none"
            stroke="#10b981"
            strokeWidth="6"
            opacity="0.3"
          />
          
          {/* Graduations */}
          {generateTicks()}
          
          {/* Aiguille */}
          <g 
            transform={`rotate(${needleAngle})`}
            className="transition-none" // Pas de transition CSS, on gère avec RAF
          >
            {/* Ombre de l'aiguille */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-75"
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="3"
              strokeLinecap="round"
              transform="translate(1, 1)"
            />
            
            {/* Aiguille principale */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-75"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className={`${getNeedleColor()} transition-colors duration-200`}
            />
            
            {/* Pointe de l'aiguille */}
            <circle
              cx="0"
              cy="-75"
              r="2"
              fill="currentColor"
              className={getNeedleColor()}
            />
          </g>
          
          {/* Centre de l'aiguille */}
          <circle
            cx="0"
            cy="0"
            r="4"
            fill={isActive ? "#374151" : "#9ca3af"}
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Indicateur numérique des cents */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
        <div className={`px-3 py-1 rounded-full text-sm font-bold transition-colors duration-200 ${
          !isActive 
            ? 'bg-gray-100 text-gray-400' 
            : isInTune 
              ? 'bg-green-100 text-green-700'
              : Math.abs(displayCents) <= 15
                ? 'bg-orange-100 text-orange-700'
                : 'bg-red-100 text-red-700'
        }`}>
          {isActive ? (
            <>
              {displayCents > 0 ? '+' : ''}{Math.round(displayCents)}¢
            </>
          ) : (
            '--¢'
          )}
        </div>
      </div>

      {/* Étiquettes des zones */}
      <div className="absolute inset-0 flex items-end justify-between text-xs text-gray-500 px-8 pb-8">
        <span className="transform -rotate-45">Grave</span>
        <span className="transform rotate-45">Aigu</span>
      </div>

      {/* Animation de pulsation quand c'est juste */}
      {isActive && isInTune && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full rounded-full bg-green-400 opacity-20 animate-ping" />
        </div>
      )}
    </div>
  )
}

export default Needle
