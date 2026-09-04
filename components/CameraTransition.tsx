"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";

interface CameraTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  frameCount?: number;
}

// Synthesize authentic camera sounds using Web Audio API (zero external assets)
const playAudioFeedback = (type: "focus" | "shutter") => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;

    if (type === "focus") {
      // Crisp DSLR focus lock double-beep (A6 -> C7)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(1760, now);
      gain1.gain.setValueAtTime(0.04, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.04);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2349, now + 0.05);
      gain2.gain.setValueAtTime(0.04, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.09);
    } else if (type === "shutter") {
      // Realistic mechanical focal-plane shutter click (first curtain + mirror slap + second curtain)
      const bufferSize = Math.floor(ctx.sampleRate * 0.06);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // 1. First curtain noise burst
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1600, now);
      filter.Q.setValueAtTime(2.5, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.13, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      whiteNoise.start(now);

      // 2. Mirror slap (subtle punchy low frequency thud)
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.05);
      oscGain.gain.setValueAtTime(0.18, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);

      // 3. Second curtain catch (snappy mechanical latch)
      const whiteNoise2 = ctx.createBufferSource();
      whiteNoise2.buffer = noiseBuffer;
      const filter2 = ctx.createBiquadFilter();
      filter2.type = "highpass";
      filter2.frequency.setValueAtTime(2400, now + 0.045);

      const noiseGain2 = ctx.createGain();
      noiseGain2.gain.setValueAtTime(0.11, now + 0.045);
      noiseGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      whiteNoise2.connect(filter2);
      filter2.connect(noiseGain2);
      noiseGain2.connect(ctx.destination);
      whiteNoise2.start(now + 0.045);
    }
  } catch {
    // Graceful silent fallback if autoplay restricted
  }
};

