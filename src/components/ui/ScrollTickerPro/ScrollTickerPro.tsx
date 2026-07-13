"use client";

import { ScrollTicker } from "@/components/ui/ScrollTicker";
import "./ScrollTickerPro.css";

export type TickerBand = {
  id: string;
  label: string;
  color: string;
  direction?: "left" | "right";
  speed?: number;
};

type ScrollTickerProProps = {
  bands?: TickerBand[];
  className?: string;
};

const DEFAULT_BANDS: TickerBand[] = [
  {
    id: "pink",
    label: "Follow Our Journey",
    color: "#f3c5bc",
    direction: "left",
    speed: 55,
  },
  {
    id: "blue",
    label: "ZVEZDA Atelier",
    color: "#b7d4ef",
    direction: "right",
    speed: 48,
  },
  {
    id: "lilac",
    label: "On Instagram",
    color: "#c9c4ea",
    direction: "left",
    speed: 62,
  },
];

function TickerIcon({ variant }: { variant: number }) {
  return (
    <span className="stp-icon" aria-hidden="true">
      <svg viewBox="0 0 40 40" className="stp-icon__svg">
        {variant % 3 === 0 && (
          <>
            <circle cx="20" cy="20" r="18" fill="#ffffff" />
            <ellipse cx="20" cy="23" rx="8" ry="7" fill="#f6d2cb" />
            <path
              d="M14 18c1.8-4.5 3.8-6.8 6-6.8s4.2 2.3 6 6.8"
              stroke="#111"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            <circle cx="20" cy="12" r="1.6" fill="#111" />
          </>
        )}
        {variant % 3 === 1 && (
          <>
            <circle cx="20" cy="20" r="18" fill="#ffffff" />
            <path
              d="M13 26V14.5c0-1 0.8-1.8 1.8-1.8h10.4c1 0 1.8.8 1.8 1.8V26"
              fill="#cfe0f4"
              stroke="#111"
              strokeWidth="1.2"
            />
            <path d="M16 18h8M16 21.5h8M16 25h5" stroke="#111" strokeWidth="1.2" strokeLinecap="round" />
          </>
        )}
        {variant % 3 === 2 && (
          <>
            <circle cx="20" cy="20" r="18" fill="#ffffff" />
            <path
              d="M20 11l2.2 5.8 6.2.3-4.8 3.9 1.6 6L20 23.8 14.8 27l1.6-6-4.8-3.9 6.2-.3L20 11Z"
              fill="#d5d1f0"
              stroke="#111"
              strokeWidth="1"
            />
          </>
        )}
      </svg>
    </span>
  );
}

function BandContent({ label, copies = 6 }: { label: string; copies?: number }) {
  return (
    <>
      {Array.from({ length: copies }, (_, i) => (
        <span key={`${label}-${i}`} className="stp-item">
          <span className="stp-item__text">{label}</span>
          <TickerIcon variant={i} />
        </span>
      ))}
    </>
  );
}

export function ScrollTickerPro({ bands = DEFAULT_BANDS, className }: ScrollTickerProProps) {
  return (
    <div className={className ? `stp ${className}` : "stp"} aria-hidden="true">
      <div className="stp__stage">
        {bands.map((band, index) => (
          <div
            key={band.id}
            className={`stp__band stp__band--${index + 1}`}
            style={{ backgroundColor: band.color }}
          >
            <ScrollTicker
              className="stp__ticker"
              baseSpeed={band.speed ?? 55}
              gap={22}
              boostIntensity={1.4}
              initialDirection={band.direction ?? (index % 2 === 0 ? "left" : "right")}
            >
              <BandContent label={band.label} />
            </ScrollTicker>
          </div>
        ))}
      </div>
    </div>
  );
}
