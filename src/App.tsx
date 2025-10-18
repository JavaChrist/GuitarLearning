import React, { useState } from 'react'
import Layout from './components/Layout'
import Tuner from './components/Tuner'
import Chords from './components/Chords'
import Scales from './components/Scales'
import Exercises from './components/Exercises'
import Settings from './components/Settings'

export type Page = 'tuner' | 'chords' | 'scales' | 'exercises' | 'settings'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('tuner')

  const renderPage = () => {
    switch (currentPage) {
      case 'tuner':
        return <Tuner />
      case 'chords':
        return <Chords />
      case 'scales':
        return <Scales />
      case 'exercises':
        return <Exercises />
      case 'settings':
        return <Settings />
      default:
        return <Tuner />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}

export default App
