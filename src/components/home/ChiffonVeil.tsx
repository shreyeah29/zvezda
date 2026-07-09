type ChiffonLayerProps = {
  variant: "a" | "b" | "c";
  className?: string;
};

const WAVE_PATHS: Record<ChiffonLayerProps["variant"], string> = {
  a: "M0,150 C180,66 360,214 540,138 C760,44 900,224 1140,128 C1290,74 1380,158 1440,116 L1440,1200 L0,1200 Z",
  b: "M0,118 C220,206 420,62 620,150 C820,236 1020,74 1220,160 C1330,204 1400,128 1440,150 L1440,1200 L0,1200 Z",
  c: "M0,172 C160,96 380,192 600,118 C820,42 1040,182 1260,118 C1360,84 1420,150 1440,128 L1440,1200 L0,1200 Z",
};

/**
 * A single translucent sheet of couture chiffon rendered as SVG.
 * Gradient ids are suffixed per-variant so stacked instances don't collide.
 */
export function ChiffonVeil({ variant, className = "" }: ChiffonLayerProps) {
  const fill = `chiffon-fill-${variant}`;
  const sheen = `chiffon-sheen-${variant}`;
  const shadow = `chiffon-shadow-${variant}`;
  const glow = `chiffon-glow-${variant}`;

  return (
    <svg
      className={className}
      viewBox="0 0 1440 1200"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={fill} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fdfcfa" stopOpacity="0.08" />
          <stop offset="30%" stopColor="#f7f5f2" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#f4f1ec" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#f1ede6" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="0.85">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="78%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <linearGradient id={shadow} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b7ada0" stopOpacity="0.28" />
          <stop offset="18%" stopColor="#b7ada0" stopOpacity="0" />
        </linearGradient>

        <radialGradient id={glow} cx="0.5" cy="0.18" r="0.75">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Base fabric with soft wavy top hem */}
      <path d={WAVE_PATHS[variant]} fill={`url(#${fill})`} />
      {/* Soft shadow just under the hem for depth */}
      <path d={WAVE_PATHS[variant]} fill={`url(#${shadow})`} />
      {/* Diagonal satin sheen sweeping across the body */}
      <rect x="0" y="120" width="1440" height="1080" fill={`url(#${sheen})`} />
      {/* Delicate highlight bloom near the upper folds */}
      <ellipse cx="720" cy="230" rx="900" ry="240" fill={`url(#${glow})`} />
    </svg>
  );
}
