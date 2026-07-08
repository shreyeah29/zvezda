import { products } from "@/data/products";

export type MoodBoardItem = {
  id: string;
  src: string;
  alt: string;
  slug: string;
  label: string;
  width: string;
  height: string;
  top: string;
  left: string;
  rotate: number;
  zIndex: number;
};

/** Organic collage layout — positions are editorial, not grid */
export function getMoodBoardItems(): MoodBoardItem[] {
  const pick = (slug: string, galleryIndex = 0) => {
    const product = products.find((p) => p.slug === slug);
    if (!product) return null;
    const src = galleryIndex === 0 ? product.hero : product.gallery[galleryIndex - 1] ?? product.hero;
    return {
      src,
      alt: product.name,
      slug: product.slug,
      label: product.name,
    };
  };

  const slots: Array<{
    slug: string;
    galleryIndex?: number;
    width: string;
    height: string;
    top: string;
    left: string;
    rotate: number;
    zIndex: number;
  }> = [
    { slug: "set-12", width: "22%", height: "48%", top: "8%", left: "4%", rotate: -2.5, zIndex: 2 },
    { slug: "set-1", galleryIndex: 1, width: "18%", height: "34%", top: "14%", left: "28%", rotate: 3, zIndex: 3 },
    { slug: "set-5", width: "24%", height: "52%", top: "6%", left: "48%", rotate: -1.5, zIndex: 4 },
    { slug: "set-8", galleryIndex: 2, width: "16%", height: "30%", top: "22%", left: "74%", rotate: 4, zIndex: 2 },
    { slug: "set-3", width: "20%", height: "40%", top: "52%", left: "8%", rotate: 2, zIndex: 3 },
    { slug: "set-11", width: "26%", height: "44%", top: "48%", left: "32%", rotate: -3, zIndex: 5 },
    { slug: "set-6", galleryIndex: 1, width: "18%", height: "36%", top: "56%", left: "62%", rotate: 1.5, zIndex: 2 },
    { slug: "set-13", width: "15%", height: "28%", top: "62%", left: "82%", rotate: -4, zIndex: 1 },
  ];

  return slots
    .map((slot, index) => {
      const data = pick(slot.slug, slot.galleryIndex);
      if (!data) return null;
      return {
        id: `${slot.slug}-${index}`,
        ...data,
        width: slot.width,
        height: slot.height,
        top: slot.top,
        left: slot.left,
        rotate: slot.rotate,
        zIndex: slot.zIndex,
      };
    })
    .filter(Boolean) as MoodBoardItem[];
}
