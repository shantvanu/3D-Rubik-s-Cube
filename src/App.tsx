import React, { useEffect, useState } from 'react'
import { useCube } from './hooks/useCube'
import { CubeView } from './components/CubeView'
import { Cube3DView } from './components/Cube3DView'
import { Controls } from './components/Controls'
import type { Move } from './types'
import './index.css'

function moveMeaning(move: Move) {
  const face = move[0]
  const prime = move.includes("'")
  const faceMap: Record<string, string> = {
    U: 'Up',
    D: 'Down',
    L: 'Left',
    R: 'Right',
    F: 'Front',
    B: 'Back',
  }
  const direction = prime ? 'counter-clockwise' : 'clockwise'
  return `${faceMap[face]} face rotated ${direction}`
}

type ViewMode = '2d' | '3d'
type Tab = 'keyboard' | 'instructions' | 'hints'

export default function App() {
  const {
    cube,
    size,
    solved,
    movesCount,
    lastHint,
    lastMove,
    resetAndScramble,
    performMove,
    requestHint,
    undo,
    canUndo,
  } = useCube()

  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [activeTab, setActiveTab] = useState<Tab>('keyboard')

  // ✅ TIMER (top-left)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime || solved) return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startTime, solved])

  const handleScramble = () => {
    resetAndScramble()
    setStartTime(Date.now())
    setElapsed(0)
  }

  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60)
      .toString()
      .padStart(2, '0')}`

  // ✅ Keyboard support (REDO removed)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const shift = e.shiftKey

      const keyToMove = (k: string, s: boolean): Move | null => {
        if (k === 'u') return s ? "U'" : 'U'
        if (k === 'd') return s ? "D'" : 'D'
        if (k === 'l') return s ? "L'" : 'L'
        if (k === 'r') return s ? "R'" : 'R'
        if (k === 'f') return s ? "F'" : 'F'
        if (k === 'b') return s ? "B'" : 'B'
        return null
      }

      const move = keyToMove(key, shift)
      if (move) {
        e.preventDefault()
        performMove(move)
        return
      }

      if (key === 'h') {
        e.preventDefault()
        requestHint()
      }
      if (key === 's') {
        e.preventDefault()
        handleScramble()
      }
      if (key === 'z' && e.ctrlKey) {
        e.preventDefault()
        undo()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [performMove, requestHint, undo])

  return (
    <div className="app-root">
      {/* ✅ TOP BAR WITH TIMER */}
      <div className="top-bar">
        <span className="timer">
          ⏱ {formatTime(elapsed)}
        </span>
      </div>

      <header>
        <h1>Rubik&apos;s Cube Solver Mini Game</h1>
        <p>Play in 2D, visualize in 3D, and use smart heuristic hints.</p>
      </header>

      <main className="layout">
        <div className="cube-column">
          <div className="view-toggle">
            <button
              className={viewMode === '2d' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setViewMode('2d')}
            >
              2D View
            </button>
            <button
              className={viewMode === '3d' ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => setViewMode('3d')}
            >
              3D View
            </button>
          </div>

          {viewMode === '2d' ? (
            <CubeView cube={cube} size={size} />
          ) : (
            <Cube3DView cube={cube} size={size} />
          )}
        </div>

        <div>
          <Controls
            size={size}
            onSizeChange={resetAndScramble}
            onScramble={handleScramble}
            onMove={performMove}
            onHint={requestHint}
            onUndo={undo}
            canUndo={canUndo}
            movesCount={movesCount}
            solved={solved}
            lastHint={lastHint}
          />

          <div className="tabs-container">
            <div className="tabs">
              <button
                className={`tab ${activeTab === 'keyboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('keyboard')}
              >
                Keyboard
              </button>
              <button
                className={`tab ${activeTab === 'instructions' ? 'active' : ''}`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
              <button
                className={`tab ${activeTab === 'hints' ? 'active' : ''}`}
                onClick={() => setActiveTab('hints')}
              >
                Hint Logic
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'instructions' && (
                <>
                  <ul>
                    <li><strong>U</strong> – Up face clockwise</li>
                    <li><strong>U&apos;</strong> – Up face counter-clockwise</li>
                    <li><strong>D</strong> – Down face clockwise</li>
                    <li><strong>D&apos;</strong> – Down face counter-clockwise</li>
                    <li><strong>L</strong> – Left face clockwise</li>
                    <li><strong>L&apos;</strong> – Left face counter-clockwise</li>
                    <li><strong>R</strong> – Right face clockwise</li>
                    <li><strong>R&apos;</strong> – Right face counter-clockwise</li>
                    <li><strong>F</strong> – Front face clockwise</li>
                    <li><strong>F&apos;</strong> – Front face counter-clockwise</li>
                    <li><strong>B</strong> – Back face clockwise</li>
                    <li><strong>B&apos;</strong> – Back face counter-clockwise</li>
                  </ul>

                  {lastMove && (
                    <p>
                      <strong>Last Move:</strong> {lastMove} → {moveMeaning(lastMove)}
                    </p>
                  )}

                  <p>
                    <strong>Moves:</strong> {movesCount}
                  </p>

                  {solved && <p>🎉 Cube solved!</p>}
                </>
              )}

              {activeTab === 'keyboard' && (
                <ul>
                  <li>U D L R F B – clockwise turns</li>
                  <li>Shift + key – counter-clockwise</li>
                  <li>H – apply hint</li>
                  <li>S – scramble</li>
                  <li>Ctrl+Z – undo</li>
                </ul>
              )}

              {activeTab === 'hints' && (
                <p>
                  Hints search move sequences up to depth 2 and suggest the move
                  that reduces global sticker mismatches the most.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer>
  Made By Shantvanu Mutha ·{' '}
  <a
    href="https://github.com/shantvanu/3D-Rubik-s-Cube"
    target="_blank"
    rel="noopener noreferrer"
  >
    GitHub Repository
  </a>
</footer>

    </div>
  )
}
