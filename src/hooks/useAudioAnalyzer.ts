import { useState, useRef, useCallback } from 'react'
import Pitchfinder from 'pitchfinder'
import useAudioSettings from './useAudioSettings'
import { PitchValidator, MedianFilter, findFundamental } from '../utils/advancedPitchDetection'

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

  const { settings, getMediaConstraints, getAnalyserConfig } = useAudioSettings()

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const pitchDetectorRef = useRef<any>(null)

  const startAnalysis = useCallback(async () => {
    try {
      // Réinitialiser l'état
      setState(prev => ({ ...prev, error: null, isAnalyzing: false }))

      // Demander l'accès au microphone avec les paramètres configurés
      const mediaConstraints = getMediaConstraints()
      const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)

      mediaStreamRef.current = stream

      // Créer le contexte audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioContext = audioContextRef.current

      // Créer l'analyseur
      analyserRef.current = audioContext.createAnalyser()
      const analyser = analyserRef.current

      // Configuration de l'analyseur avec les paramètres utilisateur
      const analyserConfig = getAnalyserConfig()
      analyser.fftSize = analyserConfig.fftSize
      analyser.smoothingTimeConstant = analyserConfig.smoothingTimeConstant
      analyser.minDecibels = analyserConfig.minDecibels
      analyser.maxDecibels = analyserConfig.maxDecibels

      // Connecter le microphone à l'analyseur
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Initialiser le détecteur de pitch avec YIN optimisé pour guitare
      pitchDetectorRef.current = Pitchfinder.YIN({
        sampleRate: audioContext.sampleRate,
        threshold: settings.threshold, // Seuil de confiance configurable
        probabilityThreshold: 0.1, // Plus permissif pour détecter les notes faibles
        bufferSize: 2048 // Taille de buffer pour meilleure précision basses fréquences
      })

      // Buffer pour les données audio - Version améliorée
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Float32Array(bufferLength)

      // Variables pour la calibration du bruit
      let frameCount = 0
      let noiseCalibrationFrames = 0
      let noiseSum = 0
      let baselineNoise = 0

      // Filtres avancés comme GuitarTuna
      const medianFilter = new MedianFilter(7) // Médiane sur 7 mesures
      const pitchValidator = new PitchValidator()

      // Détecteur de signal réel (pas de bruit constant)
      let previousFrequency: number | null = null
      let constantFrequencyCount = 0
      const CONSTANT_THRESHOLD = 5 // Si même fréquence 5 fois = bruit
      let ignoreUntilFrame = 0 // Ignorer les détections pendant X frames après un bruit constant

      setState(prev => ({ ...prev, isAnalyzing: true }))

      // Fonction d'analyse en temps réel améliorée
      const analyze = () => {
        if (!analyser || !pitchDetectorRef.current) return

        try {
          // Obtenir les données audio temporelles pour calibration (même méthode que le test)
          const timeDomainData = new Uint8Array(analyser.fftSize)
          analyser.getByteTimeDomainData(timeDomainData)

          // Calculer le niveau RMS pour vérifier le signal (même calcul que le test)
          let rms = 0
          for (let i = 0; i < timeDomainData.length; i++) {
            const sample = (timeDomainData[i] - 128) / 128 // Normaliser -1 à 1
            rms += sample * sample
          }
          rms = Math.sqrt(rms / timeDomainData.length)

          // Calibration du bruit de fond (60 premières frames)
          if (noiseCalibrationFrames < 60) {
            noiseSum += rms
            noiseCalibrationFrames++
            if (noiseCalibrationFrames === 60) {
              baselineNoise = noiseSum / 60
              console.log(`🎸 Accordeur - Bruit de fond calibré: ${(baselineNoise * 100).toFixed(1)}%`)
            }
          }

          // Mode guitare acoustique : utiliser le signal brut sans soustraction de bruit
          const rawSignalStrength = rms * 100 * 20 // Amplifier x20 le signal brut
          const cleanRms = Math.max(0, rms - baselineNoise)
          const cleanSignalStrength = cleanRms * 100

          // Utiliser le signal le plus fort des deux
          const signalStrength = Math.max(rawSignalStrength, cleanSignalStrength)

          frameCount++
          if (frameCount % 60 === 0) {
            console.log(`🎸 Signal guitare: ${signalStrength.toFixed(1)}% (RMS brut: ${(rms * 100).toFixed(1)}%, Bruit: ${(baselineNoise * 100).toFixed(1)}%)`)
          }

          // Vérifier si on doit ignorer les détections (après détection de bruit constant)
          if (frameCount < ignoreUntilFrame) {
            setState(prev => ({ ...prev, frequency: null }))
            if (frameCount % 60 === 0) {
              const remainingFrames = ignoreUntilFrame - frameCount
              console.log(`⏳ Pause anti-bruit: encore ${Math.ceil(remainingFrames / 60)} secondes...`)
            }
            return
          }

          // Seulement analyser si le signal est détectable (mode guitare acoustique)
          if (signalStrength > 8) { // Seuil adapté à ton micro/guitare
            // Message de reprise après une pause anti-bruit
            if (frameCount === ignoreUntilFrame && ignoreUntilFrame > 0) {
              console.log(`✅ ACCORDEUR RÉACTIVÉ - Prêt à détecter les notes !`)
            }
            console.log(`🎸 SIGNAL FORT détecté: ${signalStrength.toFixed(1)}% - Analyse en cours...`)

            // Convertir les données Uint8 en Float32 pour Pitchfinder
            const floatData = new Float32Array(timeDomainData.length)
            for (let i = 0; i < timeDomainData.length; i++) {
              floatData[i] = (timeDomainData[i] - 128) / 128 // Normaliser -1 à 1
            }

            // Détecter la fréquence avec Pitchfinder
            let rawFrequency = pitchDetectorRef.current(floatData)

            console.log(`🔍 Pitchfinder résultat: ${rawFrequency ? rawFrequency.toFixed(1) + ' Hz' : 'null'}`)

            if (rawFrequency && rawFrequency > 0) {
              // Trouver la vraie fondamentale avec l'algorithme avancé
              const frequency = findFundamental(rawFrequency)
              console.log(`🎯 Après findFundamental: ${frequency.toFixed(1)} Hz`)

              // Validation avec détection de bruit constant
              if (frequency >= 70 && frequency <= 400) {
                // Vérifier si c'est une fréquence constante (bruit électronique)
                const roundedFreq = Math.round(frequency * 10) / 10 // Arrondir à 0.1 Hz

                if (previousFrequency !== null && Math.abs(roundedFreq - previousFrequency) < 0.5) {
                  constantFrequencyCount++
                  if (constantFrequencyCount >= CONSTANT_THRESHOLD) {
                    console.log(`🚫 BRUIT CONSTANT détecté: ${frequency.toFixed(1)} Hz (${constantFrequencyCount} fois) - PAUSE 2 secondes`)
                    setState(prev => ({ ...prev, frequency: null }))
                    // Ignorer les détections pendant 120 frames (2 secondes) pour laisser le bruit se calmer
                    ignoreUntilFrame = frameCount + 120
                    constantFrequencyCount = 0
                    previousFrequency = null
                    return
                  }
                } else {
                  constantFrequencyCount = 0 // Réinitialiser si fréquence change
                }

                previousFrequency = roundedFreq

                // Si c'est une vraie variation, accepter la note
                if (constantFrequencyCount < CONSTANT_THRESHOLD) {
                  console.log(`🎵 VRAIE NOTE: ${frequency.toFixed(1)} Hz (signal: ${signalStrength.toFixed(1)}%, variation: ${constantFrequencyCount})`)
                  setState(prev => ({
                    ...prev,
                    frequency: Math.round(frequency * 100) / 100
                  }))
                }
              } else {
                console.log(`❌ Fréquence hors gamme: ${frequency.toFixed(1)} Hz`)
              }
            } else {
              console.log(`❌ Pitchfinder n'a rien détecté (signal: ${signalStrength.toFixed(1)}%)`)
            }
          } else {
            // Signal trop faible, réinitialiser
            setState(prev => ({ ...prev, frequency: null }))
            if (frameCount % 120 === 0 && signalStrength > 1) {
              console.log(`💤 Signal trop faible: ${signalStrength.toFixed(1)}% (besoin > 8%)`)
              console.log(`💡 Conseil: Joue plus fort près du microphone !`)
            }
          }

        } catch (error) {
          console.error('Erreur analyse accordeur:', error)
        }

        // Continuer l'analyse
        animationFrameRef.current = requestAnimationFrame(analyze)
      }

      // Démarrer l'analyse
      console.log('🎸 Démarrage de l\'accordeur...')
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
  }, [getMediaConstraints, getAnalyserConfig, settings.threshold, settings.sensitivity])

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
