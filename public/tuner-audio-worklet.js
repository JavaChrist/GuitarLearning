/**
 * AudioWorklet pour le traitement audio en temps réel de l'accordeur
 * Traite les données audio dans un thread séparé pour éviter les blocages UI
 */

class TunerProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    
    this.bufferSize = options?.processorOptions?.bufferSize || 2048
    this.buffer = new Float32Array(this.bufferSize)
    this.bufferIndex = 0
    this.sampleCount = 0
    
    // Paramètres de traitement
    this.hopSize = this.bufferSize / 2 // 50% de chevauchement
    this.lastProcessTime = 0
    this.processingInterval = 16 // ~60 FPS
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0]
    
    if (input.length > 0) {
      const inputChannel = input[0]
      
      // Accumulation des échantillons dans le buffer circulaire
      for (let i = 0; i < inputChannel.length; i++) {
        this.buffer[this.bufferIndex] = inputChannel[i]
        this.bufferIndex = (this.bufferIndex + 1) % this.bufferSize
        this.sampleCount++
      }
      
      // Traitement par blocs avec chevauchement
      const currentTime = currentFrame / sampleRate * 1000 // Temps en ms
      
      if (currentTime - this.lastProcessTime >= this.processingInterval && 
          this.sampleCount >= this.bufferSize) {
        
        // Copie du buffer pour le traitement
        const processBuffer = new Float32Array(this.bufferSize)
        
        // Réorganise le buffer circulaire en buffer linéaire
        for (let i = 0; i < this.bufferSize; i++) {
          const sourceIndex = (this.bufferIndex - this.bufferSize + i + this.bufferSize) % this.bufferSize
          processBuffer[i] = this.buffer[sourceIndex]
        }
        
        // Application d'une fenêtre de Hanning pour réduire les artefacts spectraux
        this.applyHanningWindow(processBuffer)
        
        // Envoi des données au thread principal
        this.port.postMessage({
          type: 'audio-data',
          buffer: processBuffer,
          timestamp: currentTime
        })
        
        this.lastProcessTime = currentTime
        
        // Avance le buffer de hopSize pour le chevauchement
        this.sampleCount = Math.max(0, this.sampleCount - this.hopSize)
      }
    }
    
    // Copie de l'entrée vers la sortie (pass-through)
    for (let outputIndex = 0; outputIndex < outputs.length; outputIndex++) {
      const output = outputs[outputIndex]
      for (let channelIndex = 0; channelIndex < output.length; channelIndex++) {
        if (input[channelIndex]) {
          output[channelIndex].set(input[channelIndex])
        }
      }
    }
    
    return true
  }
  
  /**
   * Applique une fenêtre de Hanning pour réduire les fuites spectrales
   */
  applyHanningWindow(buffer) {
    const N = buffer.length
    for (let i = 0; i < N; i++) {
      const windowValue = 0.5 * (1 - Math.cos(2 * Math.PI * i / (N - 1)))
      buffer[i] *= windowValue
    }
  }
  
  /**
   * Gestion des messages du thread principal
   */
  static get parameterDescriptors() {
    return []
  }
}

// Enregistrement du processeur
registerProcessor('tuner-processor', TunerProcessor)
