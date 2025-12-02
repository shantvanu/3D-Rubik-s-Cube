import { useCallback, useState } from 'react'
import type { CubeState, Move, HintResult } from '../types'
import {
  applyMove,
  createSolvedCube,
  getHint,
  isSolved,
  scrambleCube,
} from '../utils/cubeUtils'

interface UseCubeOptions {
  initialSize?: number
  scrambleMoves?: number
}

export function useCube(options: UseCubeOptions = {}) {
  const { initialSize = 3, scrambleMoves = 20 } = options

  const [size, setSize] = useState(initialSize)

  const [cube, setCube] = useState<CubeState>(() => {
    const base = createSolvedCube(initialSize)
    return scrambleCube(base, initialSize, scrambleMoves).state
  })

  const [history, setHistory] = useState<CubeState[]>([])
  const [historyIndex, setHistoryIndex] = useState(0)

  const [movesCount, setMovesCount] = useState(0)
  const [lastHint, setLastHint] = useState<HintResult | null>(null)
  const [lastMove, setLastMove] = useState<Move | null>(null)
  const [solved, setSolved] = useState(false)

  const resetAndScramble = useCallback(
    (newSize?: number) => {
      const finalSize = newSize ?? size
      const base = createSolvedCube(finalSize)
      const { state } = scrambleCube(base, finalSize, scrambleMoves)

      setSize(finalSize)
      setCube(state)
      setHistory([state])
      setHistoryIndex(0)
      setMovesCount(0)
      setLastMove(null)
      setSolved(isSolved(state))
      setLastHint(getHint(state, finalSize))
    },
    [size, scrambleMoves],
  )

  const performMove = useCallback(
    (move: Move) => {
      const next = applyMove(cube, move, size)

      setCube(next)
      setSolved(isSolved(next))
      setMovesCount(c => c + 1)
      setLastMove(move)
      setLastHint(getHint(next, size))

      setHistory(prev => {
        const sliced = prev.slice(0, historyIndex + 1)
        return [...sliced, next]
      })
      setHistoryIndex(i => i + 1)
    },
    [cube, size, historyIndex],
  )

  const requestHint = useCallback(() => {
    // Compute best hint for current state
    const hintNow = getHint(cube, size)
    setLastHint(hintNow)

    if (!hintNow.move) return

    // Apply that hint move
    const afterApply = applyMove(cube, hintNow.move, size)

    setCube(afterApply)
    setSolved(isSolved(afterApply))
    setMovesCount(c => c + 1)
    setLastMove(hintNow.move)

    // Precompute NEXT hint for the new state (auto-refresh)
    const nextHint = getHint(afterApply, size)
    setLastHint(nextHint)

    setHistory(prev => {
      const sliced = prev.slice(0, historyIndex + 1)
      return [...sliced, afterApply]
    })
    setHistoryIndex(i => i + 1)
  }, [cube, size, historyIndex])

  const undo = useCallback(() => {
    if (historyIndex <= 0) return
    const prevIndex = historyIndex - 1
    const prevCube = history[prevIndex]

    setCube(prevCube)
    setSolved(isSolved(prevCube))
    setHistoryIndex(prevIndex)
    setMovesCount(c => Math.max(0, c - 1))
    setLastMove(null)
    setLastHint(getHint(prevCube, size))
  }, [history, historyIndex, size])

  const redo = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    const nextCube = history[nextIndex]

    setCube(nextCube)
    setSolved(isSolved(nextCube))
    setHistoryIndex(nextIndex)
    setMovesCount(c => c + 1)
    setLastMove(null)
    setLastHint(getHint(nextCube, size))
  }, [history, historyIndex, size])

  return {
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
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  }
}
