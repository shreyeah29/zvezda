type EditorialPanels = {
  active: HTMLElement;
  inactive: HTMLElement;
  numberActive: HTMLElement;
  numberInactive: HTMLElement;
};

export type CollectionTransitionOptions = {
  images: HTMLElement[];
  fromIndex: number;
  toIndex: number;
  direction: "next" | "prev";
  editorial: EditorialPanels;
  progressBar: HTMLElement;
  onComplete: () => void;
};

async function loadGsap() {
  const { gsap } = await import("gsap");
  return gsap;
}

export async function animateCollectionTransition({
  images,
  fromIndex,
  toIndex,
  direction,
  editorial,
  progressBar,
  onComplete,
}: CollectionTransitionOptions) {
  const gsap = await loadGsap();
  const fromImg = images[fromIndex];
  const toImg = images[toIndex];

  if (!fromImg || !toImg) {
    onComplete();
    return null;
  }

  const outRotate = direction === "next" ? -1.75 : 1.75;
  const outX = direction === "next" ? -56 : 56;
  const outY = direction === "next" ? -36 : 36;

  gsap.set(toImg, {
    opacity: 0,
    scale: 1.08,
    y: 32,
    x: 0,
    rotate: 0,
    filter: "blur(8px)",
    transformOrigin: "center center",
    zIndex: 2,
    pointerEvents: "none",
  });
  gsap.set(fromImg, { zIndex: 1, pointerEvents: "none" });

  const progress = (toIndex + 1) / images.length;

  const tl = gsap.timeline({
    defaults: { ease: "power3.inOut" },
    onComplete: () => {
      gsap.set(toImg, { zIndex: 1, pointerEvents: "auto" });
      gsap.set(fromImg, { zIndex: 0, opacity: 0, scale: 1, rotate: 0, x: 0, y: 0, filter: "blur(0px)" });
      onComplete();
    },
  });

  tl.to(
    fromImg,
    {
      opacity: 0,
      scale: 0.93,
      rotate: outRotate,
      filter: "blur(6px)",
      x: outX,
      y: outY,
      duration: 1.1,
    },
    0
  ).to(
    toImg,
    {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
      duration: 1.25,
      ease: "power3.out",
    },
    0.08
  );

  tl.to(
    editorial.active,
    {
      y: -40,
      opacity: 0,
      duration: 0.58,
      ease: "power2.in",
    },
    0
  )
    .fromTo(
      editorial.inactive,
      { y: 52, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "power3.out" },
      0.34
    )
    .to(
      editorial.numberActive,
      {
        y: -18,
        opacity: 0,
        duration: 0.45,
        ease: "power2.in",
      },
      0
    )
    .fromTo(
      editorial.numberInactive,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
      0.28
    )
    .to(
      progressBar,
      {
        scaleX: progress,
        duration: 1.05,
        ease: "power2.inOut",
        transformOrigin: "left center",
      },
      0.12
    );

  return tl;
}

export async function setInitialCollectionState(
  images: HTMLElement[],
  activeIndex: number,
  progressBar: HTMLElement
) {
  const gsap = await loadGsap();

  images.forEach((image, index) => {
    gsap.set(image, {
      opacity: index === activeIndex ? 1 : 0,
      scale: 1,
      x: 0,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      zIndex: index === activeIndex ? 1 : 0,
      transformOrigin: "center center",
    });
  });

  gsap.set(progressBar, {
    scaleX: (activeIndex + 1) / images.length,
    transformOrigin: "left center",
  });
}
