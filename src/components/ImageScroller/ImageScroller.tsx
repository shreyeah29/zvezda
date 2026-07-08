"use client";

import { useScroller } from "@/hooks/useScroller";
import { ScrollerImage } from "@/components/ImageScroller/ScrollerImage";
import { ProgressIndicator } from "@/components/ImageScroller/ProgressIndicator";

type ImageScrollerProps = {
  className?: string;
};

/** Full-screen pinned video scroller with side thumbnail string */
export function ImageScroller({ className = "" }: ImageScrollerProps) {
  const {
    containerRef,
    stickyRef,
    items,
    activeIndex,
    exactIndex,
    progress,
    scrollHeightVh,
    getItemState,
  } = useScroller();

  if (items.length === 0) return null;

  return (
    <section
      ref={containerRef}
      data-scroller-container
      className={`relative bg-ink ${className}`}
      style={{ height: `${scrollHeightVh}vh` }}
      aria-label="Collection video scroller"
    >
      <div ref={stickyRef} className="relative h-screen w-full overflow-hidden bg-ink">
        {/* Full-screen video stack */}
        <div className="absolute inset-0">
          {items.map((item, index) => {
            const visualState = getItemState(index);
            const shouldPreload = Math.abs(index - activeIndex) <= 2;

            return (
              <ScrollerImage
                key={item.id}
                item={item}
                visualState={visualState}
                shouldPreload={shouldPreload}
              />
            );
          })}
        </div>

        <ProgressIndicator
          items={items}
          activeIndex={activeIndex}
          exactIndex={exactIndex}
          progress={progress}
        />
      </div>
    </section>
  );
}

export default ImageScroller;
