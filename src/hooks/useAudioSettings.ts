import { useState, useCallback } from 'react'

export interface AudioSettings {
  sensitivity: number // 0-100
  noiseReduction: boolean
  echoCancellation: boolean
  autoGainControl: boolean
  sampleRate: number
  fftSize: number
  smoothingTimeConstant: number
  minDecibels: number
  maxDecibels: number
  threshold: number // Seuil de confiance pour Pitchfinder
}

const DEFAULT_SETTINGS: AudioSettings = {
  sensitivity: 75,
  noiseReduction: false,
  echoCancellation: false,
  autoGainControl: false,
  sampleRate: 44100,
  fftSize: 8192, // Plus grande FFT pour meilleure précision
  smoothingTimeConstant: 0.3, // Moins de lissage pour plus de réactivité
  minDecibels: -100,
  maxDecibels: -30,
  threshold: 0.15 // Seuil plus permissif
}

const useAudioSettings = () => {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    // Charger depuis localStorage si disponible
    const saved = localStorage.getItem('guitar-learning-audio-settings')
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS
  })

  const updateSetting = useCallback(<K extends keyof AudioSettings>(
    key: K,
    value: AudioSettings[K]
  ) => {
    setSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      // Sauvegarder dans localStorage
      localStorage.setItem('guitar-learning-audio-settings', JSON.stringify(newSettings))
      return newSettings
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    setSettings(DEFAULT_SETTINGS)
    localStorage.setItem('guitar-learning-audio-settings', JSON.stringify(DEFAULT_SETTINGS))
  }, [])

  const getMediaConstraints = useCallback(() => {
    return {
      audio: {
        echoCancellation: settings.echoCancellation,
        autoGainControl: settings.autoGainControl,
        noiseSuppression: settings.noiseReduction,
        sampleRate: settings.sampleRate,
        channelCount: 1,
        latency: 0,
        volume: settings.sensitivity / 100
      }
    }
  }, [settings])

  const getAnalyserConfig = useCallback(() => {
    return {
      fftSize: settings.fftSize,
      smoothingTimeConstant: settings.smoothingTimeConstant,
      minDecibels: settings.minDecibels,
      maxDecibels: settings.maxDecibels
    }
  }, [settings])

  return {
    settings,
    updateSetting,
    resetToDefaults,
    getMediaConstraints,
    getAnalyserConfig
  }
}

export default useAudioSettings
