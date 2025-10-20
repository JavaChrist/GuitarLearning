import React, { useState, useRef } from 'react'
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react'

const MicrophoneTest: React.FC = () => {
  const [isTestingMic, setIsTestingMic] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [baselineNoise, setBaselineNoise] = useState(0) // Niveau de bruit de fond

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const testMicrophone = async () => {
    try {
      setError(null)

      // Demander explicitement l'accès au microphone
      console.log('🎤 Demande d\'accès au microphone...')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          sampleRate: 44100
        }
      })

      console.log('✅ Stream obtenu:', stream)
      console.log('📊 Tracks audio:', stream.getAudioTracks())
      console.log('🔊 Track actif:', stream.getAudioTracks()[0]?.enabled)

      setHasPermission(true)
      streamRef.current = stream
      setIsTestingMic(true)

      // Créer le contexte audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioContext = audioContextRef.current
      console.log('🎵 Contexte audio créé, état:', audioContext.state)

      // Forcer la reprise du contexte audio si nécessaire
      if (audioContext.state === 'suspended') {
        console.log('⏯️ Reprise du contexte audio...')
        await audioContext.resume()
        console.log('✅ Contexte audio repris, nouvel état:', audioContext.state)
      }

      // Créer l'analyseur
      analyserRef.current = audioContext.createAnalyser()
      const analyser = analyserRef.current

      analyser.fftSize = 2048
      analyser.smoothingTimeConstant = 0.1
      analyser.minDecibels = -90
      analyser.maxDecibels = -10

      console.log('📈 Analyseur configuré:', {
        fftSize: analyser.fftSize,
        frequencyBinCount: analyser.frequencyBinCount,
        sampleRate: audioContext.sampleRate
      })

      // Connecter le microphone
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)
      console.log('🔗 Microphone connecté à l\'analyseur')

      // Analyser le niveau audio - Version simplifiée et plus robuste
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      let frameCount = 0
      let isAnalyzing = true // Variable locale pour éviter les problèmes d'état
      let noiseCalibrationFrames = 0
      let noiseSum = 0

      const updateLevel = () => {
        if (!analyser || !isAnalyzing) {
          console.log('❌ Arrêt analyse:', { analyser: !!analyser, isAnalyzing })
          return
        }

        try {
          // Essayer les deux méthodes d'analyse
          analyser.getByteFrequencyData(dataArray)

          // Méthode alternative avec TimeDomain (plus fiable)
          const timeDomainData = new Uint8Array(analyser.fftSize)
          analyser.getByteTimeDomainData(timeDomainData)

          // Calculer RMS du signal temporel + détection de pics
          let rms = 0
          let maxPeak = 0
          for (let i = 0; i < timeDomainData.length; i++) {
            const sample = (timeDomainData[i] - 128) / 128 // Normaliser -1 à 1
            rms += sample * sample
            maxPeak = Math.max(maxPeak, Math.abs(sample))
          }
          rms = Math.sqrt(rms / timeDomainData.length)

          // Calibration du bruit de fond (60 premières frames)
          if (noiseCalibrationFrames < 60) {
            noiseSum += rms
            noiseCalibrationFrames++
            if (noiseCalibrationFrames === 60) {
              const avgNoise = noiseSum / 60
              setBaselineNoise(avgNoise)
              console.log(`🔇 Bruit de fond calibré: ${(avgNoise * 100).toFixed(1)}%`)
            }
          }

          // Soustraire le bruit de fond
          const cleanRms = Math.max(0, rms - baselineNoise)

          // Prendre le maximum entre RMS et pic pour plus de sensibilité
          const rmsLevel = cleanRms * 100 * 100 // Amplifier x100 après soustraction du bruit
          const peakLevel = Math.max(0, maxPeak - (baselineNoise * 2)) * 100 * 50 // Peak avec soustraction bruit
          const timeLevel = Math.min(Math.round(Math.max(rmsLevel, peakLevel)), 100)

          // Calculer le niveau fréquentiel
          let sum = 0
          let maxValue = 0
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i]
            maxValue = Math.max(maxValue, dataArray[i])
          }
          const average = sum / dataArray.length
          const freqLevel = Math.min(Math.round((average / 255) * 100 * 3), 100)

          // Prendre le maximum des deux méthodes
          const level = Math.max(freqLevel, timeLevel)
          setMicLevel(level)

          // Debug détaillé (toutes les 30 frames pour éviter le spam)
          frameCount++
          if (frameCount % 30 === 0) {
            console.log(`🔊 Frame ${frameCount}:`)
            console.log(`  - Time RMS brut: ${(rms * 100).toFixed(1)}%`)
            console.log(`  - Bruit de fond: ${(baselineNoise * 100).toFixed(1)}%`)
            console.log(`  - RMS nettoyé: ${(cleanRms * 100).toFixed(1)}%`)
            console.log(`  - Time Peak: ${(maxPeak * 100).toFixed(1)}%`)
            console.log(`  - RMS Level: ${rmsLevel.toFixed(1)}%`)
            console.log(`  - Peak Level: ${peakLevel.toFixed(1)}%`)
            console.log(`  - Niveau final: ${level}%`)
            console.log(`  - Calibration: ${noiseCalibrationFrames}/60`)
          }

          // Continuer l'analyse
          animationRef.current = requestAnimationFrame(updateLevel)
        } catch (e) {
          console.error('❌ Erreur analyse audio:', e)
        }
      }

      // Fonction pour arrêter l'analyse
      const stopAnalysis = () => {
        isAnalyzing = false
        console.log('🛑 Analyse arrêtée')
      }

      // Nettoyer l'ancienne analyse si elle existe
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Démarrer l'analyse avec un délai pour s'assurer que tout est prêt
      console.log('🚀 Démarrage de l\'analyse...')
      setTimeout(() => {
        console.log('⏰ Lancement de l\'analyse après délai')
        updateLevel()
      }, 100)

    } catch (err) {
      console.error('Erreur accès microphone:', err)
      setHasPermission(false)
      setIsTestingMic(false)

      let errorMessage = 'Erreur inconnue'
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Accès au microphone refusé. Autorisez l\'accès dans les paramètres de votre navigateur.'
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'Aucun microphone détecté. Vérifiez votre matériel.'
        } else if (err.name === 'NotSupportedError') {
          errorMessage = 'Votre navigateur ne supporte pas cette fonctionnalité.'
        } else {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
    }
  }

  const stopTest = () => {
    console.log('🛑 Arrêt du test microphone')
    setIsTestingMic(false)
    setMicLevel(0)
    setBaselineNoise(0)

    // Arrêter la boucle d'analyse
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    // Arrêter le stream
    if (streamRef.current) {
      console.log('🔇 Arrêt du stream audio')
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('🔇 Track arrêté:', track.label)
      })
      streamRef.current = null
    }

    // Fermer le contexte audio
    if (audioContextRef.current) {
      console.log('🔌 Fermeture du contexte audio')
      audioContextRef.current.close().then(() => {
        console.log('✅ Contexte audio fermé')
      })
      audioContextRef.current = null
    }

    analyserRef.current = null
  }

  return (
    <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
      <h3 className="text-lg font-semibold text-bank-text mb-4 flex items-center">
        <Mic className="w-5 h-5 mr-2" />
        Test du Microphone
      </h3>

      {/* État des permissions */}
      <div className="mb-4">
        {hasPermission === null && (
          <div className="flex items-center space-x-2 text-bank-text-light">
            <AlertCircle className="w-4 h-4" />
            <span>Permissions microphone non testées</span>
          </div>
        )}
        {hasPermission === true && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span>Microphone autorisé et fonctionnel</span>
          </div>
        )}
        {hasPermission === false && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Accès microphone refusé</span>
          </div>
        )}
      </div>

      {/* Niveau audio en temps réel */}
      {isTestingMic && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-bank-text">Niveau audio détecté:</span>
            <span className="text-sm font-bold text-bank-blue">{micLevel}%</span>
          </div>
          <div className="w-full bg-bank-gray rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-100 ${micLevel > 50 ? 'bg-green-500' :
                micLevel > 20 ? 'bg-yellow-500' :
                  micLevel > 5 ? 'bg-orange-500' : 'bg-red-500'
                }`}
              style={{ width: `${Math.min(micLevel, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-bank-text-light mt-1">
            <span>Silence</span>
            <span>Fort</span>
          </div>
        </div>
      )}

      {/* Boutons de contrôle */}
      <div className="flex space-x-2">
        <button
          onClick={isTestingMic ? stopTest : testMicrophone}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isTestingMic
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bank-button'
            }`}
        >
          {isTestingMic ? (
            <>
              <MicOff className="w-4 h-4" />
              <span>Arrêter le test</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4" />
              <span>Tester le microphone</span>
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-700 font-medium">Problème d'accès au microphone</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              {error.includes('refusé') && (
                <div className="mt-2 text-sm text-red-600">
                  <p className="font-medium">Sur iPhone/Safari :</p>
                  <p>• Allez dans Réglages → Safari → Appareil photo et microphone</p>
                  <p>• Autorisez l'accès pour ce site</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-4 bg-bank-gray rounded-lg p-3">
        <h4 className="font-semibold text-bank-text mb-2">Instructions :</h4>
        <ul className="text-sm text-bank-text-light space-y-1">
          <li>• Cliquez sur "Tester le microphone" pour vérifier l'accès</li>
          <li>• Autorisez l'accès quand le navigateur le demande</li>
          <li>• Parlez ou jouez de la guitare près du micro</li>
          <li>• La barre doit réagir au son (vert = bon niveau)</li>
          <li>• Si ça ne fonctionne pas, vérifiez les paramètres du navigateur</li>
        </ul>
      </div>
    </div>
  )
}

export default MicrophoneTest

