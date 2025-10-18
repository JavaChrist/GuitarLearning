import React from 'react'
import { Target } from 'lucide-react'

const Exercises: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-bank-blue p-3 rounded-full">
            <Target className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-bank-text mb-2">Exercices d'Entraînement</h2>
        <p className="text-bank-text-light">Développez votre technique et votre précision</p>
      </div>

      {/* Message de développement */}
      <div className="bg-bank-gray rounded-lg p-8 text-center">
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-6 border border-bank-gray-dark">
            <h3 className="text-lg font-semibold text-bank-text mb-2">Fonctionnalité en développement</h3>
            <p className="text-bank-text-light">
              Cette section offrira des exercices progressifs :
            </p>
            <ul className="text-left text-bank-text-light mt-4 space-y-2">
              <li>• Exercices de dextérité et coordination</li>
              <li>• Entraînement rythmique avec métronome</li>
              <li>• Exercices d'arpèges</li>
              <li>• Travail des gammes</li>
              <li>• Suivi des progrès</li>
              <li>• Défis quotidiens</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-sm text-bank-text-light">
              L'accordage précis est la base de tout bon exercice !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Exercises
