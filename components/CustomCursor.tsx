'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

type CursorMode = 'default' | 'zoom-in' | 'zoom-out' | 'grab' | 'grabbing';

export default function CustomCursor() {
  const pathname = usePathname();
  const isGallery = pathname?.startsWith('/gallery');

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Refs for zero-latency direct DOM transforms
  const pointerRef = useRef<HTMLDivElement>(null);
  const companionRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -100, y: -100 });
  const prevMousePos = useRef({ x: -100, y: -100 });
  const companionPos = useRef({ x: -100, y: -100 });
  const currentTilt = useRef(0);
  const animFrameId = useRef<number | null>(null);
  const currentModeRef = useRef<CursorMode>('default');

  useEffect(() => {
    currentModeRef.current = cursorMode;
  }, [cursorMode]);

  useEffect(() => {
    // Only activate on devices with fine pointer (mouse / trackpad) and hover capabilities
    if (typeof window === 'undefined') return;
    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouch) return;

    setMounted(true);
    document.documentElement.classList.add('has-custom-cursor');

    const updateCursorModeFromTarget = (target: HTMLElement | null, clicking: boolean) => {
      if (!target) {
        setCursorMode('default');
        return;
      }

      // 1. Check explicit data-cursor-mode
      const modeEl = target.closest('[data-cursor-mode]') as HTMLElement | null;
      if (modeEl) {
        const mode = modeEl.getAttribute('data-cursor-mode') as CursorMode;
        if (mode === 'grab' && clicking) {
          setCursorMode('grabbing');
          return;
        }
        if (['zoom-in', 'zoom-out', 'grab', 'grabbing'].includes(mode)) {
          setCursorMode(mode);
          return;
        }
      }

      // 2. Check CSS computed cursor
      try {
        const computed = window.getComputedStyle(target).cursor;
        if (computed === 'zoom-in') {
          setCursorMode('zoom-in');
          return;
        }
        if (computed === 'zoom-out') {
          setCursorMode('zoom-out');
          return;
        }
        if (computed === 'grab') {
          setCursorMode(clicking ? 'grabbing' : 'grab');
          return;
        }
        if (computed === 'grabbing') {
          setCursorMode('grabbing');
          return;
        }
      } catch {}

      setCursorMode('default');
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      updateCursorModeFromTarget(target, isClicking);
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    const handleMouseEnter = () => {
      setVisible(true);
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsClicking(true);
      const target = e.target as HTMLElement | null;
      updateCursorModeFromTarget(target, true);

      // Spawn playful micro-sparkles or shutter flash on click
      const newSparkles: Sparkle[] = [
        {
          id: Date.now() + 1,
          x: e.clientX + (Math.random() * 16 - 8),
          y: e.clientY + (Math.random() * 16 - 8),
          size: isGallery ? 14 : 10,
          color: isGallery ? '#67E8F9' : '#4285F4',
        },
        {
          id: Date.now() + 2,
          x: e.clientX + 14 + (Math.random() * 16 - 8),
          y: e.clientY - 12 + (Math.random() * 10 - 5),
          size: 8 + Math.random() * 5,
          color: '#B5C6E0',
        },
      ];

      setSparkles(prev => [...prev.slice(-4), ...newSparkles]);
      setTimeout(() => {
        setSparkles(prev => prev.filter(s => !newSparkles.some(ns => ns.id === s.id)));
      }, 600);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsClicking(false);
      const target = e.target as HTMLElement | null;
      updateCursorModeFromTarget(target, false);
    };

    // Event delegation for clickable and interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, textarea, select, [role="button"], [data-cursor-hover], [data-cursor-mode], .cursor-pointer'
      );

      if (interactive) {
        setIsHovering(true);
      } else {
        try {
          const computed = window.getComputedStyle(target).cursor;
          setIsHovering(computed === 'pointer' || computed === 'zoom-in' || computed === 'zoom-out' || computed === 'grab');
        } catch {
          setIsHovering(false);
        }
      }

      updateCursorModeFromTarget(target, isClicking);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    // Animation loop: pointer is instant (0 lag), companion smoothly follows with banking tilt
    const animate = () => {
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      // 1. Instant Pointer tracking based on mode hotspot
      if (pointerRef.current) {
        const mode = currentModeRef.current;
        if (mode === 'zoom-in' || mode === 'zoom-out') {
          // Center the magnifying glass lens directly on mouse target
          pointerRef.current.style.transform = `translate3d(${mx - 10}px, ${my - 10}px, 0)`;
        } else if (mode === 'grab' || mode === 'grabbing') {
          // Center the grab / pan crosshair directly on mouse target
          pointerRef.current.style.transform = `translate3d(${mx - 12}px, ${my - 12}px, 0)`;
        } else {
          // Default arrow hotspot at tip (2, 2)
          pointerRef.current.style.transform = `translate3d(${mx - 2}px, ${my - 2}px, 0)`;
        }
      }

      // 2. Smooth companion tracking with target offset (+14px right, +8px down)
      const targetX = mx + 14;
      const targetY = my + 8;
      companionPos.current.x += (targetX - companionPos.current.x) * 0.22;
      companionPos.current.y += (targetY - companionPos.current.y) * 0.22;

      // 3. Inertia tilt based on horizontal velocity
      const vx = mx - prevMousePos.current.x;
      prevMousePos.current.x = mx;
      prevMousePos.current.y = my;

      const targetTilt = Math.max(Math.min(vx * 1.2, 24), -24);
      currentTilt.current += (targetTilt - currentTilt.current) * 0.15;

      if (companionRef.current) {
        companionRef.current.style.transform = `translate3d(${companionPos.current.x}px, ${companionPos.current.y}px, 0) rotate(${currentTilt.current}deg)`;
      }

      animFrameId.current = requestAnimationFrame(animate);
    };

    animFrameId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [visible, isClicking, isGallery]);

  if (!mounted) return null;

  return (
    <>
      {/* 1. Precision Pointer / Tool Icon (0 latency, transforms to Zoom or Grab in gallery) */}
      <div
        ref={pointerRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[99999] will-change-transform select-none transition-opacity duration-150 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '28px',
          height: '28px',
        }}
      >
        {cursorMode === 'zoom-in' ? (
          // --- ZOOM IN MAGNIFYING GLASS ---
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ease-out filter drop-shadow-[0_2px_8px_rgba(66,133,244,0.4)] ${
              isClicking ? 'scale-90' : 'scale-110'
            }`}
          >
            {/* Outer Lens Ring */}
            <circle
              cx="10"
              cy="10"
              r="7.5"
              fill="#EBF4F5"
              stroke="#34486E"
              strokeWidth="2.2"
            />
            {/* Glass Interior */}
            <circle
              cx="10"
              cy="10"
              r="5.5"
              fill="#B5C6E0"
              fillOpacity="0.4"
            />
            {/* Handle */}
            <line
              x1="15.5"
              y1="15.5"
              x2="22"
              y2="22"
              stroke="#34486E"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="16"
              x2="21"
              y2="21"
              stroke="#EBF4F5"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Plus Symbol */}
            <line
              x1="10"
              y1="7"
              x2="10"
              y2="13"
              stroke="#4285F4"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="7"
              y1="10"
              x2="13"
              y2="10"
              stroke="#4285F4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : cursorMode === 'zoom-out' ? (
          // --- ZOOM OUT MAGNIFYING GLASS ---
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ease-out filter drop-shadow-[0_2px_8px_rgba(66,133,244,0.4)] ${
              isClicking ? 'scale-90' : 'scale-110'
            }`}
          >
            {/* Outer Lens Ring */}
            <circle
              cx="10"
              cy="10"
              r="7.5"
              fill="#EBF4F5"
              stroke="#34486E"
              strokeWidth="2.2"
            />
            {/* Glass Interior */}
            <circle
              cx="10"
              cy="10"
              r="5.5"
              fill="#B5C6E0"
              fillOpacity="0.4"
            />
            {/* Handle */}
            <line
              x1="15.5"
              y1="15.5"
              x2="22"
              y2="22"
              stroke="#34486E"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <line
              x1="16"
              y1="16"
              x2="21"
              y2="21"
              stroke="#EBF4F5"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Minus Symbol */}
            <line
              x1="7"
              y1="10"
              x2="13"
              y2="10"
              stroke="#4285F4"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        ) : cursorMode === 'grab' || cursorMode === 'grabbing' ? (
          // --- PAN / DRAG CROSSHAIR ---
          <svg
            width="26"
            height="26"
            viewBox="0 0 26 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ease-out filter drop-shadow-[0_2px_8px_rgba(66,133,244,0.45)] ${
              cursorMode === 'grabbing' || isClicking ? 'scale-90' : 'scale-110'
            }`}
          >
            {/* 4-way Navigation Arrows */}
            <path
              d="M13 3L13 23M3 13L23 13"
              stroke="#34486E"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M13 3L10 6.5M13 3L16 6.5"
              stroke="#34486E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M13 23L10 19.5M13 23L16 19.5"
              stroke="#34486E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M3 13L6.5 10M3 13L6.5 16"
              stroke="#34486E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M23 13L19.5 10M23 13L19.5 16"
              stroke="#34486E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Inner Core */}
            <circle
              cx="13"
              cy="13"
              r="3.5"
              fill="#4285F4"
              stroke="#EBF4F5"
              strokeWidth="1.5"
            />
          </svg>
        ) : (
          // --- DEFAULT PRECISION POINTER ARROW ---
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-100 ease-out ${
              isClicking ? 'scale-90' : isHovering ? 'scale-110' : 'scale-100'
            }`}
          >
            {isHovering && (
              <path
                d="M2 2L2 18L6.8 13.2L10.5 20.8L13.2 19.5L9.5 12L15.5 12L2 2Z"
                fill="none"
                stroke="#4285F4"
                strokeWidth="5"
                strokeLinejoin="round"
                className="opacity-60 blur-[2px]"
              />
            )}
            <path
              d="M2 2L2 18L6.8 13.2L10.5 20.8L13.2 19.5L9.5 12L15.5 12L2 2Z"
              fill="#EBF4F5"
              stroke="#34486E"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path
              d="M3.2 3.8L3.2 15.5L6.5 12.2L9.8 18.8L11.5 18L8.2 11.2L13 11.2L3.2 3.8Z"
              fill="#FFFFFF"
            />
            <circle
              cx="3"
              cy="3"
              r="1.2"
              fill={isHovering ? '#4285F4' : '#6F86B5'}
            />
          </svg>
        )}
      </div>

      {/* 2. Character Companion: Cute Camera on /gallery, Cute Laptop on other pages */}
      <div
        ref={companionRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-[99998] will-change-transform select-none transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          width: '38px',
          height: '32px',
        }}
      >
        <div
          className={`relative w-full h-full filter drop-shadow-[0_4px_10px_rgba(66,133,244,0.3)] transition-transform duration-200 ease-out origin-top-left ${
            isClicking ? 'scale-75' : isHovering ? 'scale-[0.88]' : 'scale-100'
          }`}
        >
          {isGallery ? (
            // ============================================
            // --- CUTE CAMERA COMPANION (FOR GALLERY) ---
            // ============================================
            <svg
              width="40"
              height="34"
              viewBox="0 0 42 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Top Shutter Button (depresses on click) */}
              <rect
                x="9"
                y={isClicking ? '4.5' : '2.5'}
                width="7"
                height="4"
                rx="1.5"
                fill="#6F86B5"
                className="transition-all duration-100"
              />

              {/* Flash / Rangefinder Window */}
              <rect
                x="26"
                y="3.5"
                width="8"
                height="3.5"
                rx="1.2"
                fill={isClicking ? '#FFFFFF' : '#4285F4'}
                stroke="#6F86B5"
                strokeWidth="1.2"
                className="transition-colors duration-100"
              />

              {/* Shutter Click Flash Burst Glow */}
              {isClicking && (
                <circle
                  cx="30"
                  cy="5"
                  r="14"
                  fill="#FFFFFF"
                  opacity="0.9"
                  className="animate-ping"
                />
              )}

              {/* Camera Main Body */}
              <rect
                x="4"
                y="6"
                width="34"
                height="26"
                rx="5"
                fill="#EBF4F5"
                stroke="#6F86B5"
                strokeWidth="2.2"
              />

              {/* Textured Grip / Accent Band on Left */}
              <path
                d="M5.5 13H12.5V30.5H5.5C4.5 30.5 4 29.5 4 28V15.5C4 14 4.5 13 5.5 13Z"
                fill="#B5C6E0"
              />

              {/* Central Camera Lens Outer Barrel */}
              <circle
                cx="24.5"
                cy="19"
                r="9.5"
                fill="#B5C6E0"
                stroke="#6F86B5"
                strokeWidth="2"
              />

              {/* Inner Lens Glass Element */}
              <circle
                cx="24.5"
                cy="19"
                r="7"
                fill="#516A99"
                stroke="#EBF4F5"
                strokeWidth="1"
              />

              {/* Lens Expressions */}
              {isClicking ? (
                // Camera Flash / Winking Expression (> <)
                <>
                  <path
                    d="M21.5 17.5L23 19L21.5 20.5"
                    stroke="#EBF4F5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M27.5 17.5L26 19L27.5 20.5"
                    stroke="#EBF4F5"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="24.5" cy="21.5" r="0.8" fill="#4285F4" />
                </>
              ) : isHovering || cursorMode === 'zoom-in' ? (
                // Happy Camera Lens Eye (^ ^) with focus ring
                <>
                  <path
                    d="M21.5 18C22 16.8 23.2 16.8 23.8 18"
                    stroke="#EBF4F5"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M25.5 18C26 16.8 27.2 16.8 27.8 18"
                    stroke="#EBF4F5"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M23.5 20.5C24.2 21.4 25 21.4 25.7 20.5"
                    stroke="#EBF4F5"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  {/* Viewfinder crosshair brackets around lens */}
                  <path
                    d="M17 14V13H18M31 14V13H30M17 24V25H18M31 24V25H30"
                    stroke="#4285F4"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </>
              ) : (
                // Normal Friendly Camera Eye (• ‿ •)
                <>
                  <circle cx="22.5" cy="18" r="1.1" fill="#EBF4F5" />
                  <circle cx="26.5" cy="18" r="1.1" fill="#EBF4F5" />
                  <path
                    d="M23.5 20.5C24.1 21.2 24.9 21.2 25.5 20.5"
                    stroke="#EBF4F5"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Red/Blue Dot Accent (Canon/Leica style) */}
              <circle cx="15.5" cy="10" r="1.3" fill="#4285F4" />

              {/* Glass Glint Reflection */}
              <path
                d="M27 14C28.2 15.2 28.8 16.5 28.8 17.5"
                stroke="#EBF4F5"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          ) : (
            // ============================================
            // --- CUTE LAPTOP COMPANION (FOR OTHER PAGES) -
            // ============================================
            <svg
              width="38"
              height="32"
              viewBox="0 0 42 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="overflow-visible"
            >
              {/* Laptop screen casing */}
              <rect
                x="8"
                y="3"
                width="25"
                height="19"
                rx="4"
                fill="#EBF4F5"
                stroke="#6F86B5"
                strokeWidth="2.2"
              />

              {/* Inner Screen */}
              <rect
                x="11"
                y="6"
                width="19"
                height="13"
                rx="2.5"
                fill="#B5C6E0"
              />

              {/* Expressions */}
              {isClicking ? (
                // Excited/winking face on click (> <)
                <>
                  <path
                    d="M15.5 10.5L17.5 12L15.5 13.5"
                    stroke="#516A99"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M25.5 10.5L23.5 12L25.5 13.5"
                    stroke="#516A99"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="20.5" cy="15.5" r="1" fill="#4285F4" />
                </>
              ) : isHovering ? (
                // Happy smiling face on link hover (^ ^)
                <>
                  <path
                    d="M15.5 13C16.2 11.2 17.8 11.2 18.5 13"
                    stroke="#516A99"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M22.5 13C23.2 11.2 24.8 11.2 25.5 13"
                    stroke="#516A99"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M18.2 15C19.5 16.6 21.5 16.6 22.8 15"
                    stroke="#516A99"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  {/* Tiny cheek blush dots */}
                  <circle cx="14" cy="14" r="0.9" fill="#FF8A80" opacity="0.85" />
                  <circle cx="27" cy="14" r="0.9" fill="#FF8A80" opacity="0.85" />
                </>
              ) : (
                // Normal friendly default face (• ‿ •)
                <>
                  <circle cx="17" cy="12" r="1.2" fill="#516A99" />
                  <circle cx="24" cy="12" r="1.2" fill="#516A99" />
                  <path
                    d="M18.5 15C19.7 16.4 22.3 16.4 23.5 15"
                    stroke="#516A99"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </>
              )}

              {/* Laptop base */}
              <path
                d="M5 23H36L39 27.5C39.4 28.2 38.9 29 38.1 29H3.9C3.1 29 2.6 28.2 3 27.5L5 23Z"
                fill="#B5C6E0"
                stroke="#6F86B5"
                strokeWidth="2"
                strokeLinejoin="round"
              />

              {/* Blue accent indicator bar */}
              <path
                d="M16 26H25"
                stroke="#4285F4"
                strokeWidth={isClicking ? '2.8' : isHovering ? '2.4' : '2'}
                strokeLinecap="round"
              />
            </svg>
          )}

          {/* Sparkle badge when hovering */}
          {(isHovering || cursorMode !== 'default') && !isClicking && (
            <span
              className="absolute -top-2 -right-1 text-xs select-none pointer-events-none animate-pulse"
              style={{ filter: 'drop-shadow(0 0 4px #4285F4)' }}
            >
              {isGallery ? '📸' : '✨'}
            </span>
          )}
        </div>
      </div>

      {/* Floating Click Particles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-[99997] select-none animate-ping"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            color: s.color,
            fontSize: `${s.size}px`,
            animationDuration: '0.6s',
          }}
        >
          {isGallery ? '✧' : '✦'}
        </div>
      ))}
    </>
  );
}


