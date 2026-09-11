import type { Product } from "./products";
import {
  HOUSE_COLLECTION_LABELS,
  getHouseCollection,
  type HouseCollectionSlug,
} from "./houseCollections";

type ShopDraft = {
  id: number;
  slug: string;
  name: string;
  photos: string[];
  price?: number;
  priceOptions?: Product["priceOptions"];
  sizeOptions?: string[];
  sizeNote?: string;
  description: string;
  fabric: string;
  craft?: string[];
  care?: string;
  video?: string;
  colours?: string[];
  garmentType?: string;
  houseCollection?: HouseCollectionSlug;
};

function shopImage(slug: string, filename: string) {
  if (filename.startsWith("/")) return filename;
  return `/assets/images/shop/${slug}/${filename}`;
}

function fromDraft(draft: ShopDraft): Product {
  const photos = draft.photos.map((file) => shopImage(draft.slug, file));
  const hero = photos[0] ?? "";
  const detail = photos[1] ?? hero;

  return {
    slug: draft.slug,
    setId: draft.id,
    name: draft.name,
    collection: (draft.houseCollection ?? SHOP_LOOKS[draft.slug]?.houseCollection) || "atelier",
    collectionLabel: (() => {
      const house = draft.houseCollection ?? SHOP_LOOKS[draft.slug]?.houseCollection;
      return house ? HOUSE_COLLECTION_LABELS[house] : "Zvezda Atelier";
    })(),
    price: draft.price ?? 0,
    currency: "INR",
    priceOnRequest: draft.price == null,
    priceOptions: draft.priceOptions,
    sizeOptions: draft.sizeOptions ?? ["6", "8", "10", "12"],
    sizeNote: draft.sizeNote,
    description: draft.description,
    story: draft.description,
    fabric: draft.fabric,
    craft: draft.craft,
    care: draft.care ?? "Dry clean only",
    hero,
    detail,
    gallery: photos.slice(1),
    video: draft.video,
    colours: draft.colours ?? SHOP_LOOKS[draft.slug]?.colours ?? [],
    garmentType: draft.garmentType ?? SHOP_LOOKS[draft.slug]?.garmentType,
  };
}

export const SHOP_COLOURS = [
  { id: "black", label: "Black", swatch: "#111111" },
  { id: "red", label: "Red", swatch: "#8b1a2b" },
  { id: "blush", label: "Blush", swatch: "#d4a088" },
  { id: "pink", label: "Pink", swatch: "#e8a4b8" },
  { id: "green", label: "Green", swatch: "#4a5240" },
  { id: "yellow", label: "Yellow", swatch: "#c9a227" },
  { id: "orange", label: "Orange", swatch: "#c47a3a" },
  { id: "ivory", label: "Ivory", swatch: "#f3efe6" },
  { id: "blue", label: "Blue", swatch: "#6b7c93" },
  { id: "champagne", label: "Champagne", swatch: "#c4a574" },
] as const;

export const SHOP_TYPES = [
  { id: "gown", label: "Gowns" },
  { id: "dress", label: "Dresses" },
  { id: "mini", label: "Mini dresses" },
  { id: "set", label: "Sets" },
  { id: "jumpsuit", label: "Jumpsuits" },
] as const;

export const SHOP_PRICE_BANDS = [
  { id: "under-40", label: "Under ₹40,000" },
  { id: "40-70", label: "₹40,000 – ₹70,000" },
  { id: "70-100", label: "₹70,000 – ₹1,00,000" },
  { id: "over-100", label: "Above ₹1,00,000" },
] as const;

export const SHOP_SIZES = ["6", "8", "10", "12"] as const;

export const SHOP_AVAILABILITY = [
  { id: "priced", label: "Priced" },
  { id: "request", label: "Price on request" },
] as const;

export const SHOP_SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
] as const;

export function matchesShopPriceBand(price: number, priceOnRequest: boolean | undefined, band: string) {
  if (priceOnRequest) return false;
  if (band === "under-40") return price < 40000;
  if (band === "40-70") return price >= 40000 && price < 70000;
  if (band === "70-100") return price >= 70000 && price < 100000;
  if (band === "over-100") return price >= 100000;
  return false;
}

