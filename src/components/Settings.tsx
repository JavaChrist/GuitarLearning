import React, { useState } from 'react'
import { Settings as SettingsIcon, Volume2, Mic, Smartphone, RotateCcw, AlertTriangle } from 'lucide-react'
import useAudioSettings from '../hooks/useAudioSettings'

const Settings: React.FC = () => {
  const { settings, updateSetting, resetToDefaults } = useAudioSettings()
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-bank-blue p-3 rounded-full">
            <SettingsIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-bank-text mb-2">Paramètres</h2>
        <p className="text-bank-text-light">Configurez votre expérience d'accordage</p>
      </div>

      {/* Paramètres audio */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-4 flex items-center">
          <Volume2 className="w-5 h-5 mr-2" />
          Paramètres Audio
        </h3>
        <div className="space-y-6">
          {/* Sensibilité du microphone */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-bank-text font-medium">Sensibilité du microphone</label>
              <span className="text-bank-blue font-bold">{settings.sensitivity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.sensitivity}
              onChange={(e) => updateSetting('sensitivity', Number(e.target.value))}
              className="w-full h-2 bg-bank-gray rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-bank-text-light mt-1">
              <span>Faible</span>
              <span>Élevée</span>
            </div>
          </div>

          {/* Filtrage du bruit */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-bank-text font-medium">Filtrage du bruit</span>
              <p className="text-sm text-bank-text-light">Réduit les bruits de fond</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.noiseReduction}
                onChange={(e) => updateSetting('noiseReduction', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bank-blue"></div>
            </label>
          </div>

          {/* Annulation d'écho */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-bank-text font-medium">Annulation d'écho</span>
              <p className="text-sm text-bank-text-light">Évite les retours audio</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.echoCancellation}
                onChange={(e) => updateSetting('echoCancellation', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bank-blue"></div>
            </label>
          </div>

          {/* Contrôle automatique du gain */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-bank-text font-medium">Contrôle auto du gain</span>
              <p className="text-sm text-bank-text-light">Ajuste automatiquement le volume</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoGainControl}
                onChange={(e) => updateSetting('autoGainControl', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bank-blue"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Paramètres d'accordage */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-4 flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Accordage
        </h3>
        <div className="space-y-6">
          {/* Seuil de confiance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-bank-text font-medium">Seuil de confiance</label>
              <span className="text-bank-blue font-bold">{Math.round(settings.threshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={settings.threshold}
              onChange={(e) => updateSetting('threshold', Number(e.target.value))}
              className="w-full h-2 bg-bank-gray rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-bank-text-light mt-1">
              <span>Permissif</span>
              <span>Strict</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <span className="text-bank-text">Référence</span>
              <div className="text-bank-blue font-medium">A4 = 440 Hz</div>
            </div>
            <div className="text-center">
              <span className="text-bank-text">Précision</span>
              <div className="text-bank-blue font-medium">±5 cents</div>
            </div>
          </div>
        </div>
      </div>

      {/* Paramètres avancés */}
      <div className="bg-white border border-bank-gray-dark rounded-lg overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 bg-bank-gray hover:bg-bank-gray-dark transition-colors duration-200 flex items-center justify-between"
        >
          <h3 className="text-lg font-semibold text-bank-text">Paramètres Avancés</h3>
          <AlertTriangle className="w-5 h-5 text-orange-500" />
        </button>

        {showAdvanced && (
          <div className="p-4 bg-white border-t border-bank-gray-dark">
            <div className="space-y-4">
              {/* FFT Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-bank-text font-medium">Taille FFT</label>
                  <span className="text-bank-blue font-bold">{settings.fftSize}</span>
                </div>
                <input
                  type="range"
                  min="2048"
                  max="16384"
                  step="2048"
                  value={settings.fftSize}
                  onChange={(e) => updateSetting('fftSize', Number(e.target.value))}
                  className="w-full h-2 bg-bank-gray rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-bank-text-light mt-1">Plus élevé = plus précis mais plus lent</p>
              </div>

              {/* Lissage temporel */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-bank-text font-medium">Lissage temporel</label>
                  <span className="text-bank-blue font-bold">{Math.round(settings.smoothingTimeConstant * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.1"
                  value={settings.smoothingTimeConstant}
                  onChange={(e) => updateSetting('smoothingTimeConstant', Number(e.target.value))}
                  className="w-full h-2 bg-bank-gray rounded-lg appearance-none cursor-pointer"
                />
                <p className="text-xs text-bank-text-light mt-1">Plus élevé = plus stable mais moins réactif</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de reset */}
      <div className="text-center">
        <button
          onClick={resetToDefaults}
          className="flex items-center space-x-2 bank-button-secondary mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Restaurer les paramètres par défaut</span>
        </button>
      </div>

      {/* Conseils d'optimisation */}
      <div className="bg-bank-gray rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Conseils d'optimisation</h3>
        <div className="space-y-3 text-sm text-bank-text-light">
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Augmentez la sensibilité si l'accordeur ne détecte pas votre guitare</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Activez le filtrage du bruit dans un environnement bruyant</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-green-500">✓</span>
            <span>Diminuez le seuil de confiance pour plus de réactivité</span>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-500">⚠</span>
            <span>Placez votre appareil près de la guitare pour un meilleur signal</span>
          </div>
        </div>
      </div>

      {/* Informations sur l'application */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-4 flex items-center">
          <Smartphone className="w-5 h-5 mr-2" />
          À propos
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-bank-text">Version</span>
            <span className="text-bank-text-light">1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-bank-text">Développé par</span>
            <span className="text-bank-blue font-medium">Christian</span>
          </div>
          <div className="pt-3 border-t border-bank-gray-dark">
            <p className="text-sm text-bank-text-light text-center">
              Accordeur de guitare professionnel avec détection de fréquence en temps réel
            </p>
          </div>
        </div>
      </div>

      {/* Conseils d'utilisation */}
      <div className="bg-bank-gray rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Conseils d'utilisation</h3>
        <ul className="space-y-2 text-sm text-bank-text-light">
          <li>• Utilisez un environnement calme pour un meilleur accordage</li>
          <li>• Placez votre appareil près de la guitare</li>
          <li>• Accordez une corde à la fois</li>
          <li>• Vérifiez l'accordage régulièrement</li>
        </ul>
      </div>
    </div>
  )
}

export default Settings
