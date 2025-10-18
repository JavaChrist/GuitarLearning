import React, { useState } from 'react'
import ScaleDiagram, { type ScaleData } from './ScaleDiagram'

interface InteractiveScaleDiagramProps {
  scale: ScaleData
  size?: 'small' | 'medium' | 'large'
}

const InteractiveScaleDiagram: React.FC<InteractiveScaleDiagramProps> = ({
  scale,
  size = 'medium'
}) => {
  const [currentPosition, setCurrentPosition] = useState(scale.positions[0])

  return (
    <ScaleDiagram
      scale={scale}
      position={currentPosition}
      size={size}
      onPositionChange={setCurrentPosition}
    />
  )
}

export default InteractiveScaleDiagram
