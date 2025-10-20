import React, { useState } from 'react'
import Layout from './components/Layout'
import Home from './components/Home'
import Chords from './components/Chords'
import Scales from './components/Scales'
import Exercises from './components/Exercises'
import Settings from './components/Settings'

export type Page = 'home' | 'chords' | 'scales' | 'exercises' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />
      case 'chords':
        return <Chords />
      case 'scales':
        return <Scales />
      case 'exercises':
        return <Exercises />
      case 'settings':
        return <Settings />
      default:
        return <Home />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
