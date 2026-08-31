import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface ThreeHeroCanvasProps {
  activeTab: 'frontend' | 'ai' | '3d';
  onNodeClick?: (nodeId: number) => void;
}

export function ThreeHeroCanvas({ activeTab, onNodeClick }: ThreeHeroCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  // References for animation state
  const stateRef = useRef({
    isPlaying: true,
    scrollProgress: 0,
    targetScrollProgress: 0,
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    activeTab: 'ai' as 'frontend' | 'ai' | '3d',
    time: 0,
  });

  useEffect(() => {
    stateRef.current.isPlaying = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    stateRef.current.activeTab = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight;
      const progress = Math.min(Math.max(scrollY / (heroHeight * 1.2), 0), 1);
      stateRef.current.targetScrollProgress = progress;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0c10, 0.035);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const amberLight = new THREE.PointLight(0xf59e0b, 3.5, 20);
    amberLight.position.set(4, 3, 3);
    scene.add(amberLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3.5, 20);
    cyanLight.position.set(-4, -3, 3);
    scene.add(cyanLight);

    const whiteLight = new THREE.DirectionalLight(0xffffff, 1.5);
    whiteLight.position.set(0, 6, 6);
    scene.add(whiteLight);

    // 5. Build 3D Models & Hierarchy
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // A. 3D Neural Network Matrix (Center Core)
    const neuralGroup = new THREE.Group();
    masterGroup.add(neuralGroup);

    const nodeCount = 38;
    const nodeGeometry = new THREE.SphereGeometry(0.08, 16, 16);
    const coreGeometry = new THREE.SphereGeometry(0.18, 24, 24);

    const amberNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });

    const cyanNodeMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });

    const whiteCoreMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.2,
      roughness: 0.1,
    });

    // Central Core Node
    const centerCore = new THREE.Mesh(coreGeometry, whiteCoreMaterial);
    neuralGroup.add(centerCore);

    const nodePositions: THREE.Vector3[] = [];
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const radius = 1.4 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      const pos = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta) * 0.7,
        radius * Math.cos(phi)
      );

      nodePositions.push(pos);
      const isAmber = i % 2 === 0;
      const mesh = new THREE.Mesh(nodeGeometry, isAmber ? amberNodeMaterial : cyanNodeMaterial);
      mesh.position.copy(pos);
      neuralGroup.add(mesh);
      nodeMeshes.push(mesh);
    }

    // Connect Nodes with 3D Lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });

    const linePoints: THREE.Vector3[] = [];
    for (let i = 0; i < nodeCount; i++) {
      linePoints.push(new THREE.Vector3(0, 0, 0));
      linePoints.push(nodePositions[i]);

      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.3) {
          linePoints.push(nodePositions[i]);
          linePoints.push(nodePositions[j]);
        }
      }
    }

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints);
    const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    neuralGroup.add(networkLines);

    // B. Floating Holographic Tech Planes & Isometric Architecture Boxes
    const architectureGroup = new THREE.Group();
    masterGroup.add(architectureGroup);

    // Wireframe Outer Bounding Frame
    const frameGeometry = new THREE.BoxGeometry(4.2, 2.8, 2.2);
    const frameEdges = new THREE.EdgesGeometry(frameGeometry);
    const frameMaterial = new THREE.LineBasicMaterial({
      color: 0xfef08a,
      transparent: true,
      opacity: 0.25,
    });
    const boundingWireframe = new THREE.LineSegments(frameEdges, frameMaterial);
    architectureGroup.add(boundingWireframe);

    // 3 Layered Software Platform Slabs (UI, Logic, DB)
    const slabGeometry = new THREE.BoxGeometry(3.6, 0.06, 2.4);
    const slabMaterial1 = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.9,
    });
    const slabMaterial2 = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.9,
    });
    const slabMaterial3 = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.45,
      roughness: 0.1,
      metalness: 0.9,
    });

    const slabTop = new THREE.Mesh(slabGeometry, slabMaterial1);
    slabTop.position.y = 1.0;
    const slabMid = new THREE.Mesh(slabGeometry, slabMaterial2);
    slabMid.position.y = 0.0;
    const slabBot = new THREE.Mesh(slabGeometry, slabMaterial3);
    slabBot.position.y = -1.0;

    architectureGroup.add(slabTop, slabMid, slabBot);

    // C. 3D Particle Dust Field
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particleCoords[i] = (Math.random() - 0.5) * 12;
      particleCoords[i + 1] = (Math.random() - 0.5) * 8;
      particleCoords[i + 2] = (Math.random() - 0.5) * 8;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xfef08a,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // D. Mouse & Resize Handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouse.targetX = x * 0.4;
      stateRef.current.mouse.targetY = y * 0.4;
    };

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);
    container.addEventListener('mousemove', handleMouseMove);

    // 6. Animation Loop (60FPS Smooth Lerping)
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const state = stateRef.current;
      if (state.isPlaying) {
        state.time += 0.015;
      }

      // Smooth scroll lerping
      state.scrollProgress += (state.targetScrollProgress - state.scrollProgress) * 0.08;

      // Smooth mouse lerping
      state.mouse.x += (state.mouse.targetX - state.mouse.x) * 0.06;
      state.mouse.y += (state.mouse.targetY - state.mouse.y) * 0.06;

      // Base rotation + Scroll rotation
      const scrollRotY = state.scrollProgress * Math.PI * 1.8;
      const scrollRotX = state.scrollProgress * Math.PI * 0.45;
      const scrollZoom = state.scrollProgress * 2.2;

      masterGroup.rotation.y = state.time * 0.2 + scrollRotY + state.mouse.x;
      masterGroup.rotation.x = Math.sin(state.time * 0.3) * 0.1 + scrollRotX - state.mouse.y;
      masterGroup.rotation.z = Math.cos(state.time * 0.2) * 0.05;

      // Dynamic Camera Position based on Active Tab & Scroll
      let targetCamZ = 6.8 - scrollZoom;
      let targetCamY = 0;
      let targetCamX = 0;

      if (state.activeTab === 'frontend') {
        targetCamY = 1.2;
        targetCamZ = 5.8;
        slabTop.scale.set(1.1, 1.1, 1.1);
        slabMid.scale.set(0.95, 0.95, 0.95);
        slabBot.scale.set(0.9, 0.9, 0.9);
      } else if (state.activeTab === 'ai') {
        targetCamY = 0;
        targetCamZ = 5.2;
        slabTop.scale.set(1, 1, 1);
        slabMid.scale.set(1.15, 1.15, 1.15);
        slabBot.scale.set(1, 1, 1);
      } else if (state.activeTab === '3d') {
        targetCamY = -0.8;
        targetCamX = 1.2;
        targetCamZ = 6.0;
        slabTop.scale.set(0.95, 0.95, 0.95);
        slabMid.scale.set(1, 1, 1);
        slabBot.scale.set(1.15, 1.15, 1.15);
      }

      camera.position.z += (targetCamZ - camera.position.z) * 0.08;
      camera.position.y += (targetCamY - camera.position.y) * 0.08;
      camera.position.x += (targetCamX - camera.position.x) * 0.08;
      camera.lookAt(0, 0, 0);

      // Node pulsing in 3D
      nodeMeshes.forEach((mesh, idx) => {
        const scale = 1 + Math.sin(state.time * 2.5 + idx) * 0.25;
        mesh.scale.set(scale, scale, scale);
      });

      centerCore.scale.setScalar(1 + Math.sin(state.time * 3) * 0.15);

      // Particle subtle drifting
      particleSystem.rotation.y = state.time * 0.05;
      particleSystem.rotation.x = state.time * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[420px] rounded-[26px] overflow-hidden bg-gradient-to-b from-zinc-950/95 via-zinc-950 to-black select-none border border-white/10 shadow-2xl">
      {/* 3D WebGL Canvas Mounting Point */}
      <div ref={mountRef} className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* Top Ambient Badge */}
      <div className="absolute top-3.5 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono text-butter uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-butter" />
          <span>Realtime 3D Neural WebGL</span>
        </div>
      </div>

      {/* Interactive 3D Hotspot Tags overlayed on canvas */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {/* Hotspot 1: Neural Logic */}
        <button
          type="button"
          onClick={() => onNodeClick && onNodeClick(1)}
          className="absolute top-[42%] left-[48%] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-butter/40 animate-radar absolute" />
            <div className="w-3.5 h-3.5 rounded-full bg-butter text-zinc-950 font-bold text-[9px] flex items-center justify-center shadow-md border-2 border-white" />
          </div>
          <div className="opacity-0 group-hover/pin:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl bg-zinc-950/90 text-white text-[10px] font-mono whitespace-nowrap border border-white/20 shadow-xl backdrop-blur-md">
            AI Multi-Agent Core (Click to inspect)
          </div>
        </button>

        {/* Hotspot 2: Next-Gen React UI */}
        <button
          type="button"
          onClick={() => onNodeClick && onNodeClick(2)}
          className="absolute top-[26%] left-[28%] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-cyan-400/40 animate-radar absolute" />
            <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-md border-2 border-white" />
          </div>
          <div className="opacity-0 group-hover/pin:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl bg-zinc-950/90 text-white text-[10px] font-mono whitespace-nowrap border border-white/20 shadow-xl backdrop-blur-md">
            Reactive UI & 60fps Motion
          </div>
        </button>

        {/* Hotspot 3: Edge Cloud */}
        <button
          type="button"
          onClick={() => onNodeClick && onNodeClick(3)}
          className="absolute top-[68%] right-[26%] pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group/pin cursor-pointer"
        >
          <div className="relative flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-blue-400/40 animate-radar absolute" />
            <div className="w-3 h-3 rounded-full bg-blue-400 shadow-md border-2 border-white" />
          </div>
          <div className="opacity-0 group-hover/pin:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-xl bg-zinc-950/90 text-white text-[10px] font-mono whitespace-nowrap border border-white/20 shadow-xl backdrop-blur-md">
            Global Edge Runtime SLA
          </div>
        </button>
      </div>

      {/* Interactive Remotion/Video Scrubber Controls at Bottom */}
      <div className="absolute bottom-3 inset-x-3 z-30 p-2.5 rounded-2xl bg-zinc-950/80 backdrop-blur-xl border border-white/10 flex items-center justify-between gap-3 text-white">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label={isPlaying ? 'Pause 3D animation' : 'Play 3D animation'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
        </button>

        {/* Scroll / Scrub Timeline Bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span className="text-butter font-semibold">3D Scroll Cam</span>
            <span>{Math.round(scrollProgress * 100)}% Scrubbed</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-butter via-cyan-400 to-emerald-400 transition-all duration-150 rounded-full"
              style={{ width: `${Math.max(scrollProgress * 100, 6)}%` }}
            />
          </div>
        </div>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={() => {
            stateRef.current.targetScrollProgress = 0;
            setScrollProgress(0);
          }}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Reset Camera"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
