import React, { useState, useRef } from 'react'
import { Mic, MicOff, Volume2, AlertCircle, CheckCircle } from 'lucide-react'

const MicrophoneTest: React.FC = () => {
  const [isTestingMic, setIsTestingMic] = useState(false)
  const [micLevel, setMicLevel] = useState(0)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const animationRef = useRef<number | null>(null)

  const testMicrophone = async () => {
    try {
      setError(null)
      setIsTestingMic(true)

      // Demander explicitement l'accès au microphone
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          autoGainControl: false,
          noiseSuppression: false,
          sampleRate: 44100
        }
      })

      setHasPermission(true)
      streamRef.current = stream

      // Créer le contexte audio
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioContext = audioContextRef.current

      // Créer l'analyseur
      analyserRef.current = audioContext.createAnalyser()
      const analyser = analyserRef.current

      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.8

      // Connecter le microphone
      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      // Analyser le niveau audio
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const updateLevel = () => {
        if (!analyser) return

        analyser.getByteFrequencyData(dataArray)

        // Calculer le niveau moyen
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        const level = Math.round((average / 255) * 100)

        setMicLevel(level)

        if (isTestingMic) {
          animationRef.current = requestAnimationFrame(updateLevel)
        }
      }

      updateLevel()

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
    setIsTestingMic(false)
    setMicLevel(0)

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }

    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
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
