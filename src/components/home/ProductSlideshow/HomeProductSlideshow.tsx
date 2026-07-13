"use client";

import { useMemo } from "react";
import { formatPrice, getProduct } from "@/data/products";
import { shopHighlightCards } from "@/data/shopHighlightCards";
import { getSet, setPhotoPath } from "@/data/sets";
import { ProductSlideshow } from "./ProductSlideshow";
import type { SlideItem } from "./types";
import "./HomeProductSlideshow.css";

function buildSlideItems(): SlideItem[] {
  const items: SlideItem[] = [];

  for (const card of shopHighlightCards) {
    const product = getProduct(card.slug);
    const set = getSet(card.setId);
    if (!product || !set) continue;

    const primaryFilename = card.image.split("/").pop();
    const subImages = set.photos
      .filter((photo) => photo !== primaryFilename)
      .slice(0, 4)
      .map((photo) => ({
        src: setPhotoPath(set, photo),
        alt: product.name,
      }));

    items.push({
      image: {
        src: card.image,
        alt: product.name,
      },
      subImages: subImages.length > 0 ? subImages : undefined,
      productInfo: {
        title: product.name,
        description: product.story,
        price: formatPrice(product.price, product.currency),
      },
      buttonLink: `/products/${card.slug}`,
    });
  }

  return items;
}

export function HomeProductSlideshow() {
  const items = useMemo(() => buildSlideItems(), []);

  return (
    <section className="home-product-slideshow" aria-label="Featured pieces slideshow">
      <ProductSlideshow
        items={items}
        imageFit="contain"
        settings={{
          gap: 20,
          radius: 0,
          background: "#ffffff",
          alignmentX: "center",
          alignmentY: "center",
        }}
        baseSize={{ width: 240, height: 320 }}
        scaleUp={{
          maxScale: 220,
          time: 0.5,
          easing: "easeInOut",
          sizeDecrement: 15,
        }}
        title={{
          enabled: true,
          text: "PIECES",
          color: "#F0F0F0",
          alignmentX: "center",
          alignmentY: "center",
          fill: "fit",
          font: {
            fontSize: "clamp(72px, 14vw, 160px)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: "1em",
            textAlign: "center",
            fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          },
        }}
        subImages={{
          enabled: true,
          size: 40,
          gap: 8,
          radius: 0,
          position: "bottom",
          alignmentX: "center",
          alignmentY: "flex-end",
          inactiveOpacity: 0.5,
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
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1.2em",
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            },
            titleColor: "#000000",
            titleAnimation: "fade",
            descriptionFont: {
              fontSize: "15px",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: "1.3em",
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            },
            descriptionColor: "#575757",
            priceFont: {
              fontSize: "15px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1em",
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            },
            priceColor: "#000000",
            textAlign: "left",
            textOrder: ["title", "description", "price"],
          },
          container: {
            background: "rgba(255, 255, 255, 0)",
            padding: 20,
            gap: 16,
            radius: 0,
            fill: "fixed",
            width: 320,
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
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: "1em",
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            },
            radius: 0,
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
