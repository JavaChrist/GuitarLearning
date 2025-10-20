import React, { useState } from 'react'
import { Mic, MicOff } from 'lucide-react'
import { GUITAR_TUNING, type GuitarNote, findClosestNote } from '../utils/guitarTuning'
import useAudioAnalyzer from '../hooks/useAudioAnalyzer'

const Tuner: React.FC = () => {
  const [selectedString, setSelectedString] = useState<GuitarNote>('E2')
  const [isListening, setIsListening] = useState(false)
  const { frequency, isAnalyzing, startAnalysis, stopAnalysis, error } = useAudioAnalyzer()

  const handleToggleListening = async () => {
    if (isListening) {
      stopAnalysis()
      setIsListening(false)
    } else {
      try {
        await startAnalysis()
        setIsListening(true)
      } catch (err) {
        console.error('Erreur lors du démarrage de l\'analyse audio:', err)
      }
    }
  }

  // Analyser la fréquence détectée
  const analysis = frequency ? findClosestNote(frequency) : null
  const targetNote = GUITAR_TUNING[selectedString]

  // Calculer l'angle de l'aiguille (-90° à +90°)
  const needleAngle = analysis ? Math.max(-90, Math.min(90, analysis.cents * 3)) : 0

  // Couleur selon la précision
  const getAccuracyColor = (accuracy?: string) => {
    switch (accuracy) {
      case 'perfect': return 'text-green-500'
      case 'good': return 'text-yellow-500'
      case 'fair': return 'text-orange-500'
      case 'poor': return 'text-red-500'
      default: return 'text-gray-400'
    }
  }

  const getAccuracyBg = (accuracy?: string) => {
    switch (accuracy) {
      case 'perfect': return 'bg-green-500'
      case 'good': return 'bg-yellow-500'
      case 'fair': return 'bg-orange-500'
      case 'poor': return 'bg-red-500'
      default: return 'bg-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Titre */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bank-text mb-2">Accordeur de Guitare</h2>
        <p className="text-bank-text-light">Sélectionnez une corde et accordez votre guitare</p>
      </div>

      {/* Sélecteur de cordes */}
      <div className="bg-bank-gray rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Sélection de la corde</h3>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(GUITAR_TUNING).map(([noteKey, info]) => (
            <button
              key={noteKey}
              onClick={() => setSelectedString(noteKey as GuitarNote)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${selectedString === noteKey
                  ? 'border-bank-blue bg-bank-blue text-white'
                  : 'border-bank-gray-dark bg-white text-bank-text hover:border-bank-blue'
                }`}
            >
              <div className="font-bold text-lg">{info.name}{info.octave}</div>
              <div className="text-xs opacity-75">{info.string}ème corde</div>
              <div className="text-xs opacity-75">{Math.round(info.frequency)} Hz</div>
            </button>
          ))}
        </div>
      </div>

      {/* Accordeur circulaire */}
      <div className="flex justify-center">
        <div className="relative w-80 h-80">
          {/* Cercle principal */}
          <div className="w-full h-full rounded-full border-8 border-bank-gray-dark bg-white shadow-lg relative">
            {/* Graduations */}
            {[-50, -25, 0, 25, 50].map((cents) => (
              <div
                key={cents}
                className="absolute w-1 h-8 bg-bank-text-light"
                style={{
                  top: '10px',
                  left: '50%',
                  transformOrigin: '50% 150px',
                  transform: `translateX(-50%) rotate(${cents * 1.8}deg)`
                }}
              />
            ))}

            {/* Labels des graduations */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-bank-text">
              0
            </div>
            <div className="absolute top-12 left-8 text-xs text-bank-text-light">-50</div>
            <div className="absolute top-12 right-8 text-xs text-bank-text-light">+50</div>

            {/* Aiguille */}
            <div
              className={`absolute w-1 bg-bank-blue transition-transform duration-300 ${isAnalyzing ? 'tuner-active' : ''
                }`}
              style={{
                height: '140px',
                top: '20px',
                left: '50%',
                transformOrigin: '50% 140px',
                transform: `translateX(-50%) rotate(${needleAngle}deg)`
              }}
            />

            {/* Centre */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-bank-blue rounded-full" />
          </div>
        </div>
      </div>

      {/* Informations de fréquence */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-sm text-bank-text-light">Cible</p>
            <p className="text-xl font-bold text-bank-text">
              {targetNote.name}{targetNote.octave}
            </p>
            <p className="text-sm text-bank-text-light">{Math.round(targetNote.frequency)} Hz</p>
          </div>
          <div>
            <p className="text-sm text-bank-text-light">Détectée</p>
            <p className={`text-xl font-bold ${getAccuracyColor(analysis?.accuracy)}`}>
              {frequency ? `${Math.round(frequency)} Hz` : '-- Hz'}
            </p>
            <p className={`text-sm ${getAccuracyColor(analysis?.accuracy)}`}>
              {analysis ? `${analysis.cents > 0 ? '+' : ''}${analysis.cents} cents` : '--'}
            </p>
          </div>
        </div>

        {/* Indicateur de précision */}
        {analysis && (
          <div className="text-center">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getAccuracyBg(analysis.accuracy)}`}>
              {analysis.accuracy === 'perfect' && 'Parfait !'}
              {analysis.accuracy === 'good' && 'Très bien'}
              {analysis.accuracy === 'fair' && 'Correct'}
              {analysis.accuracy === 'poor' && 'À ajuster'}
            </div>
          </div>
        )}
      </div>

      {/* Contrôles */}
      <div className="flex justify-center">
        <button
          onClick={handleToggleListening}
          disabled={!!error}
          className={`flex items-center space-x-3 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${isListening
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bank-button'
            } ${error ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <>
              <MicOff className="w-6 h-6" />
              <span>Arrêter l'écoute</span>
            </>
          ) : (
            <>
              <Mic className="w-6 h-6" />
              <span>Commencer l'accordage</span>
            </>
          )}
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 font-medium">Erreur d'accès au microphone</p>
          <p className="text-red-500 text-sm mt-1">{error}</p>
        </div>
      )}
    </div>
  )
}

export default Tuner
