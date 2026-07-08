"use client";

import { useId, useLayoutEffect, useState } from "react";

type TextVideoMaskFont = {
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number | string;
  fontStyle?: string;
  letterSpacing?: string;
  lineHeight?: string;
};

export type TextVideoMaskProps = {
  useVideoFile?: boolean;
  videoFile?: string;
  videoUrl?: string;
  text?: string;
  font?: TextVideoMaskFont;
  textColor?: string;
  backgroundColor?: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  textAlign?: "left" | "center";
  className?: string;
};

function computeDisplayFontSize() {
  if (typeof window === "undefined") return 120;
  return Math.max(64, Math.min(window.innerWidth * 0.12, 192));
}

export default function TextVideoMask({
  useVideoFile = true,
  videoFile = "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4",
  videoUrl = "https://framerusercontent.com/assets/MLWPbW1dUQawJLhhun3dBwpgJak.mp4",
  text = "VIDEO",
  font,
  backgroundColor = "#000000",
  autoplay = true,
  loop = true,
  muted = true,
  textAlign = "center",
  className,
}: TextVideoMaskProps) {
  const maskId = useId().replace(/:/g, "");
  const videoSource = useVideoFile ? videoFile : videoUrl;
  const lines = text.split("\n");
  const [fontSize, setFontSize] = useState(120);
  const [viewport, setViewport] = useState({ width: 1200, height: 800 });

  useLayoutEffect(() => {
    const update = () => {
      setFontSize(computeDisplayFontSize());
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const fontFamily = font?.fontFamily || "Inter, sans-serif";
  const fontWeight = font?.fontWeight || 700;
  const fontStyle = font?.fontStyle || "normal";
  const letterSpacing = font?.letterSpacing || "-0.02em";
  const lineHeight = Number.parseFloat(font?.lineHeight || "0.85") || 0.85;

  const anchor = textAlign === "left" ? "start" : "middle";
  const x = textAlign === "left" ? 48 : viewport.width / 2;
  const lineHeightPx = fontSize * lineHeight;
  const blockHeight = lineHeightPx * lines.length;
  const startY = viewport.height / 2 - blockHeight / 2 + fontSize * 0.35;

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor,
        overflow: "hidden",
      }}
    >
      <svg
        aria-hidden="true"
        width={viewport.width}
        height={viewport.height}
        viewBox={`0 0 ${viewport.width} ${viewport.height}`}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="100%" height="100%">
            <rect width="100%" height="100%" fill="black" />
            <text
              x={x}
              y={startY}
              textAnchor={anchor}
              fill="white"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily,
                fontWeight,
                fontStyle,
                letterSpacing,
              }}
            >
              {lines.map((line, index) => (
                <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeightPx}>
                  {line}
                </tspan>
              ))}
            </text>
          </mask>
        </defs>
      </svg>
      <video
        src={videoSource}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      />
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
        {text.replace("\n", " ")}
      </span>
    </div>
  );
}
