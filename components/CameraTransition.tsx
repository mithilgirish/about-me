"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CameraTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
  frameCount?: number;
}

const CameraTransition: React.FC<CameraTransitionProps> = ({
  isActive,
  onComplete,
  frameCount = 1,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [phase, setPhase] = useState<"viewfinder" | "focus" | "shutter" | "flash" | "fadeout" | "done">("viewfinder");
  const [dateTime, setDateTime] = useState({ dateStr: "26.07.31", timeStr: "12:00" });

  useEffect(() => {
    setIsMounted(true);
    const now = new Date();
    setDateTime({
      dateStr: `${String(now.getFullYear()).slice(2)}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,
      timeStr: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    });
  }, []);

  useEffect(() => {
    if (!isActive) {
      setPhase("done");
      return;
    }

    setPhase("viewfinder");

    // Sequence timer pipeline:
    // 0ms: Viewfinder (dark)
    // 500ms: Focus lock (blue)
    // 850ms: Shutter click
    // 1000ms: Flash (white burst)
    // 1200ms: Fade out to transparent
    // 1500ms: Complete and unmount completely
    const t1 = setTimeout(() => setPhase("focus"), 500);
    const t2 = setTimeout(() => setPhase("shutter"), 850);
    const t3 = setTimeout(() => setPhase("flash"), 1000);
    const t4 = setTimeout(() => setPhase("fadeout"), 1200);
    const t5 = setTimeout(() => {
      setPhase("done");
      onComplete?.();
    }, 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isActive, onComplete]);

  if (!isMounted || phase === "done" || !isActive) return null;

  const { dateStr, timeStr } = dateTime;
  const frameStr = String(frameCount).padStart(3, "0");

  return (
    <motion.div
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden"
      initial={{ opacity: 1 }}
      animate={{ opacity: phase === "fadeout" ? 0 : 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Background overlay */}
      {phase === "flash" ? (
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.5, 0] }}
          transition={{ duration: 0.25 }}
        />
      ) : (
        <div className="absolute inset-0 bg-black/95" />
      )}

      {/* Viewfinder UI HUD (visible before flash) */}
      {phase !== "flash" && phase !== "fadeout" && (
        <div className="absolute inset-0 flex items-center justify-center">

          {/* Viewfinder Corner AF Brackets */}
          <div className="absolute inset-0">
            <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-white/70" />
            <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-white/70" />
            <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-white/70" />
            <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-white/70" />
          </div>

          {/* Center AF Reticle Target */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className="relative w-16 h-16"
              animate={
                phase === "focus" || phase === "shutter"
                  ? { scale: 0.85, opacity: 1 }
                  : { scale: 1, opacity: 0.5 }
              }
              transition={{ duration: 0.25 }}
            >
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-white" />
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-white" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-white" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-white" />

              {(phase === "focus" || phase === "shutter") && (
                <motion.div
                  className="absolute inset-0 border-2 border-cyan-400 rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                />
              )}
            </motion.div>
            <div className="absolute w-1 h-1 bg-white/70 rounded-full" />
          </div>

          {/* Top HUD Telemetry */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-4 font-mono text-xs text-white/70 tracking-widest select-none">
            <span>FLASH</span>
            <span className="text-white/30">|</span>
            <span>AUTO</span>
            <span className="text-white/30">|</span>
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-white/30">|</span>
            <span>{dateStr}</span>
          </div>

          {/* Bottom HUD Telemetry */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 font-mono text-xs text-white/60 tracking-widest select-none">
            <span>{timeStr}</span>
            <span className="text-white/30">|</span>
            <span>F/{frameStr}</span>
            <span className="text-white/30">|</span>
            {phase === "focus" || phase === "shutter" ? (
              <span className="text-cyan-400 font-bold">AF LOCK</span>
            ) : (
              <span className="text-white/30">AF</span>
            )}
            <span className="text-white/30">|</span>
            <span className="text-white/30">1/60</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CameraTransition;
