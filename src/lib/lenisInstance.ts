import type Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function setLenisInstance(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenisInstance() {
  return lenisInstance;
}

export function scrollToPosition(
  target: number,
  options?: { immediate?: boolean; duration?: number }
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      immediate: options?.immediate,
      duration: options?.duration ?? 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    return;
  }

  window.scrollTo({
    top: target,
    behavior: options?.immediate ? "auto" : "smooth",
  });
}
