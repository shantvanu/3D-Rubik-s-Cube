import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import type { CubeState, Face } from '../types'

interface Props {
  cube: CubeState
  size: number
}

/* ---------- Cubie ---------- */
function Cubie({
  position,
  colors,
}: {
  position: [number, number, number]
  colors: Partial<Record<Face, string>>
}) {
  const materials = [
    new THREE.MeshStandardMaterial({ color: colors.R ?? '#111' }),
    new THREE.MeshStandardMaterial({ color: colors.L ?? '#111' }),
    new THREE.MeshStandardMaterial({ color: colors.U ?? '#111' }),
    new THREE.MeshStandardMaterial({ color: colors.D ?? '#111' }),
    new THREE.MeshStandardMaterial({ color: colors.F ?? '#111' }),
    new THREE.MeshStandardMaterial({ color: colors.B ?? '#111' }),
  ]

  return (
    <mesh position={position}>
      <boxGeometry args={[0.95, 0.95, 0.95]} />
      {materials.map((m, i) => (
        <primitive attach={`material-${i}`} object={m} key={i} />
      ))}
    </mesh>
  )
}

/* ---------- Camera Controller (FIXED) ---------- */
function CameraController() {
  const { camera, gl } = useThree()
  const isDragging = useRef(false)
  const last = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const dom = gl.domElement

    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true
      last.current = { x: e.clientX, y: e.clientY }
    }

    const onPointerUp = () => {
      isDragging.current = false
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return
      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y

      camera.position.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        dx * 0.005,
      )
      camera.position.applyAxisAngle(
        new THREE.Vector3(1, 0, 0),
        dy * 0.005,
      )

      last.current = { x: e.clientX, y: e.clientY }
    }

    dom.addEventListener('pointerdown', onPointerDown)
    dom.addEventListener('pointerup', onPointerUp)
    dom.addEventListener('pointerleave', onPointerUp)
    dom.addEventListener('pointermove', onPointerMove)

    return () => {
      dom.removeEventListener('pointerdown', onPointerDown)
      dom.removeEventListener('pointerup', onPointerUp)
      dom.removeEventListener('pointerleave', onPointerUp)
      dom.removeEventListener('pointermove', onPointerMove)
    }
  }, [camera, gl])

  useFrame(() => {
    camera.lookAt(0, 0, 0)
  })

  return null
}

/* ---------- Main Cube ---------- */
export function Cube3DView({ cube, size }: Props) {
  const half = (size - 1) / 2
  const cubies = []

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        if (
          x === 0 || x === size - 1 ||
          y === 0 || y === size - 1 ||
          z === 0 || z === size - 1
        ) {
          cubies.push(
            <Cubie
              key={`${x}-${y}-${z}`}
              position={[x - half, y - half, z - half]}
              colors={{
                R: x === size - 1 ? cube.R[y * size + z] : undefined,
                L: x === 0 ? cube.L[y * size + z] : undefined,
                U: y === size - 1 ? cube.U[z * size + x] : undefined,
                D: y === 0 ? cube.D[z * size + x] : undefined,
                F: z === size - 1 ? cube.F[y * size + x] : undefined,
                B: z === 0 ? cube.B[y * size + x] : undefined,
              }}
            />,
          )
        }
      }
    }
  }

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [5, 5, 5], fov: 60 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        {cubies}
        <CameraController />
      </Canvas>
    </div>
  )
}
