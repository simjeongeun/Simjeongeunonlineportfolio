import { useEffect, useRef, useCallback } from 'react';

interface Runner {
  t: number;
  trackType: 'straight' | 'curve';
  lane: number;
  speed: number;
  currentSpeed: number;
  size: number;
  trail: { x: number; y: number }[];
}

export function InteractiveArtwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runnersRef = useRef<Runner[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const animFrameRef = useRef<number>(0);
  const sizeRef = useRef({ w: 0, h: 0 });

  const MOUSE_RADIUS = 160;
  const MINT = '#64D2C8';
  const NAVY = '#2B3A7E';

  const getTrackPoint = useCallback((t: number, trackType: 'straight' | 'curve', lane: number, w: number, h: number) => {
    const centerY = h * 0.28;
    const lineGap = Math.min(h * 0.07, 42);

    if (trackType === 'straight') {
      // 4 straight horizontal lines, evenly spaced
      const y = centerY - lineGap * 1.5 + lane * lineGap;
      const x = -w * 0.05 + t * (w * 1.1);
      return { x, y };
    } else {
      // 2 curve lines that overlap with bottom 2 straight lines
      // lane 0 overlaps with straight lane 2, lane 1 overlaps with straight lane 3
      const straightY = centerY - lineGap * 1.5 + (lane + 2) * lineGap;

      // Curve: starts from left, goes straight matching the line, then curves down-right
      const curveStartX = w * 0.35;
      const curveCenterX = w * 0.55;
      const curveCenterY = h * 1.8;
      const radius = curveCenterY - straightY;

      if (t <= 0.45) {
        // Straight portion (overlapping with the horizontal line)
        const frac = t / 0.45;
        const x = -w * 0.05 + frac * (curveStartX + w * 0.05);
        return { x, y: straightY };
      } else {
        // Curving arc portion
        const frac = (t - 0.45) / 0.55;
        const startAngle = -Math.PI / 2;
        const sweepAngle = Math.PI * 0.42;
        const angle = startAngle + frac * sweepAngle;
        return {
          x: curveCenterX + Math.cos(angle) * radius,
          y: curveCenterY + Math.sin(angle) * radius,
        };
      }
    }
  }, []);

  const initRunners = useCallback(() => {
    const runners: Runner[] = [];
    // Runners on straight lines
    for (let i = 0; i < 12; i++) {
      runners.push({
        t: Math.random(),
        trackType: 'straight',
        lane: Math.floor(Math.random() * 4),
        speed: 0.0012 + Math.random() * 0.0012,
        currentSpeed: 0.0015,
        size: 3 + Math.random() * 2,
        trail: [],
      });
    }
    // Runners on curves
    for (let i = 0; i < 8; i++) {
      runners.push({
        t: Math.random(),
        trackType: 'curve',
        lane: Math.floor(Math.random() * 2),
        speed: 0.001 + Math.random() * 0.001,
        currentSpeed: 0.0012,
        size: 3 + Math.random() * 2,
        trail: [],
      });
    }
    runnersRef.current = runners;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = sizeRef.current;
    const mouse = mouseRef.current;
    const centerY = h * 0.28;
    const lineGap = Math.min(h * 0.07, 42);

    ctx.clearRect(0, 0, w, h);

    // --- Draw 4 straight horizontal mint lines ---
    for (let i = 0; i < 4; i++) {
      const y = centerY - lineGap * 1.5 + i * lineGap;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      const alpha = 0.5 - i * 0.05;
      ctx.strokeStyle = MINT;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- Draw 2 navy curve lines (overlapping bottom 2 straight lines) ---
    for (let i = 0; i < 2; i++) {
      const straightY = centerY - lineGap * 1.5 + (i + 2) * lineGap;
      const curveCenterX = w * 0.55;
      const curveCenterY = h * 1.8;
      const radius = curveCenterY - straightY;
      const curveStartX = w * 0.35;

      ctx.beginPath();
      // Straight overlap portion
      ctx.moveTo(0, straightY);
      ctx.lineTo(curveStartX, straightY);

      // Transition into arc
      const steps = 80;
      for (let s = 0; s <= steps; s++) {
        const frac = s / steps;
        const startAngle = -Math.PI / 2;
        const sweepAngle = Math.PI * 0.42;
        const angle = startAngle + frac * sweepAngle;
        const x = curveCenterX + Math.cos(angle) * radius;
        const y = curveCenterY + Math.sin(angle) * radius;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = NAVY;
      ctx.globalAlpha = 0.7 - i * 0.15;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // --- Update & Draw Runners ---
    const runners = runnersRef.current;

    for (const runner of runners) {
      const pos = getTrackPoint(runner.t, runner.trackType, runner.lane, w, h);

      // Mouse boost
      if (mouse.active) {
        const dx = pos.x - mouse.x;
        const dy = pos.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const boost = (1 - dist / MOUSE_RADIUS) * 0.008;
          runner.currentSpeed = runner.speed + boost;
        } else {
          runner.currentSpeed += (runner.speed - runner.currentSpeed) * 0.05;
        }
      } else {
        runner.currentSpeed += (runner.speed - runner.currentSpeed) * 0.05;
      }

      runner.t += runner.currentSpeed;
      if (runner.t > 1) runner.t -= 1;

      // Trail
      runner.trail.push({ x: pos.x, y: pos.y });
      if (runner.trail.length > 14) runner.trail.shift();

      const color = runner.trackType === 'straight' ? MINT : NAVY;

      // Draw trail
      for (let i = 0; i < runner.trail.length; i++) {
        const tp = runner.trail[i];
        const frac = i / runner.trail.length;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, runner.size * frac * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = frac * 0.12;
        ctx.fill();
      }

      // Draw runner dot
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, runner.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Glow when boosted
      if (runner.currentSpeed > runner.speed * 1.8) {
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, runner.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Mouse cursor ring
    if (mouse.active && mouse.x > 0) {
      ctx.globalAlpha = 0.05;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = MINT;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    animFrameRef.current = requestAnimationFrame(draw);
  }, [getTrackPoint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const ctx = canvas.getContext('2d');
      ctx?.scale(dpr, dpr);
      sizeRef.current = { w, h };
      initRunners();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    };
    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top, active: true };
    };
    const handleLeave = () => {
      mouseRef.current = { x: -9999, y: -9999, active: false };
    };

    canvas.addEventListener('mousemove', handleMouse);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('mouseleave', handleLeave);
    canvas.addEventListener('touchend', handleLeave);

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('mouseleave', handleLeave);
      canvas.removeEventListener('touchend', handleLeave);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw, initRunners]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-full h-full relative">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />
      </div>
    </div>
  );
}