const SHOP_LOOKS: Record<
  string,
  { colours: string[]; garmentType: string; houseCollection?: HouseCollectionSlug }
> = {
  "rosa-imperiale": { colours: ["black", "red"], garmentType: "gown", houseCollection: "bespoke" },
  "starlit-halter-gown": { colours: ["black"], garmentType: "gown", houseCollection: "statement" },
  "the-scarlett-heiress-dress": { colours: ["orange", "red"], garmentType: "gown", houseCollection: "statement" },
  "blooming-rosalia-3d-gown": { colours: ["red"], garmentType: "gown", houseCollection: "bespoke" },
  "velvet-blooms-dress": { colours: ["black", "pink"], garmentType: "gown", houseCollection: "statement" },
  "ivory-eclipse": { colours: ["black", "ivory"], garmentType: "gown", houseCollection: "statement" },
  "eclipse-royale": { colours: ["black", "ivory"], garmentType: "gown", houseCollection: "statement" },
  "allure-slit": { colours: ["black"], garmentType: "gown", houseCollection: "occasion" },
  "blush-noir-2-piece-set": { colours: ["blush", "black"], garmentType: "set", houseCollection: "occasion" },
  "blush-elan": { colours: ["blush", "pink"], garmentType: "gown", houseCollection: "statement" },
  "pearl-tailored-set": { colours: ["ivory"], garmentType: "set", houseCollection: "occasion" },
  "jardin-elegance-dress": { colours: ["green"], garmentType: "gown", houseCollection: "romance" },
  "verdant-whisper-gown": { colours: ["green"], garmentType: "gown", houseCollection: "statement" },
  "olive-tiered-zephyr-mini-dress": { colours: ["green"], garmentType: "mini", houseCollection: "romance" },
  "blush-mirage": { colours: ["blush"], garmentType: "gown", houseCollection: "romance" },
  "rosewood-heirloom": { colours: ["pink"], garmentType: "gown", houseCollection: "romance" },
  "crimson-petal-serenade": { colours: ["pink"], garmentType: "gown", houseCollection: "romance" },
  "rosalind-jacket-blush-column-jumpsuit": {
    colours: ["blush", "pink"],
    garmentType: "jumpsuit",
    houseCollection: "romance",
  },
  "daughters-of-spring-pink": { colours: ["pink"], garmentType: "set", houseCollection: "romance" },
  "daughters-of-spring-green": { colours: ["green"], garmentType: "dress", houseCollection: "romance" },
  "molten-muse": { colours: ["yellow"], garmentType: "dress", houseCollection: "occasion" },
  "carmine-ascend": { colours: ["red"], garmentType: "gown", houseCollection: "occasion" },
  "green-pearl-dress": { colours: ["green"], garmentType: "gown", houseCollection: "romance" },
  "fire-and-ice": { colours: ["blue", "yellow"], garmentType: "gown", houseCollection: "statement" },
  "petal-dress": { colours: ["pink"], garmentType: "gown", houseCollection: "bespoke" },
  "conservatory-iv": { colours: ["green"], garmentType: "gown", houseCollection: "romance" },
  "denim-dress": { colours: ["blue"], garmentType: "mini", houseCollection: "romance" },
  "butterfly-inspired": { colours: ["blue"], garmentType: "set", houseCollection: "statement" },
  zeenat: { colours: ["champagne"], garmentType: "set", houseCollection: "statement" },
  "set-25": { colours: ["black", "ivory"], garmentType: "dress", houseCollection: "statement" },
  "set-26": { colours: ["black"], garmentType: "gown", houseCollection: "statement" },
  "pearl-cascade": { colours: ["ivory"], garmentType: "dress", houseCollection: "bespoke" },
  "wine-velvet": { colours: ["red"], garmentType: "gown", houseCollection: "occasion" },
  "obsidian-drape": { colours: ["black"], garmentType: "mini", houseCollection: "occasion" },
  "terra-bloom": { colours: ["black", "orange"], garmentType: "gown", houseCollection: "occasion" },
  "ivory-satin": { colours: ["ivory"], garmentType: "gown", houseCollection: "occasion" },
};

