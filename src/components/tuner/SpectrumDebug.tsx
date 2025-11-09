/**
 * Composant de débogage pour visualiser le spectre FFT et la forme d'onde
 * Optionnel, activé avec ?debug=1
 */

import React, { useEffect, useRef } from 'react'

interface SpectrumDebugProps {
  audioBuffer?: Float32Array
  frequency?: number
  confidence?: number
  isActive: boolean
  className?: string
}

const SpectrumDebug: React.FC<SpectrumDebugProps> = ({
  audioBuffer,
  frequency,
  confidence,
  isActive,
  className = ''
}) => {
  const waveformCanvasRef = useRef<HTMLCanvasElement>(null)
  const spectrumCanvasRef = useRef<HTMLCanvasElement>(null)

  // Dessine la forme d'onde
  const drawWaveform = (canvas: HTMLCanvasElement, buffer: Float32Array) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    
    ctx.clearRect(0, 0, width, height)
    
    // Fond
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)
    
    // Grille
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    
    // Lignes horizontales
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }
    
    // Ligne centrale
    ctx.strokeStyle = '#94a3b8'
    ctx.beginPath()
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()
    
    // Forme d'onde
    if (buffer && buffer.length > 0) {
      ctx.strokeStyle = isActive ? '#3b82f6' : '#94a3b8'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      const step = buffer.length / width
      for (let i = 0; i < width; i++) {
        const bufferIndex = Math.floor(i * step)
        const sample = buffer[bufferIndex] || 0
        const y = height / 2 - (sample * height / 2)
        
        if (i === 0) {
          ctx.moveTo(i, y)
        } else {
          ctx.lineTo(i, y)
        }
      }
      
      ctx.stroke()
    }
    
    // Texte d'information
    ctx.fillStyle = '#64748b'
    ctx.font = '12px monospace'
    ctx.fillText('Forme d\'onde', 8, 20)
    
    if (frequency) {
      ctx.fillText(`${frequency.toFixed(1)} Hz`, 8, height - 8)
    }
  }

  // Calcule et dessine le spectre FFT
  const drawSpectrum = (canvas: HTMLCanvasElement, buffer: Float32Array) => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    
    ctx.clearRect(0, 0, width, height)
    
    // Fond
    ctx.fillStyle = '#f8fafc'
    ctx.fillRect(0, 0, width, height)
    
    // Calcul FFT simplifié
    const fftSize = Math.min(1024, buffer.length)
    const spectrum = new Float32Array(fftSize / 2)
    
    // FFT basique (pour le debug seulement)
    for (let k = 0; k < spectrum.length; k++) {
      let real = 0
      let imag = 0
      
      for (let n = 0; n < fftSize; n++) {
        const angle = -2 * Math.PI * k * n / fftSize
        const sample = buffer[n] || 0
        real += sample * Math.cos(angle)
        imag += sample * Math.sin(angle)
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag) / fftSize
    }
    
    // Grille de fréquences
    ctx.strokeStyle = '#e2e8f0'
    ctx.lineWidth = 1
    
    const sampleRate = 48000
    const nyquist = sampleRate / 2
    const freqStep = nyquist / spectrum.length
    
    // Marqueurs de fréquences importantes
    const importantFreqs = [82, 110, 147, 196, 247, 330, 440, 659, 880, 1319] // Notes de guitare
    
    importantFreqs.forEach(freq => {
      if (freq < nyquist) {
        const x = (freq / nyquist) * width
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
        
        // Étiquette de fréquence
        ctx.fillStyle = '#64748b'
        ctx.font = '10px monospace'
        ctx.save()
        ctx.translate(x + 2, height - 4)
        ctx.rotate(-Math.PI / 2)
        ctx.fillText(`${freq}Hz`, 0, 0)
        ctx.restore()
      }
    })
    
    // Spectre
    ctx.fillStyle = isActive ? '#3b82f6' : '#94a3b8'
    
    for (let i = 0; i < spectrum.length && i < width; i++) {
      const magnitude = spectrum[i]
      const x = (i / spectrum.length) * width
      const barHeight = Math.min(magnitude * height * 100, height) // Amplification pour la visibilité
      
      ctx.fillRect(x, height - barHeight, Math.max(1, width / spectrum.length), barHeight)
    }
    
    // Marqueur de fréquence détectée
    if (frequency && frequency < nyquist) {
      const x = (frequency / nyquist) * width
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
      
      // Cercle au sommet
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.arc(x, 10, 4, 0, 2 * Math.PI)
      ctx.fill()
    }
    
    // Texte d'information
    ctx.fillStyle = '#64748b'
    ctx.font = '12px monospace'
    ctx.fillText('Spectre FFT', 8, 20)
    
    if (confidence !== undefined) {
      ctx.fillText(`Confiance: ${(confidence * 100).toFixed(0)}%`, 8, height - 8)
    }
  }

  // Mise à jour des canvas
  useEffect(() => {
    if (!audioBuffer || audioBuffer.length === 0) return

    const waveformCanvas = waveformCanvasRef.current
    const spectrumCanvas = spectrumCanvasRef.current

    if (waveformCanvas) {
      // Ajuste la taille du canvas à la taille d'affichage
      const rect = waveformCanvas.getBoundingClientRect()
      waveformCanvas.width = rect.width * window.devicePixelRatio
      waveformCanvas.height = rect.height * window.devicePixelRatio
      
      const ctx = waveformCanvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      
      drawWaveform(waveformCanvas, audioBuffer)
    }

    if (spectrumCanvas) {
      // Ajuste la taille du canvas à la taille d'affichage
      const rect = spectrumCanvas.getBoundingClientRect()
      spectrumCanvas.width = rect.width * window.devicePixelRatio
      spectrumCanvas.height = rect.height * window.devicePixelRatio
      
      const ctx = spectrumCanvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
      
      drawSpectrum(spectrumCanvas, audioBuffer)
    }
  }, [audioBuffer, frequency, confidence, isActive])

  // N'affiche le composant que si ?debug=1 est présent dans l'URL
  const urlParams = new URLSearchParams(window.location.search)
  const debugMode = urlParams.get('debug') === '1'

  if (!debugMode) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
          Mode débogage
        </h3>
        
        <div className="space-y-4">
          {/* Forme d'onde */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Forme d'onde temporelle
            </h4>
            <canvas
              ref={waveformCanvasRef}
              className="w-full h-24 border border-gray-200 rounded"
              style={{ width: '100%', height: '96px' }}
            />
          </div>

          {/* Spectre de fréquences */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Analyse spectrale (FFT)
            </h4>
            <canvas
              ref={spectrumCanvasRef}
              className="w-full h-32 border border-gray-200 rounded"
              style={{ width: '100%', height: '128px' }}
            />
          </div>

          {/* Informations techniques */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-gray-50 rounded p-2">
              <div className="font-medium text-gray-700">Buffer</div>
              <div className="text-gray-600">
                {audioBuffer ? `${audioBuffer.length} échantillons` : 'Aucun'}
              </div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="font-medium text-gray-700">État</div>
              <div className="text-gray-600">
                {isActive ? 'Actif' : 'Inactif'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SpectrumDebug
