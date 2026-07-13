"use client";

import { useMemo } from "react";
import { getHomeProductSlideshowItems } from "@/data/homeProductSlideshow";
import { ProductSlideshow } from "./ProductSlideshow";
import "./HomeProductSlideshow.css";

/** Framer Product Slideshow + defaults — full viewport under hero */
const FRAMER_FONT =
  'Inter, "Helvetica Neue", Helvetica, Arial, sans-serif';

export function HomeProductSlideshow() {
  const items = useMemo(() => getHomeProductSlideshowItems(), []);

  return (
    <section className="home-product-slideshow" aria-label="Product slideshow">
      <ProductSlideshow
        items={items}
        imageFit="contain"
        hint={{
          enabled: true,
          text: "CLICK ON THE IMAGES",
          color: "#000000",
          font: {
            fontFamily: FRAMER_FONT,
            fontSize: "11px",
            fontWeight: 500,
            letterSpacing: "0.12em",
            lineHeight: "1em",
            textTransform: "uppercase",
          },
        }}
        settings={{
          gap: 16,
          radius: 8,
          background: "#ffffff",
          alignmentX: "center",
          alignmentY: "center",
        }}
        baseSize={{ width: 200, height: 250 }}
        scaleUp={{
          maxScale: 200,
          time: 0.5,
          easing: "easeInOut",
          sizeDecrement: 15,
        }}
        title={{
          enabled: true,
          text: "PRODUCTS",
          color: "#F0F0F0",
          alignmentX: "center",
          alignmentY: "center",
          fill: "fit",
          font: {
            fontFamily: FRAMER_FONT,
            fontSize: "clamp(80px, 12vw, 120px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: "1em",
            textAlign: "center",
          },
        }}
        subImages={{
          enabled: false,
        }}
        variants={{ enabled: false }}
        description={{
          enabled: true,
          position: "front",
          animation: "fade",
          alignmentX: "flex-start",
          alignmentY: "flex-start",
          text: {
            titleFont: {
              fontFamily: FRAMER_FONT,
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1.2em",
            },
            titleColor: "#000000",
            titleAnimation: "fade",
            descriptionFont: {
              fontFamily: FRAMER_FONT,
              fontSize: "15px",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: "1.3em",
            },
            descriptionColor: "#575757",
            priceFont: {
              fontFamily: FRAMER_FONT,
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1em",
            },
            priceColor: "#000000",
            textAlign: "left",
            textOrder: ["title", "description", "price"],
          },
          container: {
            background: "rgba(255, 255, 255, 0)",
            padding: 20,
            gap: 20,
            radius: 8,
            fill: "fixed",
            width: 300,
            borderWidth: 0,
            borderColor: "#000000",
            borderStyle: "solid",
          },
          button: {
            enabled: true,
            type: "primary",
            linkType: "individual",
            label: "View Piece",
            background: "#000000",
            textColor: "#FFFFFF",
            font: {
              fontFamily: FRAMER_FONT,
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1em",
            },
            radius: 8,
            padding: 12,
            fill: "fill",
            width: 200,
            borderWidth: 2,
            borderColor: "#000000",
            underlineThickness: 2,
            hover: {
              background: "#333333",
              textColor: "#FFFFFF",
              opacity: 1,
              scale: 0.98,
              borderColor: "#333333",
            },
            icon: { enabled: false },
          },
        }}
      />
    </section>
  );
}
