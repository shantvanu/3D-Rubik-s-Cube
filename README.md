🧩 3D Rubik’s Cube Solver – Web Application

A full-fledged web-based Rubik’s Cube game and solver, built using React + TypeScript, featuring both 2D gameplay and realistic 3D visualization, smart heuristic hints, undo support, timer, and keyboard controls.

This project was designed as an original interactive game application, focusing on complex state management, visual rendering, and production-ready frontend architecture.

🚀 Live Demo

👉 **Netlify URL**: https://dainty-panda-69f487.netlify.app/

📌 Problem Statement & Motivation

Instead of cloning a standard productivity or chat application, this project explores game logic + visualization + UX complexity by implementing a Rubik’s Cube solver and simulator.

Key challenges addressed:

Managing complex N×N cube state consistently

Synchronizing 2D gameplay with 3D visualization

Designing heuristic-based solving assistance

Providing a clean, intuitive, and polished user experience

✨ Features
🟦 Core Gameplay

Supports 3×3, 4×4, 5×5, and 6×6 Rubik’s Cubes

Fully interactive 2D cube view for precise gameplay

Realistic 3D cube visualization with mouse-drag rotation

Scramble & reset functionality

🧠 Smart Hint System

Heuristic-based hint engine

Looks ahead up to 2 moves

Automatically refreshes hints after every move

Designed to work for any N×N cube size

⚠️ This is intentionally not a brute-force or CFOP solver, but a practical heuristic system suitable for real-time UI hints.

⏱️ Timer & History

Game timer starts on scramble and stops on solve

Move counter tracking

Undo support for user correction

⌨️ Keyboard Shortcuts
Action	Shortcut
Rotate faces	U D L R F B
Reverse rotation	Shift + key
Hint	H
Scramble	S
Undo	Ctrl + Z
📘 Instruction & Help System

Clear explanation of standard Rubik’s notation (U, U′, D, etc.)

Dynamic updates showing last move and its meaning

Hint logic explained in simple terms

🛠️ Tech Stack
Frontend

React (Hooks-based)

TypeScript (strict typing)

Vite – fast build tooling

CSS – responsive layout

3D Visualization

Three.js

@react-three/fiber

Custom camera controller (no external control libraries)

State Management

Local React state + history tracking

Immutable cube state transitions

Modular utility-based logic

✅ No external state libraries used to keep the project lean and readable.

🧱 Project Architecture
src/
├── components/
│   ├── CubeView.tsx        # 2D cube rendering
│   ├── Cube3DView.tsx      # Realistic 3D cubie-based cube
│   ├── Controls.tsx        # Main game controls
│
├── hooks/
│   └── useCube.ts          # Core game state & history logic
│
├── utils/
│   └── cubeUtils.ts        # Cube moves, heuristics, solver logic
│
├── types/
│   └── index.ts            # Shared TypeScript types
│
├── App.tsx                 # Application composition
├── main.tsx                # React entry point
└── index.css               # Global styles


✅ Clear separation of concerns
✅ Easy to reason about and maintain
✅ Highly testable logic layers

🧠 Hint & Solver Logic (Explained)

The solver uses a heuristic mismatch score, defined as:

The total number of stickers that do not match their face’s target color.

Algorithm:

Calculate current mismatch score

Simulate all possible moves

Recursively simulate move sequences up to depth = 2

Select the move that minimizes mismatch score

Auto-refresh hint after every user action

✅ Works consistently for 3×3 to 6×6 cubes
✅ Efficient enough for real-time interaction
✅ Avoids heavy brute-force approaches

▶️ Running Locally (Step-by-Step)
✅ Prerequisites

Node.js v18+

npm

✅ Setup Instructions
# 1. Clone the repository
git clone https://github.com/shantvanu/3D-Rubik-s-Cube.git
cd 3D-Rubik-s-Cube

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev


Open browser at:

http://localhost:5173

✅ Build for Production
npm run build

🎥 Project Demo Video

(To be added before final submission)
A short walkthrough covering:

Cube interaction

2D ↔ 3D sync

Hint logic

Undo & timer

Keyboard controls

🧑‍💻 Author

Shantvanu Mutha
🔗 GitHub: https://github.com/shantvanu/3D-Rubik-s-Cube

🏁 Final Notes for Reviewers

This project is original work, not copied from tutorials

AI tools were used only for guidance, not blind copy-paste

All logic, architecture, and decisions are fully understood and explainable

Designed with code quality, modularity, and production readiness in mind
