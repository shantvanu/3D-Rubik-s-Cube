// src/types.ts
export type Face = 'U' | 'D' | 'L' | 'R' | 'F' | 'B';

export type Move =
  | 'U' | "U'"
  | 'D' | "D'"
  | 'L' | "L'"
  | 'R' | "R'"
  | 'F' | "F'"
  | 'B' | "B'";

export type Color = string;

export type CubeState = Record<Face, Color[]>;

export interface HintResult {
  move: Move | null;
  beforeScore: number;
  afterScore: number;
}
