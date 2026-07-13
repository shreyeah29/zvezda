export type SlideImage = {
  src: string;
  alt: string;
  srcSet?: string;
};

export type SlideVariant = {
  name: string;
  priceChange: number;
  image?: SlideImage;
};

export type SlideItem = {
  image: SlideImage;
  subImages?: SlideImage[];
  productInfo?: {
    title: string;
    description: string;
    price: string;
  };
  variants1?: SlideVariant[];
  variants2?: SlideVariant[];
  buttonLink?: string;
};

export type ProductSlideshowProps = {
  items?: SlideItem[];
  settings?: {
    gap?: number;
    radius?: number;
    background?: string;
    alignmentX?: "flex-start" | "center" | "flex-end";
    alignmentY?: "flex-start" | "center" | "flex-end";
  };
  scaleUp?: {
    maxScale?: number;
    time?: number;
    easing?: string;
    sizeDecrement?: number;
  };
  baseSize?: {
    width?: number;
    height?: number;
  };
  title?: {
    enabled?: boolean;
    text?: string;
    font?: Record<string, string | number>;
    color?: string;
    alignmentX?: "flex-start" | "center" | "flex-end";
    alignmentY?: "flex-start" | "center" | "flex-end";
    fill?: "fit" | "fixed" | "fill" | "relative";
    width?: number;
  };
  subImages?: {
    enabled?: boolean;
    size?: number;
    gap?: number;
    radius?: number;
    position?: "bottom" | "top" | "left" | "right";
    alignmentX?: "flex-start" | "center" | "flex-end";
    alignmentY?: "flex-start" | "center" | "flex-end";
    inactiveOpacity?: number;
  };
  variants?: {
    enabled?: boolean;
    background?: string;
    textColor?: string;
    borderWidth?: number;
    borderColor?: string;
    radius?: number;
    padding?: number;
    gap?: number;
    font?: Record<string, string | number>;
    active?: {
      background?: string;
      textColor?: string;
      borderColor?: string;
    };
    hover?: {
      background?: string;
      textColor?: string;
      borderColor?: string;
      opacity?: number;
      scale?: number;
    };
  };
  description?: {
    text?: {
      titleFont?: Record<string, string | number>;
      titleColor?: string;
      titleAnimation?: "shimmer" | "instant" | "fade" | "moveIn";
      descriptionFont?: Record<string, string | number>;
      descriptionColor?: string;
      priceFont?: Record<string, string | number>;
      priceColor?: string;
      textAlign?: "left" | "center" | "right";
      textOrder?: Array<"title" | "description" | "price" | "variants1" | "variants2">;
    };
    enabled?: boolean;
    position?: "front" | "behind";
    animation?: "instant" | "fade" | "moveIn";
    container?: {
      background?: string;
      padding?: number;
      gap?: number;
      radius?: number;
      fill?: "fit" | "fixed" | "fill" | "relative";
      width?: number;
      borderWidth?: number;
      borderColor?: string;
      borderStyle?: string;
    };
    button?: {
      enabled?: boolean;
      type?: "primary" | "secondary" | "tertiary";
      linkType?: "individual" | "global";
      globalLink?: string;
      label?: string;
      background?: string;
      textColor?: string;
      font?: Record<string, string | number>;
      radius?: number;
      padding?: number;
      fill?: "fit" | "fixed" | "fill";
      width?: number;
      borderWidth?: number;
      borderColor?: string;
      underlineThickness?: number;
      hover?: {
        background?: string;
        textColor?: string;
        opacity?: number;
        scale?: number;
        borderColor?: string;
      };
      icon?: {
        enabled?: boolean;
        svg?: string;
        placement?: "left" | "right";
        size?: number;
        gap?: number;
      };
    };
    alignmentX?: "flex-start" | "center" | "flex-end";
    alignmentY?: "flex-start" | "center" | "flex-end";
  };
  imageFit?: "cover" | "contain";
};
