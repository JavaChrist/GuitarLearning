import React from 'react'
import { Music, BookOpen, Scale, Target } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Titre de bienvenue */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-bank-text mb-2">Bienvenue sur Guitar Learning</h2>
        <p className="text-bank-text-light">Votre compagnon pour apprendre la guitare</p>
      </div>

      {/* Cartes de fonctionnalités */}
      <div className="space-y-4">
        <div className="bg-white border border-bank-gray-dark rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <BookOpen className="w-6 h-6 text-bank-blue" />
            <h3 className="text-lg font-semibold text-bank-text">Accords</h3>
          </div>
          <p className="text-bank-text-light text-sm">
            Apprenez les accords de base et avancés avec des diagrammes interactifs
          </p>
        </div>

        <div className="bg-white border border-bank-gray-dark rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <Scale className="w-6 h-6 text-bank-blue" />
            <h3 className="text-lg font-semibold text-bank-text">Gammes</h3>
          </div>
          <p className="text-bank-text-light text-sm">
            Découvrez les gammes majeures et mineures pour improviser
          </p>
        </div>

        <div className="bg-white border border-bank-gray-dark rounded-lg p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-3">
            <Target className="w-6 h-6 text-bank-blue" />
            <h3 className="text-lg font-semibold text-bank-text">Exercices</h3>
          </div>
          <p className="text-bank-text-light text-sm">
            Pratiquez avec des exercices progressifs adaptés à votre niveau
          </p>
        </div>
      </div>

      {/* Message de motivation */}
      <div className="bg-bank-gray rounded-lg p-6 text-center">
        <Music className="w-12 h-12 text-bank-blue mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-bank-text mb-2">Commencez votre apprentissage</h3>
        <p className="text-bank-text-light text-sm">
          Utilisez la navigation en bas pour explorer les différentes sections
        </p>
      </div>
    </div>
  )
}

export default Home
