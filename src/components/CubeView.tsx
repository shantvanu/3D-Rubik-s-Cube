// src/components/CubeView.tsx
import React from 'react';
import type { CubeState, Face } from '../types';

interface CubeViewProps {
  cube: CubeState;
  size: number;
}

const faceOrderRow1: (Face | null)[] = [null, 'U', null, null];
const faceOrderRow2: (Face | null)[] = ['L', 'F', 'R', 'B'];
const faceOrderRow3: (Face | null)[] = [null, 'D', null, null];

const rows = [faceOrderRow1, faceOrderRow2, faceOrderRow3];

const faceLabelMap: Record<Face, string> = {
  U: 'Up',
  D: 'Down',
  L: 'Left',
  R: 'Right',
  F: 'Front',
  B: 'Back',
};

export const CubeView: React.FC<CubeViewProps> = ({ cube, size }) => {
  const renderFace = (face: Face) => {
    const arr = cube[face];
    return (
      <div className="face">
        <div className="face-label">{faceLabelMap[face]}</div>
        <div
          className="face-grid"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {arr.map((color, idx) => (
            <div
              key={idx}
              className="cell"
              style={{
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="cube-view">
      {rows.map((row, ri) => (
        <div key={ri} className="cube-row">
          {row.map((face, ci) => (
            <div key={ci} className="cube-cell-slot">
              {face ? renderFace(face) : <div className="empty-slot" />}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
