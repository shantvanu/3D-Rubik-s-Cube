import type { CubeState, Face, Move, Color, HintResult } from '../types'

export const FACE_COLORS: Record<Face, Color> = {
  U: '#ffffff',
  D: '#ffff00',
  L: '#ff8000',
  R: '#ff0000',
  F: '#00ff00',
  B: '#0000ff',
}

export const ALL_MOVES: Move[] = [
  'U', "U'",
  'D', "D'",
  'L', "L'",
  'R', "R'",
  'F', "F'",
  'B', "B'",
]

export function createSolvedCube(size: number): CubeState {
  const faces: Face[] = ['U', 'D', 'L', 'R', 'F', 'B']
  const result = {} as CubeState

  for (const face of faces) {
    result[face] = new Array(size * size).fill(FACE_COLORS[face])
  }

  return result
}

export function cloneCube(state: CubeState): CubeState {
  return {
    U: [...state.U],
    D: [...state.D],
    L: [...state.L],
    R: [...state.R],
    F: [...state.F],
    B: [...state.B],
  }
}

function rotateFaceCW(face: Color[], size: number): Color[] {
  const result = new Array(face.length)
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      result[c * size + (size - 1 - r)] = face[r * size + c]
    }
  }
  return result
}

function getRow(face: Color[], row: number, size: number) {
  return face.slice(row * size, row * size + size)
}

function setRow(face: Color[], row: number, values: Color[], size: number) {
  for (let i = 0; i < size; i++) {
    face[row * size + i] = values[i]
  }
}

function getCol(face: Color[], col: number, size: number) {
  return Array.from({ length: size }, (_, i) => face[i * size + col])
}

function setCol(face: Color[], col: number, values: Color[], size: number) {
  for (let i = 0; i < size; i++) {
    face[i * size + col] = values[i]
  }
}

/* ---------- MOVES ---------- */

function moveU(s: CubeState, size: number): CubeState {
  const n = cloneCube(s)
  n.U = rotateFaceCW(n.U, size)

  const f = getRow(s.F, 0, size)
  const r = getRow(s.R, 0, size)
  const b = getRow(s.B, 0, size)
  const l = getRow(s.L, 0, size)

  setRow(n.F, 0, r, size)
  setRow(n.R, 0, b, size)
  setRow(n.B, 0, l, size)
  setRow(n.L, 0, f, size)

  return n
}

function moveD(s: CubeState, size: number): CubeState {
  const n = cloneCube(s)
  const row = size - 1
  n.D = rotateFaceCW(n.D, size)

  const f = getRow(s.F, row, size)
  const l = getRow(s.L, row, size)
  const b = getRow(s.B, row, size)
  const r = getRow(s.R, row, size)

  setRow(n.F, row, l, size)
  setRow(n.L, row, b, size)
  setRow(n.B, row, r, size)
  setRow(n.R, row, f, size)

  return n
}

function moveL(s: CubeState, size: number): CubeState {
  const n = cloneCube(s)
  n.L = rotateFaceCW(n.L, size)

  const u = getCol(s.U, 0, size)
  const f = getCol(s.F, 0, size)
  const d = getCol(s.D, 0, size)
  const b = getCol(s.B, 0, size)

  setCol(n.U, 0, f, size)
  setCol(n.F, 0, d, size)
  setCol(n.D, 0, b, size)
  setCol(n.B, 0, u, size)

  return n
}

function moveR(s: CubeState, size: number): CubeState {
  const n = cloneCube(s)
  const col = size - 1
  n.R = rotateFaceCW(n.R, size)

  const u = getCol(s.U, col, size)
  const b = getCol(s.B, col, size)
  const d = getCol(s.D, col, size)
  const f = getCol(s.F, col, size)

  setCol(n.U, col, b, size)
  setCol(n.B, col, d, size)
  setCol(n.D, col, f, size)
  setCol(n.F, col, u, size)

  return n
}

function moveF(s: CubeState, size: number): CubeState {
  const n = cloneCube(s)
  const last = size - 1
  n.F = rotateFaceCW(n.F, size)

  const u = getRow(s.U, last, size)
  const r = getCol(s.R, 0, size)
  const d = getRow(s.D, 0, size)
  const l = getCol(s.L, last, size)

  setRow(n.U, last, r.reverse(), size)
  setCol(n.R, 0, d.reverse(), size)
  setRow(n.D, 0, l.reverse(), size)
  setCol(n.L, last, u.reverse(), size)

  return n
}

function moveB(s: CubeState, size: number): CubeState {
  const n = cloneCube(s)
  n.B = rotateFaceCW(n.B, size)

  const u = getRow(s.U, 0, size)
  const l = getCol(s.L, 0, size)
  const d = getRow(s.D, size - 1, size)
  const r = getCol(s.R, size - 1, size)

  setRow(n.U, 0, l.reverse(), size)
  setCol(n.L, 0, d.reverse(), size)
  setRow(n.D, size - 1, r.reverse(), size)
  setCol(n.R, size - 1, u.reverse(), size)

  return n
}

/* ---------- API ---------- */

export function applyMove(state: CubeState, move: Move, size: number): CubeState {
  switch (move) {
    case 'U': return moveU(state, size)
    case "U'": return moveU(moveU(moveU(state, size), size), size)
    case 'D': return moveD(state, size)
    case "D'": return moveD(moveD(moveD(state, size), size), size)
    case 'L': return moveL(state, size)
    case "L'": return moveL(moveL(moveL(state, size), size), size)
    case 'R': return moveR(state, size)
    case "R'": return moveR(moveR(moveR(state, size), size), size)
    case 'F': return moveF(state, size)
    case "F'": return moveF(moveF(moveF(state, size), size), size)
    case 'B': return moveB(state, size)
    case "B'": return moveB(moveB(moveB(state, size), size), size)
    default: return state
  }
}

export function scrambleCube(
  base: CubeState,
  size: number,
  count: number,
) {
  let state = cloneCube(base)
  for (let i = 0; i < count; i++) {
    const move = ALL_MOVES[Math.floor(Math.random() * ALL_MOVES.length)]
    state = applyMove(state, move, size)
  }
  return { state }
}

export function isSolved(state: CubeState): boolean {
  return Object.entries(state).every(
    ([, face]) => face.every(c => c === face[0]),
  )
}

/** Heuristic: count stickers not matching the face's target color */
export function mismatchScore(state: CubeState): number {
  let score = 0
  for (const face in state) {
    const target = FACE_COLORS[face as Face]
    for (const c of state[face as Face]) {
      if (c !== target) score++
    }
  }
  return score
}

/**
 * Smarter hint:
 * - Look ahead up to 2 moves (depth-2 search)
 * - Pick the first move in the best sequence that minimizes mismatchScore
 * This works for 3x3, 4x4, 5x5, 6x6 with the same heuristic.
 */
export function getHint(state: CubeState, size: number, maxDepth = 2): HintResult {
  const before = mismatchScore(state)
  if (before === 0) {
    return { move: null, beforeScore: 0, afterScore: 0 }
  }

  let bestMove: Move | null = null
  let bestScore = before

  const dfs = (current: CubeState, depth: number, firstMove: Move | null) => {
    const score = mismatchScore(current)
    if (score < bestScore) {
      bestScore = score
      if (firstMove) bestMove = firstMove
    }
    if (depth === maxDepth) return

    for (const move of ALL_MOVES) {
      const next = applyMove(current, move, size)
      dfs(next, depth + 1, firstMove ?? move)
    }
  }

  dfs(state, 0, null)

  return {
    move: bestMove,
    beforeScore: before,
    afterScore: bestScore,
  }
}
