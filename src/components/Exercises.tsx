import React, { useState } from 'react'
import { Target, ChevronDown, ChevronUp, Play, Info } from 'lucide-react'
import AnimatedTablature from './AnimatedTablature'
import { PENTATONIC_EXERCISES } from '../data/exercises'

const Exercises: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)

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
        <p className="text-bank-text-light">Tablatures animées avec son pour apprendre</p>
      </div>

      {/* Instructions */}
      <div className="bg-bank-gray rounded-lg overflow-hidden">
        <button
          onClick={() => setShowInstructions(!showInstructions)}
          className="w-full px-4 py-3 bg-bank-gray hover:bg-bank-gray-dark transition-colors duration-200 flex items-center justify-between"
        >
          <div className="flex items-center">
            <Info className="w-5 h-5 text-bank-blue mr-2" />
            <h3 className="text-lg font-semibold text-bank-text">Instructions d'utilisation</h3>
          </div>
          {showInstructions ? (
            <ChevronUp className="w-5 h-5 text-bank-blue" />
          ) : (
            <ChevronDown className="w-5 h-5 text-bank-blue" />
          )}
        </button>

        {showInstructions && (
          <div className="p-4 bg-white border-t border-bank-gray-dark">
            <div className="grid md:grid-cols-2 gap-4 text-sm text-bank-text-light">
              <div>
                <h4 className="font-semibold text-bank-text mb-2">Comment utiliser :</h4>
                <ul className="space-y-1">
                  <li>• Cliquez sur <strong>Play</strong> pour démarrer l'animation</li>
                  <li>• La note rouge clignote = note courante à jouer</li>
                  <li>• Les notes vertes = déjà jouées</li>
                  <li>• Ajustez le tempo selon votre niveau</li>
                  <li>• Utilisez <strong>Reset</strong> pour recommencer</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-bank-text mb-2">Conseils d'apprentissage :</h4>
                <ul className="space-y-1">
                  <li>• Commencez lentement (60-80 BPM)</li>
                  <li>• Suivez la tablature avec vos doigts</li>
                  <li>• Écoutez le son de référence</li>
                  <li>• Répétez jusqu'à maîtriser</li>
                  <li>• Augmentez progressivement le tempo</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sélecteur d'exercices */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Choisir un exercice</h3>
        <div className="grid gap-2">
          {PENTATONIC_EXERCISES.map((exercise, index) => (
            <button
              key={index}
              onClick={() => setSelectedExercise(index)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${selectedExercise === index
                  ? 'border-bank-blue bg-bank-blue text-white'
                  : 'border-bank-gray-dark bg-white text-bank-text hover:border-bank-blue'
                }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{exercise.title}</div>
                  <div className={`text-sm ${selectedExercise === index ? 'text-blue-200' : 'text-bank-text-light'}`}>
                    {exercise.notes.length} notes • {exercise.tempo} BPM
                  </div>
                </div>
                <Play className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tablature animée */}
      <div className="space-y-4">
        <AnimatedTablature
          tablature={PENTATONIC_EXERCISES[selectedExercise]}
          width={800}
          height={200}
        />
      </div>

      {/* Conseils techniques */}
      <div className="bg-bank-gray rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Conseils techniques</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-bank-text-light">
          <div>
            <h4 className="font-semibold text-bank-text mb-2">Technique de main gauche :</h4>
            <ul className="space-y-1">
              <li>• Gardez le pouce derrière le manche</li>
              <li>• Courbez bien les doigts</li>
              <li>• Appuyez juste derrière les frettes</li>
              <li>• Un doigt par frette dans la position</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-bank-text mb-2">Technique de main droite :</h4>
            <ul className="space-y-1">
              <li>• Alternez index/majeur ou utilisez un médiator</li>
              <li>• Gardez un mouvement fluide</li>
              <li>• Attaquez les cordes perpendiculairement</li>
              <li>• Travaillez la régularité du son</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Prochains exercices */}
      <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Prochainement</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-bank-text-light">
          <ul className="space-y-2">
            <li>• Exercices d'arpèges animés</li>
            <li>• Gammes majeures et mineures</li>
            <li>• Techniques avancées (bending, vibrato)</li>
          </ul>
          <ul className="space-y-2">
            <li>• Métronome visuel intégré</li>
            <li>• Suivi des progrès personnalisé</li>
            <li>• Exercices de rythme complexes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Exercises
