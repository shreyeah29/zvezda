"use client";

import { useId } from "react";

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
  const fontSize = font?.fontSize || "48px";
  const fontFamily = font?.fontFamily || "Inter, sans-serif";
  const fontWeight = font?.fontWeight || 700;
  const fontStyle = font?.fontStyle || "normal";
  const letterSpacing = font?.letterSpacing || "-0.02em";
  const lineHeight = Number.parseFloat(font?.lineHeight || "0.9") || 0.9;

  const anchor = textAlign === "left" ? "start" : "middle";
  const x = textAlign === "left" ? "48px" : "50%";

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: textAlign === "left" ? "flex-start" : "center",
      }}
    >
      <svg
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="black" />
            <text
              x={x}
              y="50%"
              textAnchor={anchor}
              dominantBaseline="middle"
              fill="white"
              style={{
                fontSize,
                fontFamily,
                fontWeight,
                fontStyle,
                letterSpacing,
              }}
            >
              {lines.map((line, index) => {
                const offset = (index - (lines.length - 1) / 2) * lineHeight;
                return (
                  <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? `${offset}em` : `${lineHeight}em`}>
                    {line}
                  </tspan>
                );
              })}
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
          top: 0,
          left: 0,
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