const drafts: ShopDraft[] = [
  {
    id: 101,
    slug: "rosa-imperiale",
    name: "Rosa impériale",
    photos: ["HSP_2850.jpg", "HSP_2866.jpg", "HSP_2887.jpg"],
    price: 35000,
    priceOptions: [
      { label: "Gown", amount: 35000 },
      { label: "Cape", amount: 150000 },
    ],
    sizeOptions: ["8", "10", "12"],
    description:
      "Rosa impériale explores the tension between darkness and romance, featuring a sculpted black silhouette layered with hand-sculpted crimson floral appliqué that creates dimension across the bodice and structured shoulders. Crafted in Italian crape and Dutch satin, the gown is finished with a dramatic flowing train that enhances its elongated silhouette, while the intricate floral detailing brings a soft, sculptural contrast to the otherwise striking form. Each element is thoughtfully constructed and finished at the Zvezda Atelier to create a piece that feels both powerful and distinctly romantic.",
    craft: [
      "Hand-sculpted floral appliqué",
      "Structured shoulder detailing",
      "Flowing couture train",
    ],
    fabric: "Italian crape and Dutch satin",
    video: "/assets/videos/products/set-6/OrangeSolo2.mp4",
  },
  {
    id: 102,
    slug: "starlit-halter-gown",
    name: "Starlit halter gown",
    photos: ["BHA_1933.jpg", "HSP_2470.jpg", "HSP_2528.jpg"],
    price: 51999,
    sizeOptions: ["8", "10"],
    description:
      "A striking black gown featuring a sleek column silhouette and a dramatic jeweled halter neckline. The cascading crystal embellishments add a touch of glamour, while the clean, sculpted design keeps the look effortlessly sophisticated.",
    fabric: "Italian crape",
  },
  {
    id: 103,
    slug: "the-scarlett-heiress-dress",
    name: "The scarlett heiress dress",
    photos: ["BHA_2027.jpg", "BHA_2049.jpg", "HSP_2610.jpg"],
    price: 65000,
    sizeOptions: ["8", "10"],
    description:
      "Settles into quiet strength in a ruched satin bodice that contours with ease, defined by a softly accentuated waist. The gown unfolds into a voluminous, structured form — holding shape, depth, and a sense of grounded elegance.",
    fabric: "Dutch-satin",
    video: "/assets/videos/products/set-13/OrangeSolo1.mp4",
  },
  {
    id: 104,
    slug: "blooming-rosalia-3d-gown",
    name: "Blooming Rosalia 3D gown",
    photos: ["BHA_4851.jpg", "BHA_4523.jpg", "BHA_4531.jpg", "BHA_4839.jpg"],
    sizeOptions: ["8", "10"],
    description:
      "A garden in crimson motion. Hand-sculpted florals bloom across layers of passion, held together by delicate structure and sparkle. A dress that feels alive — bold, romantic, unforgettable.",
    fabric: "Dutch-satin",
  },
  {
    id: 105,
    slug: "velvet-blooms-dress",
    name: "Velvet blooms dress",
    photos: ["BHA_5556.jpg", "HSP_2205.jpg", "HSP_2208.jpg"],
    price: 82999,
    sizeOptions: ["8", "10", "12"],
    description:
      "A striking black gown brought to life with sculptural pink floral appliqués along the shoulders, a daring thigh-high slit, and an unexpected open back. A balance of dark elegance and delicate romance, designed to make an entrance.",
    fabric: "Italian crape and velvet",
  },
  {
    id: 106,
    slug: "ivory-eclipse",
    name: "Ivory eclipse",
    photos: ["HSP_3158.jpg", "HSP_3176.jpg", "HSP_3218.jpg", "HSP_3227.jpg"],
    price: 89000,
    sizeOptions: ["8", "10"],
    description:
      "Midnight and moonlight in quiet contrast. A sculpted strapless bodice in deep black brings structure and poise, flowing seamlessly into layered white drapes beneath. Soft cascading folds introduce movement and lightness, creating a striking balance between depth and delicacy.",
    fabric: "Italian crape color block",
    video: "/assets/videos/products/set-9/White&Black2.mp4",
  },
  {
    id: 107,
    slug: "eclipse-royale",
    name: "Eclipse Royale",
    photos: ["HSP_2982.jpg", "HSP_3056.jpg", "HSP_3076.jpg"],
    price: 78900,
    sizeOptions: ["8", "10"],
    description:
      "A striking play of midnight and ivory — featuring a sculpted strapless bodice, delicate floral waist embellishments, and a dramatic flowing cape that moves with effortless elegance.",
    fabric: "Italian crape color block",
    video: "/assets/videos/products/set-8/White&Black1.mp4",
  },
  {
    id: 108,
    slug: "allure-slit",
    name: "Allure slit",
    photos: ["HSP_3554.jpg", "HSP_3587.jpg"],
    price: 42000,
    sizeOptions: ["8", "10", "12"],
    description:
      "Black as eternity, bold as fire, this gown drapes in its spell. The pearl-trimmed edges shimmer like moonlit waves, the cutouts sculpt a dream of shadows, and the slit is the flame that keeps the night alive.",
    fabric: "Italian crape",
  },
  {
    id: 109,
    slug: "blush-noir-2-piece-set",
    name: "Blush noir — 2 piece set",
    photos: ["HSP_2254.jpg", "HSP_2294.jpg", "HSP_2390.jpg"],
    price: 50950,
    priceOptions: [
      { label: "Top", amount: 32950 },
      { label: "Skirt", amount: 18000 },
    ],
    sizeOptions: ["8"],
    description:
      "Off-shoulder midnight blush, wrapped in time, a touch of dusk, a hint of rhyme. Not just a dress, but a feeling worn. Like twilight paused before the dawn.",
    fabric: "Pure organza and Italian crape",
  },
  {
    id: 110,
    slug: "blush-elan",
    name: "Blush elan",
    photos: ["HSP_1743.jpg", "HSP_1798.jpg", "HSP_1804.jpg"],
    price: 66750,
    sizeOptions: ["8", "10", "12"],
    description:
      "A gown kissed by the blush of roses, falling into rivers of fabric. It holds her, frees her, crowns her — a masterpiece in motion.",
    fabric: "",
  },
  {
    id: 111,
    slug: "pearl-tailored-set",
    name: "Pearl tailored set",
    photos: ["IMG_7860.jpg", "IMG_7861.jpg", "IMG_7864.jpg", "IMG_7865.jpg"],
    price: 42199,
    priceOptions: [
      { label: "Jacket & top", amount: 42199 },
      { label: "Pants", amount: 13000 },
    ],
    sizeOptions: ["6", "8", "10", "12"],
    sizeNote: "Jackets (white) 6, 8, 10, 12 · Jackets (grey) 6, 8, 12 · Pants (white) 6, 8, 10, 12 · Pants (grey) 6, 10, 12",
    description:
      "Ivory drapes that speak in whispers of grace, an embroidered jacket tracing light like a dream, tailored lines meet tender folds, where strength and softness find their rhythm.",
    fabric: "Italian crape",
  },
  {
    id: 112,
    slug: "jardin-elegance-dress",
    name: "Jardin elegance dress",
    photos: ["HSP_4309.jpg", "HSP_4327.jpg", "HSP_4590.jpg"],
    price: 68000,
    sizeOptions: ["8", "10"],
    description:
      "An elegant moss-olive gown designed with a flowing, floor-length fall that moves effortlessly. The bodice is delicately hand-embellished with intricate florals and subtle shimmer, adding texture and quiet opulence. Fine straps and a softly defined waist enhance the form, while the graceful drape of the skirt creates a timeless, ethereal presence — refined, feminine, and luxuriously understated.",
    fabric: "Bemberg silk",
    video: "/assets/videos/products/set-1/GardenSolo3.mp4",
  },
  {
    id: 113,
    slug: "verdant-whisper-gown",
    name: "Verdant whisper gown",
    photos: ["HSP_4828.jpg", "HSP_4810.jpg", "HSP_4819.jpg"],
    price: 98500,
    sizeOptions: ["8", "10"],
    description:
      "A bloom of blush and intricate florals. Hand-embellished details shimmer across the bodice, flowing into layers of garden-inspired fabric that move with effortless grace.",
    fabric: "Satin and brocade",
    video: "/assets/videos/products/set-2/GardenSolo2.mp4",
  },
  {
    id: 114,
    slug: "olive-tiered-zephyr-mini-dress",
    name: "Olive tiered zephyr mini dress",
    photos: ["HSP_3876.jpg", "HSP_3929.jpg", "HSP_3971.jpg"],
    price: 36950,
    sizeOptions: ["8"],
    description:
      "An olive satin mini dress designed to captivate, featuring a sculpted bodice that contours the silhouette with effortless elegance. Delicate embellished straps add a touch of refinement, while the voluminous tiered skirt brings playful movement and dramatic flair to this striking silhouette.",
    fabric: "Mikado",
    video: "/assets/videos/products/set-3/GardenSolo1.mp4",
  },
  {
    id: 115,
    slug: "blush-mirage",
    name: "Blush mirage",
    photos: ["HSP_4492.jpg", "HSP_4495.jpg", "VAM_6670.jpg"],
    price: 45000,
    sizeOptions: ["8", "10"],
    description:
      "A delicate blush creation featuring a sculpted neckline, a softly contoured bodice, and a subtle crystal accent that defines the waist, flowing into graceful layered movement.",
    fabric: "Satin and shimmer georgette",
    video: "/assets/videos/products/set-5/PeachSolo1.mp4",
  },
  {
    id: 116,
    slug: "rosewood-heirloom",
    name: "Rosewood heirloom",
    photos: ["HSP_5080.jpg", "HSP_5151.jpg", "HSP_5165.jpg", "HSP_5186.jpg"],
    price: 119000,
    sizeOptions: ["8"],
    description:
      "A soft blush-pink gown adorned with intricate silver floral embroidery and delicate embellishments. The structured bodice flows into a graceful, feminine silhouette, creating an elegant look inspired by the beauty of a blooming garden.",
    fabric: "Dutch satin",
    video: "/assets/videos/products/set-18/PinkSolo2.mp4",
  },
  {
    id: 117,
    slug: "crimson-petal-serenade",
    name: "Crimson petal serenade",
    photos: ["HSP_5008.jpg", "HSP_5015.jpg", "HSP_5054.jpg", "VAM_6961.jpg"],
    price: 65550,
    sizeOptions: ["8", "10"],
    description:
      "A lustrous pink satin gown with delicate crystal detailing along the neckline and a beautifully draped asymmetric skirt. The soft ruching and flowing ruffles add movement, creating a look that feels feminine, refined, and effortlessly glamorous.",
    fabric: "Dutch satin",
    video: "/assets/videos/products/set-15/PinkSolo1.mp4",
  },
  {
    id: 118,
    slug: "rosalind-jacket-blush-column-jumpsuit",
    name: "Rosalind jacket and blush column jumpsuit",
    photos: ["HSP_5292.jpg", "HSP_5309.jpg", "HSP_5368.jpg", "HSP_5404.jpg"],
    price: 38999,
    priceOptions: [
      { label: "Jumpsuit", amount: 38999 },
      { label: "Jacket", amount: 92999 },
    ],
    sizeOptions: ["6", "8", "10", "12"],
    sizeNote: "Jacket 6–8 · Jumpsuit 8–12",
    description:
      "A soft rose jumpsuit that celebrates ease and elegance in one breath, sculpted to flatter yet designed to move with grace. Paired with a hand-embroidered sequin cape that gleams like scattered starlight, the look transforms simplicity into statement. It's where texture meets tone, and shimmer meets subtlety — a love letter to modern couture in pastel form.",
    fabric: "Suede",
    video: "/assets/videos/products/set-17/PinkSOlo3.mp4",
  },
  {
    id: 119,
    slug: "daughters-of-spring-pink",
    name: "Daughters of spring — Blush",
    photos: ["HSP_5988.jpg", "HSP_6019.jpg"],
    price: 67999,
    sizeOptions: ["8"],
    sizeNote: "Pink crop top & skirt 8 · Pink dress 8",
    description:
      "Two hues, one fairytale. Blush rose and mint unfolding in delicate floral detailing, each petal resting like a quiet secret on satin. A look that moves with effortless grace, blossoming softly in pastel light.",
    fabric: "Milano satin",
    video: "/assets/videos/products/set-16/PinkCoord1.mp4",
  },
  {
    id: 120,
    slug: "daughters-of-spring-green",
    name: "Daughters of spring — Sage",
    photos: ["HSP_5940.jpg", "HSP_5954.jpg"],
    price: 67999,
    sizeOptions: ["6", "8", "10"],
    sizeNote: "Green dress 6, 8, 10",
    description:
      "Two hues, one fairytale. Blush rose and mint unfolding in delicate floral detailing, each petal resting like a quiet secret on satin. A look that moves with effortless grace, blossoming softly in pastel light.",
    fabric: "Milano satin",
  },
  {
    id: 121,
    slug: "molten-muse",
    name: "Molten muse",
    photos: ["HSP_5858.jpg", "HSP_5874.jpg", "HSP_5916.jpg"],
    price: 36000,
    sizeOptions: ["6", "8"],
    description:
      "Wrapped in golden satin that flows with ease, the dress moves softly with every step. A halter neckline catching the light just right, inviting you into a moment that feels calm and radiant.",
    fabric: "Milano satin",
    video: "/assets/videos/products/set-11/YellowSolo1.mp4",
  },
  {
    id: 122,
    slug: "carmine-ascend",
    name: "Carmine ascend",
    photos: [
      "/assets/images/products/set-12/HSP_5547.jpg",
      "/assets/images/products/set-12/HSP_5549.jpg",
      "/assets/images/products/set-12/HSP_5571.jpg",
      "/assets/images/products/set-12/HSP_5635.jpg",
      "/assets/images/products/set-12/HSP_5750.jpg",
    ],
    price: 49000,
    sizeOptions: ["8", "10"],
    description:
      "A sculpted crimson gown cut for presence — open at the back, falling into a generous train that moves like a curtain rising. The silhouette is spare, the colour unapologetic: a couture evening piece designed to hold the room.",
    fabric: "Milano satin",
    video: "/assets/videos/products/set-12/RedDressSolo.mp4",
  },
  {
    id: 123,
    slug: "green-pearl-dress",
    name: "The Peridot dress",
    photos: ["peridot-atelier.jpg", "IMG_2132.jpg", "IMG_2133.jpg", "IMG_2134.jpg", "IMG_6804.jpg"],
    price: 28000,
    sizeOptions: ["8", "10"],
    description:
      "A dreamy pistachio gown with a graceful drape and pearls resting gently along the neckline — proof that the finest kind of luxury never has to be loud.",
    fabric: "Raw silk",
  },
  {
    id: 124,
    slug: "fire-and-ice",
    name: "Fire and ice",
    photos: ["IMG_7658.jpg", "IMG_7659.jpg", "IMG_7660.jpg", "IMG_7661.jpg"],
    price: 78950,
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "A little frost, a little flame. The ice blue that symbolises calm, clarity, elegance and quiet strength and the golden fire of passion, ambition and intensity on a neutral beige palette.",
    fabric: "Georgette",
  },
  {
    id: 125,
    slug: "petal-dress",
    name: "The Camellia",
    photos: [
      "IMG_6666.jpg",
      "IMG_6665.jpg",
      "IMG_6785.jpg",
      "IMG_7844.jpg",
      "IMG_7845.jpg",
      "IMG_7846.jpg",
      "IMG_7847.jpg",
    ],
    sizeOptions: ["8", "10", "12"],
    description:
      "Inspired by the layered elegance of a romantic garden rose, this couture gown captures the journey from a richly layered heart to soft, unfolding petals. Custom made and meticulously handcrafted over two months, this is a vision brought to life, one petal at a time.",
    fabric: "Organza silk",
  },
  {
    id: 126,
    slug: "denim-dress",
    name: "Icy Étoile",
    photos: ["IMG_7857.jpg", "IMG_7858.jpg", "IMG_7859.jpg"],
    price: 56999,
    sizeOptions: ["8", "10"],
    description:
      "An ice-blue one-shoulder mini dress with delicate floral embroidery, crystal embellishments, a sculpted waist, and a playful peplum silhouette.",
    fabric: "Sequin denim",
  },
  {
    id: 127,
    slug: "butterfly-inspired",
    name: "Papillon two-piece set",
    photos: ["IMG_6783.jpg", "IMG_7323.jpg", "IMG_7326.jpg", "IMG_7842.jpg", "IMG_7843.jpg"],
    price: 89000,
    priceOptions: [
      { label: "Corset", amount: 69000 },
      { label: "Skirt", amount: 20000 },
    ],
    sizeOptions: ["8", "10", "12"],
    description:
      "A dreamy steel-blue butterfly-inspired gown with intricate silver embroidery, a sculpted corset, and delicate wing-like scalloped detailing. Finished with a flowing skirt for an ethereal, graceful silhouette.",
    fabric: "Organza and tulle",
  },
  {
    id: 128,
    slug: "zeenat",
    name: "The Ophelia set",
    photos: ["IMG_6794.jpg", "IMG_6795.jpg", "IMG_6797.jpg", "IMG_8911.jpg"],
    price: 72000,
    sizeOptions: ["8", "10", "12"],
    description:
      "Sculpted champagne drapes traced with crystal florals, flowing into a hand-embellished silhouette that glimmers like antique couture. A balance of softness, structure, and quiet opulence — designed to leave an impression without ever asking for attention.",
    fabric: "Dutch satin and sequin lace",
  },
  {
    id: 129,
    slug: "set-25",
    name: "Aria",
    photos: ["IMG_7332.jpg", "IMG_7333.jpg"],
    price: 71250,
    sizeOptions: ["8", "10", "12"],
    description: "",
    fabric: "",
  },
  {
    id: 130,
    slug: "set-26",
    name: "Noir sculpted",
    photos: ["IMG_7329.jpg", "IMG_7330.jpg", "IMG_7331.jpg"],
    price: 73150,
    sizeOptions: ["8", "10", "12"],
    description: "",
    fabric: "",
  },
  {
    id: 131,
    slug: "pearl-cascade",
    name: "The Pearl Fall",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg", "06.jpg"],
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "The Pearl Muse Dress captures the quiet opulence of modern romance through a sculpted, feminine silhouette adorned with delicate pearl and crystal detailing. Designed with a structured corset bodice and softly curved neckline, the dress gently contours the figure before falling into a clean, fitted skirt. Scattered hand-placed embellishments add subtle points of light across the silhouette, while cascading strands of pearls and crystals fall from the hem, creating movement and an almost ethereal finish. Thoughtfully constructed and finished at the Zvezda Atelier, The Pearl Muse balances refined structure with fluid ornamentation, creating a piece that feels both timeless and distinctly couture.",
    craft: [
      "Hand-embellished pearl and crystal neckline",
      "Scattered hand-placed crystal detailing",
      "Cascading pearl and crystal fringe hem",
      "Structured corset silhouette",
    ],
    fabric: "Sequin georgette",
    care: "Dry clean only",
  },
  {
    id: 132,
    slug: "wine-velvet",
    name: "Royal Damson",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg"],
    price: 51280,
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "Royal Damson explores the intersection of classic grandeur and allure, built on a dramatic, waist-cinching off-the-shoulder line that frames a deep sweetheart bust. Tailored in luxurious Italian velvet to a fitted mermaid silhouette, the gown is finished with a high slit and a long floor-length train. Each detail is constructed and finished at the Zvezda Atelier to create a commanding, powerfully cinematic presence.",
    craft: [
      "Internal corset boning",
      "Off-the-shoulder sweetheart neckline",
      "High slit with floor-length train",
    ],
    fabric: "Italian velvet",
    care: "Dry clean only",
  },
  {
    id: 143,
    slug: "obsidian-drape",
    name: "Starlight Drop",
    photos: ["01.jpg", "02.jpg", "03.jpg", "04.jpg", "05.jpg"],
    price: 32000,
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "Starlight Drop merges playful cocktail lengths with dramatic couture elements, featuring a fitted black mini silhouette anchored by a delicately embellished strapless neckline. Tailored in structured Japanese crepe, the dress is sculpted around the body before releasing into a sweeping, tiered ruffle drape that cascades asymmetrically from the waist to the floor. The subtle crystal rim along the bust offers a quiet touch of light, while the dramatic side train adds fluid motion to a sharp, modern cut. Each detail is thoughtfully constructed and finished at the Zvezda Atelier to create a statement piece that feels both youthful and undeniably sophisticated.",
    craft: [
      "Delicate crystal-embellished strapless neckline",
      "Floor-length cascading side ruffle train",
      "Structured mini sheath silhouette",
    ],
    fabric: "Japanese crepe",
    care: "Dry clean only",
  },
  {
    id: 144,
    slug: "terra-bloom",
    name: "Terracotta Bloom",
    photos: ["01.jpg", "02.jpg", "03.jpg"],
    price: 28000,
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "Terracotta Bloom is a study of refined minimalism: a pitch-black column interrupted by a single terracotta floral motif. Cut in Japanese crepe, the smooth surface gives the sculptural appliqué dimension and contrast. Spaghetti straps and a high side slit keep the line graphic. Thoughtfully finished at the Zvezda Atelier.",
    craft: [
      "Spaghetti-strap column silhouette",
      "Sculptural terracotta floral appliqué",
      "High side slit",
    ],
    fabric: "Japanese crepe",
    care: "Dry clean only",
  },
  {
    id: 145,
    slug: "ivory-satin",
    name: "The White Muse Dress",
    photos: ["01.jpg", "02.jpg", "03.jpg"],
    price: 35000,
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "The White Muse embodies quiet romance through a fluid, elongated silhouette crafted in lustrous sandwash satin. A delicate cowl neckline falls effortlessly across the bodice, while slender straps are finished with intricate crystal embellishment, adding a subtle touch of brilliance to the otherwise understated form. The gown skims the body before falling into a soft, flowing hem, creating an effortless movement that feels both sensual and refined. Thoughtfully finished at the Zvezda Atelier, The White Muse captures a sense of timeless femininity through simplicity, fluidity, and delicate detailing.",
    craft: [
      "Hand-embellished crystal shoulder detailing",
      "Soft cowl neckline",
      "Fluid, elongated silhouette",
    ],
    fabric: "Sandwash satin",
    care: "Dry clean only",
  },
  {
    id: 146,
    slug: "conservatory-iv",
    name: "Conservatory IV",
    photos: [
      "/assets/images/products/set-4/HSP_4843.jpg",
      "/assets/images/products/set-4/HSP_4864.jpg",
      "/assets/images/products/set-4/HSP_4903.jpg",
      "/assets/images/products/set-4/HSP_4908.jpg",
    ],
    price: 39000,
    sizeOptions: ["6", "8", "10", "12"],
    description:
      "A lime-green gown with a plunging embroidered bodice and a fluid skirt that moves like garden light — quiet, botanical, and made for evenings that feel like dusk in a conservatory.",
    fabric: "Silk satin",
  },
];

