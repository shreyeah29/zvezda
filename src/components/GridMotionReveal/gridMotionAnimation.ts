/* eslint-disable @typescript-eslint/no-explicit-any */
import { animate, cubicBezier, scroll } from "motion";

type GridMotionAnimationTargets = {
  image: HTMLImageElement;
  firstSection: HTMLElement;
  layers: HTMLDivElement[];
};

export function initGridMotionAnimation({
  image,
  firstSection,
  layers,
}: GridMotionAnimationTargets): () => void {
  const naturalWidth = image.offsetWidth;
  const naturalHeight = image.offsetHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

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

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
