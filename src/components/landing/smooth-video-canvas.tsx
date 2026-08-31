import { useEffect, useRef } from 'react';

interface SmoothVideoCanvasProps {
  videoSrc: string;
  posterSrc: string;
  targetTime: number;
  isPlayingAuto: boolean;
  onTimeUpdate?: (time: number) => void;
  onDuration?: (duration: number) => void;
}

export function SmoothVideoCanvas({
  videoSrc,
  posterSrc,
  targetTime,
  isPlayingAuto,
  onTimeUpdate,
  onDuration,
}: SmoothVideoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'));
  const animFrameRef = useRef<number | null>(null);

  const stateRef = useRef({
    targetTime: 0,
    currentTime: 0,
    isPlayingAuto: false,
    duration: 10,
    isSeeking: false,
    alphaCrossfade: 1.0,
  });

  useEffect(() => {
    stateRef.current.targetTime = targetTime;
  }, [targetTime]);

  useEffect(() => {
    stateRef.current.isPlayingAuto = isPlayingAuto;
    const video = videoRef.current;
    if (!video) return;

    if (isPlayingAuto) {
      video.playbackRate = 1.0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlayingAuto]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const prevCanvas = prevCanvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const prevCtx = prevCanvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Handle canvas resize
    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      prevCanvas.width = width * dpr;
      prevCanvas.height = height * dpr;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      if (prevCtx) {
        prevCtx.imageSmoothingEnabled = true;
        prevCtx.imageSmoothingQuality = 'high';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleLoaded = () => {
      if (video.duration) {
        stateRef.current.duration = video.duration;
        if (onDuration) onDuration(video.duration);
      }
    };

    video.addEventListener('loadedmetadata', handleLoaded);

    // 60FPS High-Precision Render & Scrub Loop
    const renderLoop = () => {
      const state = stateRef.current;

      if (state.isPlayingAuto) {
        if (!video.paused) {
          state.currentTime = video.currentTime;
          if (onTimeUpdate) onTimeUpdate(video.currentTime);
        }
      } else {
        const timeDiff = state.targetTime - state.currentTime;

        // Dynamic hybrid scrubbing:
        // When scrolling forward smoothly, use micro-playback to avoid hard keyframe snapping
        if (timeDiff > 0.04 && timeDiff < 1.2 && !state.isSeeking) {
          const rate = Math.min(Math.max(timeDiff * 2.8, 0.5), 3.5);
          video.playbackRate = rate;
          if (video.paused) video.play().catch(() => {});
          state.currentTime = video.currentTime;
        } else if (Math.abs(timeDiff) > 0.02) {
          // If jumping or reverse scroll, seek directly and smoothly crossfade
          if (!video.paused) video.pause();
          
          // Save current frame to previous canvas buffer for smooth crossfading
          if (prevCtx && canvas.width > 0 && canvas.height > 0) {
            prevCtx.drawImage(canvas, 0, 0);
            state.alphaCrossfade = 0.0;
          }

          state.currentTime += timeDiff * 0.22;
          if (isFinite(state.currentTime)) {
            video.currentTime = Math.min(Math.max(state.currentTime, 0), state.duration || 10);
          }
        } else {
          if (!video.paused) video.pause();
        }

        if (onTimeUpdate) onTimeUpdate(state.currentTime);
      }

      // Draw current video frame to canvas
      if (video.readyState >= 2) {
        const cw = canvas.width;
        const ch = canvas.height;
        const vw = video.videoWidth || 1920;
        const vh = video.videoHeight || 1080;

        // Cover aspect ratio
        const scale = Math.max(cw / vw, ch / vh);
        const nw = vw * scale;
        const nh = vh * scale;
        const nx = (cw - nw) / 2;
        const ny = (ch - nh) / 2;

        // Render previous buffer if crossfading
        if (state.alphaCrossfade < 1.0 && prevCanvas.width > 0) {
          ctx.drawImage(prevCanvas, 0, 0);
          ctx.globalAlpha = state.alphaCrossfade;
          ctx.drawImage(video, nx, ny, nw, nh);
          ctx.globalAlpha = 1.0;
          state.alphaCrossfade = Math.min(state.alphaCrossfade + 0.15, 1.0);
        } else {
          ctx.drawImage(video, nx, ny, nw, nh);
        }
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      video.removeEventListener('loadedmetadata', handleLoaded);
    };
  }, [onDuration, onTimeUpdate]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none bg-zinc-950">
      {/* Hidden Video Source for Hardware Decoder */}
      <video
        ref={videoRef}
        src={videoSrc}
        poster={posterSrc}
        playsInline
        muted
        preload="auto"
        className="hidden"
      />

      {/* Hardware-Accelerated 60FPS Cross-Fading Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover object-center brightness-[0.96] contrast-[1.03]"
      />

      {/* Ambient Multi-Stop Gradient Scrim for 100% Typography Contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/35 pointer-events-none" />
    </div>
  );
}
