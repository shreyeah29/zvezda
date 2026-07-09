export function TornPaperEdge({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 88"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id="torn-paper-shadow" x="-20%" y="-80%" width="140%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.35" />
        </filter>
      </defs>
      <path
        filter="url(#torn-paper-shadow)"
        fill="#070707"
        d="M0,0 H1440 V52
          C1380,68 1320,42 1260,58
          C1200,74 1140,38 1080,54
          C1020,70 960,44 900,60
          C840,76 780,40 720,56
          C660,72 600,46 540,62
          C480,78 420,42 360,58
          C300,74 240,48 180,64
          C120,80 60,44 0,60
          Z"
      />
    </svg>
  );
}
