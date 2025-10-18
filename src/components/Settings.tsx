import React from 'react'
import { Settings as SettingsIcon, Volume2, Mic, Smartphone } from 'lucide-react'

const Settings: React.FC = () => {
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-bank-text">Sensibilité du microphone</span>
            <span className="text-bank-text-light text-sm">Bientôt disponible</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-bank-text">Filtrage du bruit</span>
            <span className="text-bank-text-light text-sm">Activé par défaut</span>
          </div>
        </div>
      </div>

      {/* Paramètres d'accordage */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-4 flex items-center">
          <Mic className="w-5 h-5 mr-2" />
          Accordage
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-bank-text">Référence de fréquence</span>
            <span className="text-bank-blue font-medium">A4 = 440 Hz</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-bank-text">Précision d'accordage</span>
            <span className="text-bank-blue font-medium">±5 cents</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-bank-text">Accordage alternatif</span>
            <span className="text-bank-text-light text-sm">Bientôt disponible</span>
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
