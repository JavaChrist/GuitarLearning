import React, { useState } from 'react'
import { Scale, ChevronDown, ChevronUp, Info, Music } from 'lucide-react'
import InteractiveScaleDiagram from './InteractiveScaleDiagram'
import { SCALE_GROUPS } from '../data/scales'

const Scales: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0])) // Premier groupe ouvert par défaut
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('tous')
  const [selectedTonality, setSelectedTonality] = useState<string>('toutes')

  const toggleGroup = (groupIndex: number) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupIndex)) {
      newExpanded.delete(groupIndex)
    } else {
      newExpanded.add(groupIndex)
    }
    setExpandedGroups(newExpanded)
  }

  const filteredGroups = SCALE_GROUPS.map(group => ({
    ...group,
    scales: group.scales.filter(scale => {
      const difficultyMatch = selectedDifficulty === 'tous' || scale.difficulty === selectedDifficulty
      const tonalityMatch = selectedTonality === 'toutes' || scale.tonality === selectedTonality
      return difficultyMatch && tonalityMatch
    })
  }))

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-bank-blue p-3 rounded-full">
            <Scale className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-bank-text mb-2">Gammes et Modes</h2>
        <p className="text-bank-text-light">Maîtrisez les gammes fondamentales de la guitare</p>
      </div>

      {/* Filtres */}
      <div className="space-y-4">
        {/* Filtre par difficulté */}
        <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
          <h3 className="text-sm font-semibold text-bank-text mb-3">Filtrer par difficulté</h3>
          <div className="grid grid-cols-4 gap-2">
            {['tous', 'facile', 'moyen', 'difficile'].map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-center ${selectedDifficulty === difficulty
                  ? 'bg-bank-blue text-white'
                  : 'bg-bank-gray text-bank-text hover:bg-bank-gray-dark'
                  }`}
              >
                {difficulty === 'tous' ? 'Tous' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Filtre par tonalité */}
        <div className="bg-white border border-bank-gray-dark rounded-lg p-4">
          <h3 className="text-sm font-semibold text-bank-text mb-3">Filtrer par tonalité</h3>
          <div className="grid grid-cols-5 gap-2">
            {['toutes', 'majeure', 'mineure', 'pentatonique', 'modale'].map((tonality) => (
              <button
                key={tonality}
                onClick={() => setSelectedTonality(tonality)}
                className={`px-2 py-2 rounded-lg text-xs font-medium transition-all duration-200 text-center ${selectedTonality === tonality
                  ? 'bg-bank-blue text-white'
                  : 'bg-bank-gray text-bank-text hover:bg-bank-gray-dark'
                  }`}
              >
                {tonality === 'toutes' ? 'Toutes' : tonality.charAt(0).toUpperCase() + tonality.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Légende */}
      <div className="bg-bank-gray rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Info className="w-5 h-5 text-bank-blue mr-2" />
          <h3 className="text-sm font-semibold text-bank-text">Légende des degrés</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-bank-text-light">1 - Tonique (fondamentale)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-bank-text-light">2 - Seconde</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-bank-text-light">3 - Tierce</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-bank-text-light">4 - Quarte</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-bank-text-light">5 - Quinte</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-bank-text-light">6 - Sixte</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
              <span className="text-bank-text-light">7 - Septième</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full border-2 border-red-500 mr-2"></div>
              <span className="text-bank-text-light">Cercle blanc - Note fondamentale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Groupes de gammes */}
      <div className="space-y-4">
        {filteredGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-white border border-bank-gray-dark rounded-lg overflow-hidden">
            {/* En-tête du groupe */}
            <button
              onClick={() => toggleGroup(groupIndex)}
              className="w-full px-4 py-4 bg-bank-gray hover:bg-bank-gray-dark transition-colors duration-200 flex items-center justify-between"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{group.icon}</span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-bank-text">{group.name}</h3>
                  <p className="text-sm text-bank-text-light">{group.description}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-bank-text-light mr-2">
                  {group.scales.length} gamme{group.scales.length > 1 ? 's' : ''}
                </span>
                {expandedGroups.has(groupIndex) ? (
                  <ChevronUp className="w-5 h-5 text-bank-blue" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-bank-blue" />
                )}
              </div>
            </button>

            {/* Contenu du groupe */}
            {expandedGroups.has(groupIndex) && (
              <div className="p-4 bg-white">
                {group.scales.length > 0 ? (
                  <div className="space-y-6">
                    {group.scales.map((scale, scaleIndex) => (
                      <div key={scaleIndex} className="flex justify-center">
                        <InteractiveScaleDiagram scale={scale} size="medium" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-bank-text-light">
                      Aucune gamme ne correspond aux filtres sélectionnés
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conseils d'apprentissage */}
      <div className="bg-bank-gray rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Music className="w-5 h-5 text-bank-blue mr-2" />
          <h3 className="text-lg font-semibold text-bank-text">Conseils pour apprendre les gammes</h3>
        </div>
        <ul className="space-y-2 text-sm text-bank-text-light">
          <li>• Commencez par la pentatonique mineure - la plus utilisée</li>
          <li>• Apprenez d'abord les positions, puis les noms des notes</li>
          <li>• Pratiquez lentement en montant et descendant la gamme</li>
          <li>• Concentrez-vous sur les notes fondamentales (en rouge)</li>
          <li>• Utilisez un métronome pour développer le timing</li>
          <li>• Improvisez sur des backing tracks dans la tonalité</li>
        </ul>
      </div>
    </div>
  )
}

export default Scales
