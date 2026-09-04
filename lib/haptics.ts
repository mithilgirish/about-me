import { WebHaptics, HapticInput } from 'web-haptics';

let hapticsInstance: WebHaptics | null = null;

export function getHaptics(): WebHaptics | null {
  if (typeof window === 'undefined') return null;
  if (!hapticsInstance) {
    try {
      hapticsInstance = new WebHaptics({ debug: false, showSwitch: false });
    } catch {
      // Graceful fallback if WebHaptics cannot be initialized
    }
  }
  return hapticsInstance;
}

export function triggerHaptic(preset: HapticInput = 'selection') {
  if (typeof window === 'undefined') return;
  try {
    const haptics = getHaptics();
    if (haptics) {
      haptics.trigger(preset).catch(() => {});
    }
  } catch {
    // Gracefully ignore errors
  }
}
