/**
 * Page principale de l'accordeur
 * Assemble tous les composants et gère l'état global
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Mic, MicOff, AlertTriangle, Zap } from 'lucide-react'
import { TunerEngine, TUNING_PRESETS, type TunerState, type TunerMode } from '../tuner/TunerEngine'
import { useReferenceAudio } from '../hooks/useReferenceAudio'
import Needle from '../components/tuner/Needle'
import PitchReadout from '../components/tuner/PitchReadout'
import QualityLED from '../components/tuner/QualityLED'
import StringSelector from '../components/tuner/StringSelector'
import Controls from '../components/tuner/Controls'
import SpectrumDebug from '../components/tuner/SpectrumDebug'

// États de l'accordeur
type TunerStatus = 'idle' | 'requesting' | 'running' | 'error'

const TunerPage: React.FC = () => {
  // État principal
  const [tunerEngine] = useState(() => new TunerEngine())
  const [tunerState, setTunerState] = useState<TunerState>({
    noteName: '',
    noteNameFr: '',
    octave: 0,
    frequency: 0,
    cents: 0,
    confidence: 0,
    isInTune: false,
    detune: 'in',
    a4Hz: 440,
    isActive: false,
    noiseGateOpen: false,
    voiceDetected: false
  })
  
  const [status, setStatus] = useState<TunerStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentAudioBuffer, setCurrentAudioBuffer] = useState<Float32Array>()

  // Audio de référence
  const referenceAudio = useReferenceAudio()

  // État UI
  const [showPermissionHelp, setShowPermissionHelp] = useState(false)

  // Initialisation du moteur
  useEffect(() => {
    tunerEngine.onUpdate(setTunerState)
    tunerEngine.onError((error) => {
      setStatus('error')
      setErrorMessage(error)
      
      // Messages d'aide spécifiques
      if (error.includes('Permission denied') || error.includes('NotAllowedError')) {
        setShowPermissionHelp(true)
      }
    })

    // Nettoyage
    return () => {
      tunerEngine.stop()
      referenceAudio.cleanup()
    }
  }, [tunerEngine, referenceAudio])

  // Démarrage/arrêt de l'accordeur
  const handleToggleTuner = useCallback(async () => {
    if (status === 'running') {
      tunerEngine.stop()
      setStatus('idle')
    } else {
      setStatus('requesting')
      setErrorMessage('')
      setShowPermissionHelp(false)
      
      // CRITIQUE pour iOS : L'interaction utilisateur est nécessaire pour activer l'audio
      // Nous sommes dans un gestionnaire d'événement, donc c'est le bon moment
      
      try {
        await tunerEngine.start()
        setStatus('running')
      } catch (error) {
        // L'erreur sera gérée par le callback onError
      }
    }
  }, [status, tunerEngine])

  // Gestion des contrôles
  const handleModeChange = useCallback((mode: TunerMode) => {
    tunerEngine.setMode(mode)
  }, [tunerEngine])

  const handleStringSelect = useCallback((stringIndex: number) => {
    tunerEngine.setTargetString(stringIndex)
  }, [tunerEngine])

  const handlePresetChange = useCallback((presetIndex: number) => {
    tunerEngine.setTuningPreset(presetIndex)
  }, [tunerEngine])

  const handleA4Change = useCallback((a4Hz: number) => {
    tunerEngine.setCalibration(a4Hz)
  }, [tunerEngine])

  const handleSensitivityChange = useCallback((sensitivity: number) => {
    tunerEngine.setSensitivity(sensitivity)
  }, [tunerEngine])

  const handleNoiseGateThresholdChange = useCallback((threshold: number) => {
    tunerEngine.setNoiseGateThreshold(threshold)
  }, [tunerEngine])

  const handleReferenceAudioToggle = useCallback(async () => {
    const targetFreq = tunerState.targetFrequency || 440
    
    // Pour iOS : Assurer que le contexte audio est activé
    try {
      await referenceAudio.toggle(targetFreq)
    } catch (error) {
      console.warn('Erreur audio de référence (normal sur iOS):', error)
      // Réessayer après un court délai
      setTimeout(async () => {
        try {
          await referenceAudio.toggle(targetFreq)
        } catch (retryError) {
          console.warn('Deuxième tentative échouée:', retryError)
        }
      }, 200)
    }
  }, [referenceAudio, tunerState.targetFrequency])

  const handleResetToDefaults = useCallback(() => {
    tunerEngine.setCalibration(440)
    tunerEngine.setSensitivity(0.8)
    tunerEngine.setNoiseGateThreshold(-40)
  }, [tunerEngine])

  // Vibration haptique quand c'est juste
  useEffect(() => {
    if (tunerState.isInTune && tunerState.isActive && 'vibrate' in navigator) {
      navigator.vibrate(50)
    }
  }, [tunerState.isInTune, tunerState.isActive])

  // Récupération des paramètres actuels
  const settings = tunerEngine.getSettings()
  const currentPreset = tunerEngine.getCurrentPreset()
  const mode = tunerEngine.getMode()
  const targetStringIndex = tunerEngine.getTargetStringIndex()

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center space-x-2">
          <span className="text-3xl">🎵</span>
          <span>Accordeur</span>
        </h1>
        <p className="text-gray-600 mt-1">
          Accordez votre guitare avec précision
        </p>
      </div>

      {/* Bouton principal */}
      <div className="text-center">
        <button
          onClick={handleToggleTuner}
          disabled={status === 'requesting'}
          className={`inline-flex items-center space-x-3 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
            status === 'running'
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25'
              : status === 'requesting'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 hover:scale-105'
          }`}
        >
          {status === 'requesting' ? (
            <>
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Demande d'accès...</span>
            </>
          ) : status === 'running' ? (
            <>
              <MicOff className="w-6 h-6" />
              <span>Arrêter l'accordeur</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span>Démarrer l'accordeur</span>
            </>
          )}
        </button>
      </div>

      {/* Messages d'erreur et d'aide */}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Erreur d'accès au microphone</h3>
              <p className="text-red-700 mt-1">{errorMessage}</p>
              
              {showPermissionHelp && (
                <div className="mt-3 text-sm text-red-600">
                  <p className="font-medium mb-2">Pour résoudre ce problème :</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Vérifiez que votre navigateur a l'autorisation d'accéder au microphone</li>
                    <li>Cliquez sur l'icône de microphone dans la barre d'adresse</li>
                    <li>Rechargez la page et autorisez l'accès</li>
                    <li>Assurez-vous qu'aucune autre application n'utilise le microphone</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Indicateurs d'état */}
      {status === 'running' && (
        <div className="flex justify-center space-x-4 text-sm">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
            tunerState.noiseGateOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              tunerState.noiseGateOpen ? 'bg-green-500' : 'bg-gray-400'
            }`} />
            <span>Signal</span>
          </div>
          
          {tunerState.voiceDetected && (
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700">
              <Zap className="w-3 h-3" />
              <span>Voix détectée</span>
            </div>
          )}
        </div>
      )}

      {/* Interface principale */}
      {status === 'running' && (
        <div className="space-y-6">
          {/* Aiguille */}
          <Needle
            cents={tunerState.cents}
            isActive={tunerState.isActive}
            isInTune={tunerState.isInTune}
            className="mb-6"
          />

          {/* LEDs de qualité */}
          <QualityLED
            cents={tunerState.cents}
            isActive={tunerState.isActive}
            isInTune={tunerState.isInTune}
            detune={tunerState.detune}
            inTuneThreshold={settings.inTuneThreshold}
            sharpFlatThreshold={settings.sharpFlatThreshold}
          />

          {/* Affichage de la note */}
          <PitchReadout
            noteName={tunerState.noteName}
            noteNameFr={tunerState.noteNameFr}
            octave={tunerState.octave}
            frequency={tunerState.frequency}
            isActive={tunerState.isActive}
            confidence={tunerState.confidence}
            useFrenchNames={true}
          />

          {/* Sélecteur de corde */}
          <StringSelector
            mode={mode}
            currentPreset={currentPreset}
            targetStringIndex={targetStringIndex}
            tuningPresets={TUNING_PRESETS}
            onModeChange={handleModeChange}
            onStringSelect={handleStringSelect}
            onPresetChange={handlePresetChange}
          />

          {/* Contrôles */}
          <Controls
            a4Hz={settings.a4Hz}
            sensitivity={settings.sensitivity}
            noiseGateThreshold={settings.noiseGate.threshold}
            isReferenceAudioPlaying={referenceAudio.isPlaying}
            referenceFrequency={referenceAudio.currentFrequency || undefined}
            onA4Change={handleA4Change}
            onSensitivityChange={handleSensitivityChange}
            onNoiseGateThresholdChange={handleNoiseGateThresholdChange}
            onReferenceAudioToggle={handleReferenceAudioToggle}
            onResetToDefaults={handleResetToDefaults}
          />

          {/* Débogage (si activé) */}
          <SpectrumDebug
            audioBuffer={currentAudioBuffer}
            frequency={tunerState.frequency}
            confidence={tunerState.confidence}
            isActive={tunerState.isActive}
          />
        </div>
      )}

      {/* Conseils d'utilisation */}
      {status === 'idle' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Conseils d'utilisation</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Accordez dans un environnement calme</li>
            <li>• Jouez les notes une par une, clairement</li>
            <li>• Tendez progressivement les cordes</li>
            <li>• Utilisez le mode "Corde" pour un accordage précis</li>
            <li>• L'accordeur fonctionne mieux avec des guitares acoustiques</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default TunerPage
