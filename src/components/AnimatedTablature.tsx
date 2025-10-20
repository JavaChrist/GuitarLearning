import React, { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react'

export interface TablatureNote {
  string: number // 1-6 (1 = corde la plus aiguë, 6 = corde la plus grave)
  fret: number
  duration: number // Durée en millisecondes
  note: string // Nom de la note pour l'audio
}

export interface TablatureData {
  title: string
  notes: TablatureNote[]
  tempo: number // BPM
}

interface AnimatedTablatureProps {
  tablature: TablatureData
  width?: number
  height?: number
}

const AnimatedTablature: React.FC<AnimatedTablatureProps> = ({
  tablature,
  width = 800,
  height = 200
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1)
  const [tempo, setTempo] = useState(tablature.tempo)
  const [volume, setVolume] = useState(0.5)

  const audioContextRef = useRef<AudioContext | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Fréquences des notes (en Hz)
  const noteFrequencies: { [key: string]: number } = {
    'C': 261.63, 'C#': 277.18, 'D': 293.66, 'D#': 311.13,
    'E': 329.63, 'F': 349.23, 'F#': 369.99, 'G': 392.00,
    'G#': 415.30, 'A': 440.00, 'A#': 466.16, 'B': 493.88
  }

  // Initialiser le contexte audio
  const initAudioContext = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }

    // Reprendre le contexte s'il est suspendu (requis par les navigateurs)
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    return audioContextRef.current
  }

  // Jouer une note
  const playNote = async (note: string, duration: number) => {
    try {
      const audioContext = await initAudioContext()
      if (!audioContext) return

      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Configuration de l'oscillateur
      oscillator.frequency.setValueAtTime(noteFrequencies[note] || 440, audioContext.currentTime)
      oscillator.type = 'sawtooth' // Son de guitare synthétique

      // Enveloppe ADSR simple
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01) // Attack
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.1) // Decay
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.05, audioContext.currentTime + duration / 1000) // Release

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration / 1000)
    } catch (error) {
      console.warn('Erreur lors de la lecture audio:', error)
    }
  }

  // Démarrer la lecture
  const startPlayback = async () => {
    // Initialiser le contexte audio dès le premier clic (requis par les navigateurs)
    await initAudioContext()

    setIsPlaying(true)
    setCurrentNoteIndex(0)
    startTimeRef.current = Date.now()
    playNextNote(0)
  }

  // Jouer la note suivante
  const playNextNote = (noteIndex: number) => {
    if (noteIndex >= tablature.notes.length) {
      // Fin de la tablature
      setIsPlaying(false)
      setCurrentNoteIndex(-1)
      return
    }

    const note = tablature.notes[noteIndex]
    setCurrentNoteIndex(noteIndex)

    // Jouer le son
    playNote(note.note, note.duration)

    // Programmer la note suivante
    const adjustedDuration = (note.duration * 60000) / (tempo * 480) // Ajustement selon le tempo
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        playNextNote(noteIndex + 1)
      }
    }, adjustedDuration)
  }

  // Arrêter la lecture
  const stopPlayback = () => {
    setIsPlaying(false)
    setCurrentNoteIndex(-1)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  // Reset
  const resetPlayback = () => {
    stopPlayback()
    setCurrentNoteIndex(-1)
  }

  // Nettoyage
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Calculer les positions des notes sur la tablature
  const noteWidth = (width - 100) / tablature.notes.length
  const stringHeight = (height - 80) / 6

  return (
    <div className="bg-white border border-bank-gray-dark rounded-lg p-4 shadow-sm">
      {/* Titre */}
      <h3 className="text-lg font-bold text-bank-text mb-4 text-center">{tablature.title}</h3>

      {/* Contrôles */}
      <div className="mb-4 bg-bank-gray rounded-lg p-3 space-y-3">
        {/* Boutons de contrôle */}
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={isPlaying ? stopPlayback : startPlayback}
            className="flex items-center space-x-2 bank-button px-4 py-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span className="hidden sm:inline">Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span className="hidden sm:inline">Play</span>
              </>
            )}
          </button>

          <button
            onClick={resetPlayback}
            className="flex items-center space-x-2 bank-button-secondary px-4 py-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Contrôles de paramètres */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
          {/* Contrôle du tempo */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-bank-text font-medium">Tempo:</label>
            <input
              type="range"
              min="60"
              max="200"
              value={tempo}
              onChange={(e) => setTempo(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-bank-text w-8">{tempo}</span>
          </div>

          {/* Contrôle du volume */}
          <div className="flex items-center space-x-2">
            <Volume2 className="w-4 h-4 text-bank-text" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs text-bank-text-light">{Math.round(volume * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Tablature SVG */}
      <div className="bg-white border border-bank-gray-dark rounded p-2 sm:p-4 overflow-x-auto">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-full h-auto min-w-[600px]"
        >
          {/* Cordes (lignes horizontales) */}
          {[1, 2, 3, 4, 5, 6].map((string) => (
            <g key={string}>
              <line
                x1={50}
                y1={20 + (string - 1) * stringHeight}
                x2={width - 50}
                y2={20 + (string - 1) * stringHeight}
                stroke="#666"
                strokeWidth="1"
              />
              {/* Nom de la corde */}
              <text
                x={20}
                y={25 + (string - 1) * stringHeight}
                fontSize="12"
                fill="#666"
                textAnchor="middle"
                className="font-medium"
              >
                {['E', 'B', 'G', 'D', 'A', 'E'][string - 1]}
              </text>
            </g>
          ))}

          {/* Mesures (lignes verticales) */}
          {Array.from({ length: Math.ceil(tablature.notes.length / 4) }, (_, i) => (
            <line
              key={i}
              x1={50 + i * noteWidth * 4}
              y1={15}
              x2={50 + i * noteWidth * 4}
              y2={height - 40}
              stroke="#ccc"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          ))}

          {/* Notes */}
          {tablature.notes.map((note, index) => {
            const x = 50 + index * noteWidth + noteWidth / 2
            const y = 20 + (note.string - 1) * stringHeight
            const isCurrentNote = index === currentNoteIndex
            const isPlayedNote = index < currentNoteIndex

            return (
              <g key={index}>
                {/* Cercle de fond */}
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={isCurrentNote ? '#ef4444' : isPlayedNote ? '#22c55e' : '#f3f4f6'}
                  stroke={isCurrentNote ? '#dc2626' : '#d1d5db'}
                  strokeWidth="2"
                />
                {/* Numéro de frette */}
                <text
                  x={x}
                  y={y + 1}
                  fontSize="10"
                  fill={isCurrentNote ? 'white' : isPlayedNote ? 'white' : '#374151'}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-bold"
                >
                  {note.fret}
                </text>
                {/* Animation pour la note courante */}
                {isCurrentNote && (
                  <circle
                    cx={x}
                    cy={y}
                    r="16"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values="12;20;12"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.6;0;0.6"
                      dur="0.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
              </g>
            )
          })}
        </svg>
      </div>

      {/* Légende */}
      <div className="mt-4 text-center">
        <div className="flex justify-center space-x-6 text-sm text-bank-text-light">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span>Note courante</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Notes jouées</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 border border-gray-300"></div>
            <span>À jouer</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimatedTablature


