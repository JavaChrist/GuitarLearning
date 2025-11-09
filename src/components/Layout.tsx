import React from 'react'
import { Music, BookOpen, Scale, Target, Settings, Home, Mic } from 'lucide-react'
import type { Page } from '../App'

interface LayoutProps {
  children: React.ReactNode
  currentPage: Page
  onPageChange: (page: Page) => void
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onPageChange }) => {
  const navigationItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'chords', label: 'Accords', icon: BookOpen },
    { id: 'scales', label: 'Gammes', icon: Scale },
    { id: 'exercises', label: 'Exercices', icon: Target },
    { id: 'tuner', label: 'Accordeur', icon: Mic },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ] as const

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header fixe style bancaire - Optimisé iPhone */}
      <header className="bg-bank-blue text-white shadow-lg sticky top-0 z-50">
        {/* Safe area top pour iPhone avec encoche/Dynamic Island */}
        <div className="h-safe-top bg-bank-blue"></div>

        {/* Contenu principal du header */}
        <div className="w-full py-4 pb-3">
          <div className="px-4">
            <div className="flex items-center justify-between min-h-[56px]">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <Music className="w-8 h-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl font-bold leading-tight">Guitar Learning</h1>
                  <p className="text-sm text-blue-200 leading-tight">Apprentissage guitare</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className="text-sm text-blue-200 font-medium">
                  {navigationItems.find(item => item.id === currentPage)?.label}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-6 max-w-md">
          {children}
        </div>
      </main>

      {/* Footer Navigation - Style bancaire optimisé iPhone */}
      <nav className="bg-white border-t border-bank-gray-dark sticky bottom-0">
        <div className="w-full py-2 pt-3">
          <div className="px-4">
            <div className="flex justify-around items-center">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const isActive = currentPage === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => onPageChange(item.id as Page)}
                    className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 ${isActive
                      ? 'text-bank-blue bg-bank-gray'
                      : 'text-bank-text-light hover:text-bank-blue hover:bg-bank-gray'
                      }`}
                  >
                    <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'stroke-2' : 'stroke-1.5'}`} />
                    <span className="text-xs mt-1 font-medium leading-tight truncate">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        {/* Safe area bottom pour iPhone */}
        <div className="h-safe-bottom bg-white"></div>
      </nav>
    </div>
  )
}

export default Layout
