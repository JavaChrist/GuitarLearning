import { useState, useRef, useCallback } from 'react'
import Pitchfinder from 'pitchfinder'

interface AudioAnalyzerState {
  frequency: number | null
  isAnalyzing: boolean
  error: string | null
}

const useAudioAnalyzer = () => {
  const [state, setState] = useState<AudioAnalyzerState>({
    frequency: null,
    isAnalyzing: false,
    error: null
  })

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const pitchDetectorRef = useRef<any>(null)

  const startAnalysis = useCallback(async () => {
    try {
      // Réinitialiser l'état
      setState(prev => ({ ...prev, error: null, isAnalyzing: false }))

      // Demander l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          sampleRate: 44100
        }
      })

      mediaStreamRef.current = stream

      // Créer le contexte audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioContext = audioContextRef.current

      // Créer l'analyseur
      analyserRef.current = audioContext.createAnalyser()
      const analyser = analyserRef.current

      // Configuration de l'analyseur
      analyser.fftSize = 4096 // Plus grande FFT pour meilleure précision
      analyser.smoothingTimeConstant = 0.8
      analyser.minDecibels = -90
      analyser.maxDecibels = -10

      // Connecter le microphone à l'analyseur
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Initialiser le détecteur de pitch avec YIN (plus précis pour les instruments)
      pitchDetectorRef.current = Pitchfinder.YIN({
        sampleRate: audioContext.sampleRate,
        threshold: 0.1 // Seuil de confiance
      })

      // Buffer pour les données audio
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Float32Array(bufferLength)

      setState(prev => ({ ...prev, isAnalyzing: true }))

      // Fonction d'analyse en temps réel
      const analyze = () => {
        if (!analyser || !pitchDetectorRef.current) return

        // Obtenir les données audio
        analyser.getFloatTimeDomainData(dataArray)

        // Détecter la fréquence avec Pitchfinder
        const frequency = pitchDetectorRef.current(dataArray)

        // Filtrer les fréquences valides (dans la gamme de la guitare)
        if (frequency && frequency >= 70 && frequency <= 400) {
          setState(prev => ({
            ...prev,
            frequency: Math.round(frequency * 100) / 100 // Arrondir à 2 décimales
          }))
        }

        // Continuer l'analyse
        animationFrameRef.current = requestAnimationFrame(analyze)
      }

      // Démarrer l'analyse
      analyze()

    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'audio:', error)
      let errorMessage = 'Erreur inconnue'

      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Accès au microphone refusé. Veuillez autoriser l\'accès dans les paramètres de votre navigateur.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Aucun microphone détecté. Veuillez connecter un microphone.'
        } else if (error.name === 'NotSupportedError') {
          errorMessage = 'Votre navigateur ne supporte pas cette fonctionnalité.'
        } else {
          errorMessage = error.message
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        isAnalyzing: false,
        frequency: null
      }))
    }
  }, [])

  const stopAnalysis = useCallback(() => {
    // Arrêter l'animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Fermer le stream média
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop())
      mediaStreamRef.current = null
    }

    // Fermer le contexte audio
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }

    // Réinitialiser les références
    analyserRef.current = null
    pitchDetectorRef.current = null

    // Mettre à jour l'état
    setState({
      frequency: null,
      isAnalyzing: false,
      error: null
    })
  }, [])

  // Nettoyage automatique lors du démontage du composant
  const cleanup = useCallback(() => {
    stopAnalysis()
  }, [stopAnalysis])

  return {
    frequency: state.frequency,
    isAnalyzing: state.isAnalyzing,
    error: state.error,
    startAnalysis,
    stopAnalysis,
    cleanup
  }
}

export default useAudioAnalyzer
