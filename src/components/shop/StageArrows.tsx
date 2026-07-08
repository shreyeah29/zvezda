"use client";

type StageArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

/** Elegant arrow controls — browse only, no selection */
export function StageArrows({ onPrev, onNext, canPrev, canNext }: StageArrowsProps) {
  const baseClass =
    "editorial-spacing absolute top-1/2 z-40 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-cream/15 bg-black/40 text-[10px] text-cream/60 backdrop-blur-sm transition-all hover:border-cream/35 hover:text-cream active:scale-95 disabled:pointer-events-none disabled:opacity-20 md:min-h-12 md:min-w-12";

  const stopBubble = (e: React.MouseEvent | React.PointerEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <button
        type="button"
        data-gallery-nav
        data-stage-arrow
        onPointerDown={stopBubble}
        onMouseDown={stopBubble}
        onMouseUp={stopBubble}
        onTouchStart={stopBubble}
        onTouchEnd={stopBubble}
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        disabled={!canPrev}
        aria-label="Previous product"
        className={`${baseClass} left-3 md:left-5`}
      >
        ←
      </button>
      <button
        type="button"
        data-gallery-nav
        data-stage-arrow
        onPointerDown={stopBubble}
        onMouseDown={stopBubble}
        onMouseUp={stopBubble}
        onTouchStart={stopBubble}
        onTouchEnd={stopBubble}
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        disabled={!canNext}
        aria-label="Next product"
        className={`${baseClass} right-3 md:right-5`}
      >
        →
      </button>
    </>
  );
}
