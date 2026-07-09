export type CollectionGradientPreset = {
  color1: string;
  color2: string;
  color3: string;
  uSpeed?: number;
  uStrength?: number;
  uFrequency?: number;
  brightness?: number;
  cDistance?: number;
  cPolarAngle?: number;
};

export const gradientBase = {
  animate: "on" as const,
  brightness: 1.2,
  cAzimuthAngle: 180,
  cDistance: 2.9,
  cPolarAngle: 120,
  cameraZoom: 1,
  envPreset: "city" as const,
  grain: "off" as const,
  lightType: "3d" as const,
  positionX: 0,
  positionY: 1.8,
  positionZ: 0,
  reflection: 0.1,
  rotationX: 0,
  rotationY: 0,
  rotationZ: -90,
  shader: "defaults",
  type: "waterPlane" as const,
  uAmplitude: 0,
  uDensity: 1,
  uFrequency: 5.5,
  uSpeed: 0.3,
  uStrength: 3,
  uTime: 0.2,
};

export const collectionGradients: Record<string, CollectionGradientPreset> = {
  green: {
    color1: "#2d5a3d",
    color2: "#6b8f71",
    color3: "#b8d4b0",
    uSpeed: 0.28,
    uStrength: 2.8,
  },
  "black-white": {
    color1: "#f5f5f5",
    color2: "#9a9a9a",
    color3: "#141414",
    uSpeed: 0.22,
    uStrength: 2.4,
    brightness: 1.1,
  },
  orange: {
    color1: "#ff9a4d",
    color2: "#c45c28",
    color3: "#3d1a08",
    uSpeed: 0.32,
    uStrength: 3.2,
  },
  "black-pink": {
    color1: "#d48a9a",
    color2: "#3d1828",
    color3: "#120810",
    uSpeed: 0.26,
    uStrength: 2.6,
  },
  red: {
    color1: "#c42a3a",
    color2: "#8b1a2b",
    color3: "#2a080c",
    uSpeed: 0.3,
    uStrength: 3,
  },
  yellow: {
    color1: "#f5d547",
    color2: "#e8b830",
    color3: "#4a3810",
    uSpeed: 0.34,
    uStrength: 3.1,
  },
  peach: {
    color1: "#f0c4a8",
    color2: "#d4a088",
    color3: "#5c3828",
    uSpeed: 0.28,
    uStrength: 2.7,
  },
};