const CameraTransition: React.FC<CameraTransitionProps> = ({
  isActive,
  onComplete,
  frameCount = 1,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<"viewfinder" | "focus" | "shutter" | "flash" | "fadeout" | "done">("viewfinder");
  const [dateTime, setDateTime] = useState({ dateStr: "26.09.05", timeStr: "12:00" });
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
  };

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setDateTime({
      dateStr: `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,
      timeStr: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    });
  }, []);

  const triggerShutterSequence = useCallback(() => {
    clearAllTimers();
    setPhase("shutter");
    playAudioFeedback("shutter");
    triggerHaptic("rigid");

    const t1 = setTimeout(() => {
      setPhase("flash");
    }, 120);

    const t2 = setTimeout(() => {
      setPhase("fadeout");
    }, 380);

    const t3 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 680);

    timersRef.current = [t1, t2, t3];
  }, [onComplete]);

  // Fast-forward on click
  const handleUserSnap = () => {
    if (phase === "viewfinder" || phase === "focus") {
      triggerShutterSequence();
    }
  };

  useEffect(() => {
    if (!isActive) {
      setPhase("done");
      return;
    }

    setPhase("viewfinder");
    clearAllTimers();

    // Cinematic camera timing pipeline:
    // 0ms: Viewfinder EVF active
    // 400ms: Focus lock (AF-C lock beep + emerald reticle)
    // 820ms: Shutter snap (mechanical blades + audio click)
    // 940ms: Xenon Flash bloom
    // 1180ms: Fadeout / Aperture iris reveal
    // 1480ms: Complete and unmount
    const tFocus = setTimeout(() => {
      setPhase("focus");
      playAudioFeedback("focus");
      triggerHaptic("selection");
    }, 400);

    const tShutter = setTimeout(() => {
      setPhase("shutter");
      playAudioFeedback("shutter");
      triggerHaptic("rigid");
    }, 820);

    const tFlash = setTimeout(() => {
      setPhase("flash");
    }, 940);

    const tFadeout = setTimeout(() => {
      setPhase("fadeout");
    }, 1180);

    const tDone = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 1480);

    timersRef.current = [tFocus, tShutter, tFlash, tFadeout, tDone];

    return () => {
      clearAllTimers();
    };
  }, [isActive, onComplete]);

  if (!isMounted || phase === "done" || !isActive) return null;

  const { dateStr, timeStr } = dateTime;
  const frameStr = String(frameCount).padStart(3, "0");
  const isFocused = phase === "focus" || phase === "shutter";

  return (
    <motion.div
      className="fixed inset-0 z-[99999] cursor-pointer select-none overflow-hidden"
      onClick={handleUserSnap}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      {/* Background overlay */}
      {phase === "flash" ? (
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#ffffff_0%,_#f0f7ff_60%,_rgba(235,244,245,0.9)_100%)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.6, 0] }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-sm" />
      )}

      {/* Mechanical Focal-Plane Shutter Blades */}
      <AnimatePresence>
        {phase === "shutter" && (
          <>
            {/* Top Shutter Curtain */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 bg-zinc-950 border-b border-amber-500/40 z-30 shadow-2xl"
              initial={{ y: "-100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.08, ease: "easeIn" }}
            />
            {/* Bottom Shutter Curtain */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-zinc-950 border-t border-amber-500/40 z-30 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.08, ease: "easeIn" }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Viewfinder UI HUD */}
      {phase !== "flash" && phase !== "fadeout" && (
        <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8 pointer-events-none">

          {/* Main Viewfinder Frame Container (Defined exactly by the 4 Corner Lines) */}
          <div className="relative w-full max-w-5xl h-[82vh] max-h-[680px] sm:max-h-[740px] flex flex-col justify-between p-3 sm:p-5 pointer-events-none select-none">

            {/* The 4 Viewfinder Corner Framing Brackets */}
            <div className="absolute top-0 left-0 w-7 h-7 sm:w-11 sm:h-11 border-l-2 border-t-2 border-white/90 rounded-tl-xs pointer-events-none" />
            <div className="absolute top-0 right-0 w-7 h-7 sm:w-11 sm:h-11 border-r-2 border-t-2 border-white/90 rounded-tr-xs pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-7 h-7 sm:w-11 sm:h-11 border-l-2 border-b-2 border-white/90 rounded-bl-xs pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-11 sm:h-11 border-r-2 border-b-2 border-white/90 rounded-br-xs pointer-events-none" />

            {/* Rule of Thirds Viewfinder Grid (Bounded precisely inside the 4 corner lines) */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-r border-b border-dashed border-white/40" />
              <div className="border-b border-dashed border-white/40" />
              <div className="border-r border-dashed border-white/40" />
              <div className="border-r border-dashed border-white/40" />
              <div />
            </div>

            {/* Top HUD Telemetry Bar (Inside the Top Corner Lines) */}
            <div className="relative z-10 w-full px-2 sm:px-4 pt-1 flex justify-between items-center font-canon-osd text-[11px] text-white/85 select-none">
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Canon Shooting Mode */}
                <span className="px-1.5 py-0.5 rounded-xs bg-white/10 border border-white/30 text-white font-bold text-[10px] tracking-wider">
                  M
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-bold text-[10px]">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  REC
                </span>
                <span className="hidden sm:inline text-white/60">AWB</span>
                <span className="text-white/30 hidden sm:inline">|</span>
                <span className="text-amber-300">RAW+L</span>
                <span className="text-white/30 hidden md:inline">|</span>
                <span className="hidden md:inline text-emerald-400 font-semibold">ONE SHOT</span>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-white/70">
                  ISO <span className="font-canon-segment text-amber-300 font-bold text-xs tracking-wider">400</span>
                </span>
                <span className="text-white/30">|</span>
                {/* Canon Battery Indicator */}
                <div className="flex items-center gap-1.5 font-canon-osd text-[10px]">
                  <span className="border border-white/70 px-1 py-0.5 rounded-2xs flex items-center gap-0.5">
                    <span className="w-1.5 h-2.5 bg-emerald-400 rounded-3xs" />
                    <span className="w-1.5 h-2.5 bg-emerald-400 rounded-3xs" />
                    <span className="w-1.5 h-2.5 bg-emerald-400 rounded-3xs" />
                    <span className="w-1.5 h-2.5 bg-white/20 rounded-3xs" />
                  </span>
                  <span className="text-white/60 hidden sm:inline">84%</span>
                </div>
              </div>
            </div>

            {/* Center Dynamic AF Reticle Target (Centered precisely inside the 4 corners) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                className="relative w-20 h-20 sm:w-24 sm:h-24"
                animate={
                  isFocused
                    ? { scale: [1.1, 0.92], opacity: 1 }
                    : { scale: [1, 1.04, 1], opacity: 0.65 }
                }
                transition={
                  isFocused
                    ? { duration: 0.18, ease: "easeOut" }
                    : { repeat: Infinity, duration: 1.2, ease: "easeInOut" }
                }
              >
                {/* Corner focus brackets */}
                <div className={`absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 transition-colors duration-150 ${isFocused ? "border-emerald-400" : "border-white/80"}`} />
                <div className={`absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 transition-colors duration-150 ${isFocused ? "border-emerald-400" : "border-white/80"}`} />
                <div className={`absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 transition-colors duration-150 ${isFocused ? "border-emerald-400" : "border-white/80"}`} />
                <div className={`absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 transition-colors duration-150 ${isFocused ? "border-emerald-400" : "border-white/80"}`} />

                {/* Center Crosshair and Reticle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full border transition-all duration-150 ${isFocused ? "border-emerald-400 bg-emerald-400/20 scale-110" : "border-white/50"}`} />
                </div>

                {/* Focus Lock Pill */}
                {isFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/60 font-canon-osd text-[10px] text-emerald-300 font-bold tracking-wider uppercase whitespace-nowrap shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                  >
                    SERVO AF LOCKED
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Bottom HUD Telemetry Bar (Inside the Bottom Corner Lines) */}
            <div className="relative z-10 w-full px-2 sm:px-4 pb-1 flex justify-between items-center font-canon-osd text-[12px] text-white/85 select-none bg-black/40 backdrop-blur-xs py-2 border-t border-white/10 rounded-b-xs">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Shutter Speed */}
                <div className="flex items-baseline gap-1">
                  <span className="text-white/40 text-[9px]">SEC</span>
                  <span className="font-canon-segment text-sky-300 font-bold text-sm tracking-wider">1/250</span>
                </div>
                <span className="text-white/20">|</span>
                {/* Aperture */}
                <div className="flex items-baseline gap-1">
                  <span className="text-amber-400/60 text-[10px]">F</span>
                  <span className="font-canon-segment text-amber-300 font-bold text-sm tracking-wider">1.8</span>
                </div>
                <span className="text-white/20 hidden sm:inline">|</span>
                {/* Canon Exposure Level Scale (-2..-1..0..+1..+2) */}
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-white/60 font-canon-osd">
                  <span className="text-white/30 text-[9px] mr-1">EXP</span>
                  <span>-2</span>
                  <span className="text-white/20">•</span>
                  <span>-1</span>
                  <span className="text-white/20">•</span>
                  <span className="text-emerald-400 font-bold bg-emerald-400/20 px-1 rounded-2xs">0</span>
                  <span className="text-white/20">•</span>
                  <span>+1</span>
                  <span className="text-white/20">•</span>
                  <span>+2</span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-white/50 hidden sm:inline">{timeStr}</span>
                <span className="text-white/20 hidden sm:inline">|</span>
                {/* Remaining Exposures in Canon [ 001 ] format */}
                <div className="flex items-baseline gap-1 text-violet-300">
                  <span className="text-white/40 text-[9px]">REMAIN</span>
                  <span>[</span>
                  <span className="font-canon-segment text-violet-200 font-bold text-xs tracking-wider">{frameStr}</span>
                  <span>]</span>
                </div>
              </div>
            </div>

            {/* Click to Capture Hint (Positioned cleanly relative to the viewfinder frame) */}
            <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-canon-osd text-white/45 tracking-[0.25em] uppercase pointer-events-none whitespace-nowrap">
              Click anywhere to release shutter
            </div>

          </div>

        </div>
      )}
    </motion.div>
  );
};

export default CameraTransition;
