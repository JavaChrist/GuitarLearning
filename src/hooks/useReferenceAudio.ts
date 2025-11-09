/**
 * Hook pour gérer l'audio de référence (oscillateur WebAudio)
 */

import { useState, useRef, useCallback } from 'react'

export interface ReferenceAudioSettings {
  volume: number
  waveType: OscillatorType
}

export const useReferenceAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrequency, setCurrentFrequency] = useState<number | null>(null)
  const [settings, setSettings] = useState<ReferenceAudioSettings>({
    volume: 0.1,
    waveType: 'sine'
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const oscillatorRef = useRef<OscillatorNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  // Initialise le contexte audio
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume()
    }

    return audioContextRef.current
  }, [])

  // Démarre la lecture d'une fréquence
  const playFrequency = useCallback(async (frequency: number) => {
    try {
      // Arrête la lecture précédente
      await stop()

      const audioContext = await initAudioContext()
      
      // Crée l'oscillateur
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      // Configuration
      oscillator.type = settings.waveType
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
      
      // Envelope pour éviter les clics
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(settings.volume, audioContext.currentTime + 0.05)

      // Connexions
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Démarrage
      oscillator.start()

      // Sauvegarde des références
      oscillatorRef.current = oscillator
      gainNodeRef.current = gainNode

      setIsPlaying(true)
      setCurrentFrequency(frequency)

      // Gestion de l'arrêt automatique
      oscillator.addEventListener('ended', () => {
        setIsPlaying(false)
        setCurrentFrequency(null)
        oscillatorRef.current = null
        gainNodeRef.current = null
      })

    } catch (error) {
      console.error('Erreur lors de la lecture de l\'audio de référence:', error)
      setIsPlaying(false)
      setCurrentFrequency(null)
    }
  }, [settings, initAudioContext])

  // Arrête la lecture
  const stop = useCallback(async () => {
    if (oscillatorRef.current && gainNodeRef.current) {
      const audioContext = audioContextRef.current
      if (audioContext) {
        // Fade out pour éviter les clics
        gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.05)
        
        // Arrêt différé
        setTimeout(() => {
          if (oscillatorRef.current) {
            oscillatorRef.current.stop()
          }
        }, 50)
      }
    }

    setIsPlaying(false)
    setCurrentFrequency(null)
  }, [])

  // Toggle lecture/arrêt
  const toggle = useCallback(async (frequency?: number) => {
    if (isPlaying) {
      await stop()
    } else if (frequency) {
      await playFrequency(frequency)
    }
  }, [isPlaying, playFrequency, stop])

  // Change la fréquence en cours de lecture
  const changeFrequency = useCallback(async (frequency: number) => {
    if (isPlaying && oscillatorRef.current && audioContextRef.current) {
      // Transition douce vers la nouvelle fréquence
      oscillatorRef.current.frequency.exponentialRampToValueAtTime(
        frequency, 
        audioContextRef.current.currentTime + 0.1
      )
      setCurrentFrequency(frequency)
    } else {
      await playFrequency(frequency)
    }
  }, [isPlaying, playFrequency])

  // Met à jour les paramètres
  const updateSettings = useCallback((newSettings: Partial<ReferenceAudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
    
    // Applique le nouveau volume immédiatement si en cours de lecture
    if (gainNodeRef.current && newSettings.volume !== undefined) {
      const audioContext = audioContextRef.current
      if (audioContext) {
        gainNodeRef.current.gain.linearRampToValueAtTime(
          newSettings.volume,
          audioContext.currentTime + 0.1
        )
      }
    }
  }, [])

  // Nettoyage
  const cleanup = useCallback(() => {
    stop()
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }, [stop])

  return {
    isPlaying,
    currentFrequency,
    settings,
    playFrequency,
    stop,
    toggle,
    changeFrequency,
    updateSettings,
    cleanup
  }
}
