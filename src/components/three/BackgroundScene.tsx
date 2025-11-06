"use client";
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Stars } from '@react-three/drei';
import { Suspense } from 'react';

export default function BackgroundScene() {
	return (
		<div style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }} aria-hidden>
			<Canvas camera={{ position: [0, 2, 5], fov: 60 }} style={{ pointerEvents: 'none' }}>
				<ambientLight intensity={0.7} />
				<directionalLight position={[4, 6, 4]} intensity={0.7} />
				<Suspense fallback={null}>
					<Stars radius={50} depth={10} count={1200} factor={4} fade speed={1} />
					<Grid infiniteGrid cellSize={0.75} sectionSize={6} fadeDistance={30} />
				</Suspense>
				<OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
			</Canvas>
		</div>
	);
}


