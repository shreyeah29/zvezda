"use client";

import { useEffect, useRef } from "react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSource = useVideoFile ? videoFile : videoUrl;

  const fontFamily = font?.fontFamily || "Inter, sans-serif";
  const fontWeight = font?.fontWeight || 700;
  const fontStyle = font?.fontStyle || "normal";
  const letterSpacing = font?.letterSpacing || "-0.02em";
  const lineHeight = Number.parseFloat(font?.lineHeight || "0.85") || 0.85;

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let frameId = 0;
    let width = 0;
    let height = 0;
    const lines = text.split("\n");

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawTextMask = () => {
      const fontSize = computeDisplayFontSize();
      const lineHeightPx = fontSize * lineHeight;
      const blockHeight = lineHeightPx * lines.length;
      const x = textAlign === "left" ? 48 : width / 2;
      const startY = height / 2 - blockHeight / 2 + fontSize * 0.85;

      context.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
      context.textAlign = textAlign === "left" ? "left" : "center";
      context.textBaseline = "alphabetic";
      context.fillStyle = "#fff";

      lines.forEach((line, index) => {
        context.fillText(line, x, startY + index * lineHeightPx);
      });
    };

    const drawVideoCover = () => {
      const videoWidth = video.videoWidth || width;
      const videoHeight = video.videoHeight || height;
      const scale = Math.max(width / videoWidth, height / videoHeight);
      const drawWidth = videoWidth * scale;
      const drawHeight = videoHeight * scale;
      const dx = (width - drawWidth) / 2;
      const dy = (height - drawHeight) / 2;

      context.drawImage(video, dx, dy, drawWidth, drawHeight);
    };

    const draw = () => {
      context.globalCompositeOperation = "source-over";
      context.clearRect(0, 0, width, height);

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        drawVideoCover();
        context.globalCompositeOperation = "destination-in";
        drawTextMask();
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
      } else {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, width, height);
        drawTextMask();
      }

      frameId = requestAnimationFrame(draw);
    };

    resize();
    void video.play().catch(() => undefined);
    frameId = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, [backgroundColor, fontFamily, fontStyle, fontWeight, lineHeight, text, textAlign]);

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
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <video
        ref={videoRef}
        src={videoSource}
        autoPlay={autoplay}
        loop={loop}
        muted={muted}
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
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