export const shopProducts: Product[] = drafts.map(fromDraft);

export function getShopProduct(slug: string) {
  return shopProducts.find((product) => product.slug === slug);
}

export function getHouseCollectionProducts(slug: string) {
  const house = getHouseCollection(slug);
  if (!house) return [];
  return house.productSlugs
    .map((productSlug) => getShopProduct(productSlug))
    .filter((product): product is Product => Boolean(product));
}

const COLLECTION_FILM_SLUG: Record<string, string> = {
  statement: "eclipse-royale",
  occasion: "molten-muse",
  romance: "jardin-elegance-dress",
  bespoke: "rosa-imperiale",
};

export function getCollectionFilm(slug: string) {
  const products = getHouseCollectionProducts(slug);
  const preferred = COLLECTION_FILM_SLUG[slug];
  const filmed =
    products.find((product) => product.slug === preferred && product.video) ??
    products.find((product) => product.video);
  if (!filmed?.video) return null;
  return {
    src: filmed.video,
    poster: filmed.hero,
    href: `/products/${filmed.slug}`,
    name: filmed.name,
  };
}

export function getShopRelated(slug: string, limit = 4) {
  const current = getShopProduct(slug);
  const sameHouse = shopProducts.filter(
    (product) => product.slug !== slug && product.collection === current?.collection,
  );
  const rest = shopProducts.filter(
    (product) => product.slug !== slug && product.collection !== current?.collection,
  );
  return [...sameHouse, ...rest].slice(0, limit);
}
