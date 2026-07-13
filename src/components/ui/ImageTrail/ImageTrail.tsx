import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import "./ImageTrail.css";

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(
  e: MouseEvent | TouchEvent,
  rect: DOMRect,
) {
  let clientX = 0;
  let clientY = 0;
  if ("touches" in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ("clientX" in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function getMouseDistance(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.hypot(dx, dy);
}

type ListenerEntry = [HTMLElement, string, EventListener];

type TrailLifecycle = {
  destroyed: boolean;
  rafId: number;
  _listeners: ListenerEntry[];
  addListener: (el: HTMLElement, type: string, fn: EventListener) => void;
  destroy: () => void;
  scheduleRender: (fn: () => void) => void;
};

function attachTrailLifecycle(
  instance: TrailLifecycle & { images?: ImageItem[] },
) {
  instance.destroyed = false;
  instance.rafId = 0;
  instance._listeners = [];

  instance.addListener = (el, type, fn) => {
    el.addEventListener(type, fn);
    instance._listeners.push([el, type, fn]);
  };

  instance.destroy = () => {
    instance.destroyed = true;
    cancelAnimationFrame(instance.rafId);
    instance._listeners.forEach(([el, type, fn]) =>
      el.removeEventListener(type, fn),
    );
    instance.images?.forEach((img) => {
      if (img.resize) window.removeEventListener("resize", img.resize);
    });
  };

  instance.scheduleRender = (fn) => {
    if (instance.destroyed) return;
    instance.rafId = requestAnimationFrame(fn);
  };
}

class ImageItem {
  DOM: { el: HTMLElement; inner: HTMLElement | null };
  defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
  rect: DOMRect | null = null;
  resize: (() => void) | null = null;

  constructor(DOM_el: HTMLElement) {
    this.DOM = {
      el: DOM_el,
      inner: DOM_el.querySelector(".content__img-inner"),
    };
    this.getRect();
    this.initEvents();
  }

  initEvents() {
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener("resize", this.resize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }
}

class ImageTrailVariant5 implements TrailLifecycle {
  container: HTMLElement;
  eventTarget: HTMLElement;
  DOM: { el: HTMLElement };
  images: ImageItem[];
  imagesTotal: number;
  imgPosition: number;
  zIndexVal: number;
  activeImagesCount: number;
  isIdle: boolean;
  threshold: number;
  mousePos: { x: number; y: number };
  lastMousePos: { x: number; y: number };
  cacheMousePos: { x: number; y: number };
  lastAngle: number;
  destroyed = false;
  rafId = 0;
  _listeners: ListenerEntry[] = [];
  addListener!: TrailLifecycle["addListener"];
  destroy!: TrailLifecycle["destroy"];
  scheduleRender!: TrailLifecycle["scheduleRender"];

  constructor(container: HTMLElement, eventTarget: HTMLElement = container) {
    attachTrailLifecycle(this);
    this.container = container;
    this.eventTarget = eventTarget;
    this.DOM = { el: container };
    this.images = [...container.querySelectorAll(".content__img")].map(
      (img) => new ImageItem(img as HTMLElement),
    );
    this.imagesTotal = this.images.length;
    this.imgPosition = 0;
    this.zIndexVal = 1;
    this.activeImagesCount = 0;
    this.isIdle = true;
    this.threshold = 80;
    this.mousePos = { x: 0, y: 0 };
    this.lastMousePos = { x: 0, y: 0 };
    this.cacheMousePos = { x: 0, y: 0 };
    this.lastAngle = 0;

    const handlePointerMove = (ev: Event) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(
        ev as MouseEvent | TouchEvent,
        rect,
      );
    };

    this.addListener(this.eventTarget, "mousemove", handlePointerMove);
    this.addListener(this.eventTarget, "touchmove", handlePointerMove);

    const initRender = (ev: Event) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev as MouseEvent | TouchEvent, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.scheduleRender(() => this.render());
      this.eventTarget.removeEventListener("mousemove", initRender);
      this.eventTarget.removeEventListener("touchmove", initRender);
    };

    this.addListener(this.eventTarget, "mousemove", initRender);
    this.addListener(this.eventTarget, "touchmove", initRender);
  }

  render() {
    if (this.destroyed) return;

    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, 0.1);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, 0.1);
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.scheduleRender(() => this.render());
  }

  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    const startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 150;
    dy *= distance / 150;

    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    if (!img.rect) return;

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          filter: "brightness(80%)",
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
          rotation: startAngle,
        },
        {
          duration: 1,
          ease: "power2",
          scale: 1,
          filter: "brightness(100%)",
          x: this.mousePos.x - img.rect.width / 2 + dx * 70,
          y: this.mousePos.y - img.rect.height / 2 + dy * 70,
          rotation: this.lastAngle,
        },
        0,
      )
      .to(
        img.DOM.el,
        {
          duration: 0.4,
          ease: "expo",
          opacity: 0,
        },
        0.5,
      )
      .to(
        img.DOM.el,
        {
          duration: 1.5,
          ease: "power4",
          x: `+=${dx * 120}`,
          y: `+=${dy * 120}`,
        },
        0.05,
      );
  }

  onImageActivated() {
    this.activeImagesCount++;
    this.isIdle = false;
  }

  onImageDeactivated() {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) this.isIdle = true;
  }
}

const variantMap: Record<number, typeof ImageTrailVariant5> = {
  5: ImageTrailVariant5,
};

export type ImageTrailProps = {
  items?: string[];
  variant?: number;
  eventTargetRef?: RefObject<HTMLElement | null>;
  className?: string;
};

export default function ImageTrail({
  items = [],
  variant = 5,
  eventTargetRef,
  className,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const eventTarget = eventTargetRef?.current ?? container;
    const Cls = variantMap[variant] ?? variantMap[5];
    const instance = new Cls(container, eventTarget);

    return () => {
      instance.destroy();
    };
  }, [variant, items, eventTargetRef]);

  if (items.length === 0) return null;

  return (
    <div
      className={className ? `content ${className}` : "content"}
      ref={containerRef}
      aria-hidden="true"
    >
      {items.map((url, i) => (
        <div className="content__img" key={`${url}-${i}`}>
          <div
            className="content__img-inner"
            style={{ backgroundImage: `url(${url})` }}
          />
        </div>
      ))}
    </div>
  );
}
