import { Canvas, useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import { useRef, useMemo } from "react"
import * as THREE from "three"

function SystemCore() {
    const coreRef = useRef()
    const nodesRef = useRef()

    const nodes = useMemo(() => {
        const temp = []
        const total = 30 // cantidad de nodos (ajusta si quieres más)

        for (let i = 0; i < total; i++) {
            const radius = THREE.MathUtils.randFloat(1.2, 3.5) // distancias desiguales
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(THREE.MathUtils.randFloatSpread(2))

            const x = radius * Math.sin(phi) * Math.cos(theta)
            const y = radius * Math.sin(phi) * Math.sin(theta)
            const z = radius * Math.cos(phi)

            temp.push(new THREE.Vector3(x, y, z))
        }

        return temp
        }, [])

    useFrame(({ mouse, clock }) => {
        const t = clock.getElapsedTime()

        // Núcleo (movimiento más estable)
        if (coreRef.current) {
        coreRef.current.rotation.y = mouse.x * 0.3
        coreRef.current.rotation.x = mouse.y * 0.2
        }

        // Nodos (más reactivos + oscilación sutil)
        if (nodesRef.current) {
        nodesRef.current.rotation.y =
            mouse.x * 0.6 + Math.sin(t * 0.3) * 0.1

        nodesRef.current.rotation.x = mouse.y * 0.4
        }
    })

    return (
        <group>
        {/* Núcleo */}
        <group ref={coreRef}>
            <mesh>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial
                color="#e5e5e5"
                metalness={0.2}
                roughness={0.4}
            />
            </mesh>
        </group>

        {/* Nodos + líneas */}
        <group ref={nodesRef}>
            {nodes.map((pos, i) => (
            <mesh key={i} position={pos}>
                <sphereGeometry args={[0.09, 16, 16]} />
                <meshStandardMaterial
                color="#ffffff"
                metalness={0.1}
                roughness={0.6}
                />
            </mesh>
            ))}

            {nodes.map((pos, i) => (
            <Line
                key={`line-${i}`}
                points={[new THREE.Vector3(0, 0, 0), pos]}
                color="#ffffff"
                lineWidth={1}
                transparent
                opacity={0.25}
            />
            ))}
        </group>
        </group>
    )
    }

    export default function About3D() {
    return (
        <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <SystemCore />
        </Canvas>
    )
}
