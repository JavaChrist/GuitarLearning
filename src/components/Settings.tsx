import React from 'react'
import { Settings as SettingsIcon, Smartphone, Music } from 'lucide-react'

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
        <p className="text-bank-text-light">Configuration de l'application</p>
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
              Application d'apprentissage de la guitare
            </p>
          </div>
        </div>
      </div>

      {/* Message principal */}
      <div className="bg-bank-gray rounded-lg p-6 text-center">
        <Music className="w-12 h-12 text-bank-blue mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-bank-text mb-2">Guitar Learning</h3>
        <p className="text-bank-text-light text-sm">
          Votre compagnon pour apprendre la guitare
        </p>
      </div>
    </div>
  )
}

export default Settings