"use client";

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from "react";
import "./CurvedLoop.css";

type CurvedLoopProps = {
  marqueeText?: string;
  speed?: number;
  className?: string;
  curveAmount?: number;
  direction?: "left" | "right";
  interactive?: boolean;
};

export default function CurvedLoop({
  marqueeText = "",
  speed = 2,
  className,
  curveAmount = 400,
  direction = "left",
  interactive = true,
}: CurvedLoopProps) {
  const text = useMemo(() => {
    const hasTrailing = /\s|\u00A0$/.test(marqueeText);
    return (hasTrailing ? marqueeText.replace(/\s+$/, "") : marqueeText) + "\u00A0";
  }, [marqueeText]);

  const measureRef = useRef<SVGTextElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [spacing, setSpacing] = useState(0);
  const [offset, setOffset] = useState(0);
  const uid = useId();
  const pathId = `curve-${uid.replace(/:/g, "")}`;
  const pathD = `M-100,40 Q500,${40 + curveAmount} 1540,40`;

  const dragRef = useRef(false);
  const lastXRef = useRef(0);
  const dirRef = useRef(direction);
  const velRef = useRef(0);

  const textLength = spacing;
  const totalText = textLength
    ? Array(Math.ceil(1800 / textLength) + 2)
        .fill(text)
        .join("")
    : text;
  const ready = spacing > 0;

  useEffect(() => {
    if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength());
  }, [text, className]);

  useEffect(() => {
    if (!spacing) return;
    if (textPathRef.current) {
      const initial = -spacing;
      textPathRef.current.setAttribute("startOffset", `${initial}px`);
      setOffset(initial);
    }
  }, [spacing]);

  useEffect(() => {
    dirRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (!spacing || !ready) return;

    let frame = 0;
    const step = () => {
      if (!dragRef.current && textPathRef.current) {
        const delta = dirRef.current === "right" ? speed : -speed;
        const currentOffset = Number.parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
        let newOffset = currentOffset + delta;

        const wrapPoint = spacing;
        if (newOffset <= -wrapPoint) newOffset += wrapPoint;
        if (newOffset > 0) newOffset -= wrapPoint;

        textPathRef.current.setAttribute("startOffset", `${newOffset}px`);
        setOffset(newOffset);
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [spacing, speed, ready]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive) return;
    dragRef.current = true;
    lastXRef.current = event.clientX;
    velRef.current = 0;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || !dragRef.current || !textPathRef.current) return;

    const dx = event.clientX - lastXRef.current;
    lastXRef.current = event.clientX;
    velRef.current = dx;

    const currentOffset = Number.parseFloat(textPathRef.current.getAttribute("startOffset") || "0");
    let newOffset = currentOffset + dx;

    const wrapPoint = spacing;
    if (newOffset <= -wrapPoint) newOffset += wrapPoint;
    if (newOffset > 0) newOffset -= wrapPoint;

    textPathRef.current.setAttribute("startOffset", `${newOffset}px`);
    setOffset(newOffset);
  };

  const endDrag = () => {
    if (!interactive) return;
    dragRef.current = false;
    dirRef.current = velRef.current > 0 ? "right" : "left";
  };

  const cursorStyle = interactive ? (dragRef.current ? "grabbing" : "grab") : "auto";

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: ready ? "visible" : "hidden", cursor: cursorStyle }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120" aria-hidden="true">
        <text ref={measureRef} xmlSpace="preserve" style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}>
          {text}
        </text>
        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
        </defs>
        {ready && (
          <text fontWeight="bold" xmlSpace="preserve" className={className}>
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${offset}px`} xmlSpace="preserve">
              {totalText}
            </textPath>
          </text>
        )}
      </svg>
      <span
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {marqueeText}
      </span>
    </div>
  );
}
