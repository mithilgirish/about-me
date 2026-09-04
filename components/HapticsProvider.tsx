"use client";

import { useEffect } from "react";
import { triggerHaptic, getHaptics } from "@/lib/haptics";
import type { HapticInput } from "web-haptics";

export default function HapticsProvider() {
  useEffect(() => {
    // Pre-initialize haptics instance on client mount
    getHaptics();

    let lastHapticTime = 0;

    const handlePointerDown = (e: PointerEvent) => {
      // Prioritize touch interactions for mobile haptics
      if (e.pointerType !== "touch" && e.pointerType !== "pen") {
        return;
      }

      const now = Date.now();
      if (now - lastHapticTime < 60) return; // Debounce rapid multi-touch

      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest interactive element
      const interactiveEl = target.closest<HTMLElement>(
        'button, a, [role="button"], [role="tab"], [data-haptic], input[type="submit"], input[type="button"], summary, .cursor-pointer'
      );

      if (!interactiveEl) return;

      lastHapticTime = now;

      // Check if element has an explicit data-haptic override
      const customHaptic = interactiveEl.getAttribute("data-haptic") as HapticInput | null;
      if (customHaptic) {
        triggerHaptic(customHaptic);
      } else {
        triggerHaptic("selection");
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return null;
}
