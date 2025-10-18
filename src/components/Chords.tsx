import React, { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, Info } from 'lucide-react'
import ChordDiagram from './ChordDiagram'
import { CHORD_GROUPS } from '../data/chords'

const Chords: React.FC = () => {
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set([0])) // Premier groupe ouvert par défaut
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('tous')

  const toggleGroup = (groupIndex: number) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupIndex)) {
      newExpanded.delete(groupIndex)
    } else {
      newExpanded.add(groupIndex)
    }
    setExpandedGroups(newExpanded)
  }

  const filteredGroups = CHORD_GROUPS.map(group => ({
    ...group,
    chords: selectedDifficulty === 'tous'
      ? group.chords
      : group.chords.filter(chord => chord.difficulty === selectedDifficulty)
  }))

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-bank-blue p-3 rounded-full">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-bank-text mb-2">Bibliothèque d'Accords</h2>
        <p className="text-bank-text-light">Apprenez les accords essentiels de la guitare</p>
      </div>

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

      {/* Légende */}
      <div className="bg-bank-gray rounded-lg p-4">
        <div className="flex items-center mb-3">
          <Info className="w-5 h-5 text-bank-blue mr-2" />
          <h3 className="text-sm font-semibold text-bank-text">Légende</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-bank-text-light">Index (1)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
              <span className="text-bank-text-light">Majeur (2)</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
              <span className="text-bank-text-light">Annulaire (3)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-bank-text-light">Auriculaire (4)</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-bank-gray-dark">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full border-2 border-green-500 mr-2"></div>
              <span className="text-bank-text-light">Corde à vide</span>
            </div>
            <div className="flex items-center">
              <div className="text-red-500 font-bold mr-2">×</div>
              <span className="text-bank-text-light">Corde non jouée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Groupes d'accords */}
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
                  {group.chords.length} accord{group.chords.length > 1 ? 's' : ''}
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
                {group.chords.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {group.chords.map((chord, chordIndex) => (
                      <div key={chordIndex} className="flex justify-center items-start">
                        <ChordDiagram chord={chord} size="small" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-bank-text-light">
                      Aucun accord de cette difficulté dans ce groupe
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Conseils */}
      <div className="bg-bank-gray rounded-lg p-4">
        <h3 className="text-lg font-semibold text-bank-text mb-3">Conseils pour apprendre</h3>
        <ul className="space-y-2 text-sm text-bank-text-light">
          <li>• Commencez par les accords faciles (Em, Am, D)</li>
          <li>• Entraînez-vous à changer d'accord lentement puis accélérez</li>
          <li>• Assurez-vous que chaque corde sonne clairement</li>
          <li>• Les accords barrés demandent plus de force et de pratique</li>
          <li>• Utilisez l'accordeur avant chaque session</li>
        </ul>
      </div>
    </div>
  )
}

export default Chords
