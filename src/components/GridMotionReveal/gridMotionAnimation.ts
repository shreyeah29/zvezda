/* eslint-disable @typescript-eslint/no-explicit-any */
import { animate, cubicBezier, scroll } from "motion";
import { getLenisInstance } from "@/lib/lenisInstance";

type GridMotionAnimationTargets = {
  image: HTMLImageElement;
  firstSection: HTMLElement;
  layers: HTMLDivElement[];
  naturalWidth: number;
  naturalHeight: number;
};

export function initGridMotionAnimation({
  image,
  firstSection,
  layers,
  naturalWidth,
  naturalHeight,
}: GridMotionAnimationTargets): () => void {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Start fullscreen before scroll animation attaches.
  image.style.width = `${viewportWidth}px`;
  image.style.height = `${viewportHeight}px`;

  const cleanups: Array<() => void> = [];

  cleanups.push(
    scroll(
      animate(
        image,
        {
          width: [viewportWidth, naturalWidth],
          height: [viewportHeight, naturalHeight],
        },
        {
          width: { easing: cubicBezier(0.65, 0, 0.35, 1) },
          height: { easing: cubicBezier(0.42, 0, 0.58, 1) },
        } as any
      ),
      {
        target: firstSection,
        offset: ["start start", "80% end end"],
      } as any
    )
  );

  const scaleEasings = [
    cubicBezier(0.42, 0, 0.58, 1),
    cubicBezier(0.76, 0, 0.24, 1),
    cubicBezier(0.87, 0, 0.13, 1),
  ];

  layers.forEach((layer, index) => {
    const endOffset = `${1 - index * 0.05} end`;

    cleanups.push(
      scroll(
        animate(
          layer,
          { opacity: [0, 0, 1] },
          {
            offset: [0, 0.55, 1],
            easing: cubicBezier(0.61, 1, 0.88, 1),
          } as any
        ),
        {
          target: firstSection,
          offset: ["start start", endOffset],
        } as any
      )
    );

    cleanups.push(
      scroll(
        animate(
          layer,
          { scale: [0, 0, 1] },
          {
            offset: [0, 0.3, 1],
            easing: scaleEasings[index],
          } as any
        ),
        {
          target: firstSection,
          offset: ["start start", endOffset],
        } as any
      )
    );
  });

  window.dispatchEvent(new Event("scroll"));
  getLenisInstance()?.resize();

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export async function prepareScalerImage(image: HTMLImageElement): Promise<void> {
  if (!image.complete) {
    await new Promise<void>((resolve) => {
      image.addEventListener("load", () => resolve(), { once: true });
      image.addEventListener("error", () => resolve(), { once: true });
    });
  }

  if (image.decode) {
    try {
      await image.decode();
    } catch {
      // Ignore decode errors — continue with loaded image.
    }
  }
}

export function measureScalerNaturalSize(image: HTMLImageElement) {
  const previousWidth = image.style.width;
  const previousHeight = image.style.height;

  image.style.width = "100%";
  image.style.height = "100%";

  const width = image.offsetWidth;
  const height = image.offsetHeight;

  image.style.width = previousWidth;
  image.style.height = previousHeight;

  return { width, height };
}
