import React from 'react'
import type { Move, HintResult } from '../types'

interface ControlsProps {
  size: number
  onSizeChange: (size: number) => void
  onScramble: () => void
  onMove: (move: Move) => void
  onHint: () => void
  onUndo: () => void
  canUndo: boolean
  movesCount: number
  solved: boolean
  lastHint: HintResult | null
}

export const Controls: React.FC<ControlsProps> = ({
  size,
  onSizeChange,
  onScramble,
  onMove,
  onHint,
  onUndo,
  canUndo,
  movesCount,
  solved,
  lastHint,
}) => {
  return (
    <div className="controls">
      {/* Size selector */}
      <div className="control-group">
        <label>Cube Size</label>
        <select
          value={size}
          onChange={e => onSizeChange(Number(e.target.value))}
        >
          <option value={3}>3 × 3</option>
          <option value={4}>4 × 4</option>
          <option value={5}>5 × 5</option>
          <option value={6}>6 × 6</option>
        </select>
      </div>

      {/* Main controls */}
      <div className="control-group">
        <button onClick={onScramble}>Scramble</button>
        <button onClick={onHint}>Hint</button>
        <button onClick={onUndo} disabled={!canUndo}>
          Undo
        </button>
      </div>

      {/* Move buttons */}
      <div className="move-buttons">
        {(['U', 'D', 'L', 'R', 'F', 'B'] as Move[]).map(face => (
          <button key={face} onClick={() => onMove(face)}>
            {face}
          </button>
        ))}
        {(["U'", "D'", "L'", "R'", "F'", "B'"] as Move[]).map(face => (
          <button key={face} onClick={() => onMove(face)}>
            {face}
          </button>
        ))}
      </div>

      {/* Status */}
      <div className="status">
        <p>
          <strong>Moves:</strong> {movesCount}
        </p>

        {solved && <p className="solved">🎉 Solved!</p>}

        {lastHint?.move && (
          <p>
            <strong>Next Hint:</strong> {lastHint.move}
          </p>
        )}
      </div>
    </div>
  )
}
