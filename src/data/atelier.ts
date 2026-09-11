export const atelierContact = {
  careEmail: "atelierzvezda.official@gmail.com",
  pressEmail: "atelierzvezda.official@gmail.com",
  instagramUrl: "https://www.instagram.com/zvezda_atelier/",
  instagramHandle: "@zvezda_atelier",
  /** International format without +. Empty until a WhatsApp number is provided. */
  whatsapp: "",
} as const;

export const atelierStudio = {
  name: "Zvezda Atelier",
  line1: "8-2-293/82/A/1177",
  line2: "Jubilee Hills Road No. 56",
  line3: "Jubilee Hills, Hyderabad 500033",
  hours: "11:00 am – 7:00 pm",
  hoursShort: "11 am – 7 pm",
  city: "Hyderabad",
} as const;

export function studioAddressLines() {
  return [atelierStudio.line1, atelierStudio.line2, atelierStudio.line3];
}

export function studioAddressText() {
  return studioAddressLines().join(", ");
}

export function studioHoursText() {
  return `Open ${atelierStudio.hours} IST`;
}

export function studioMapsUrl() {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioAddressText())}`;
}

export const aboutHero = {
  eyebrow: "The House",
  title: "Feel like a star.",
  image: "/assets/images/products/set-15/HSP_4946.jpg",
  imageAlt: "A signature ZVEZDA look — crimson petal serenade",
};

export const founderStory = {
  eyebrow: "Founder",
  name: "Bindu Reddy",
  intro:
    "Zvezda Atelier is a refined expression of luxury, where understated glamour meets timeless craftsmanship.",
  paragraphs: [
    "Founded by Bindu Reddy, a stylist turned designer, the brand is built on a foundation of expertise, intuition, and artistry. Having studied styling at the Australian Style Institute, Sydney, Bindu honed her skills in understanding silhouettes, fabric interplay, and the nuances of personal style.",
    "With a career spanning both luxury and retail fashion. Her deep-rooted knowledge of fashion retail and high-end styling informs her approach to design, ensuring that each Zvezda Atelier piece is not just an outfit, but an experience.",
    "The debut collection embodies her signature aesthetic, quiet luxury, effortless femininity, and timeless silhouettes.",
    "Every garment is meticulously crafted with an intuitive understanding of fit, movement, and refinement, designed for women who appreciate elegance without excess.",
    "With a commitment to quality, exclusivity, and craftsmanship, Zvezda Atelier is not just about dressing a woman, it's about elevating her presence.",
  ],
};

export const zvezdaMeaning = {
  eyebrow: "A Name Inspired by the Stars",
  title: "ZVEZDA",
  paragraphs: [
    'ZVEZDA is the Slavic word for "star". A symbol of grace, quiet confidence, and timeless beauty.',
    "Our name reflects the essence of every collection: refined silhouettes, exceptional craftsmanship, and pieces designed to illuminate the woman who wears them.",
  ],
};

export const craftNote = {
  eyebrow: "Atelier",
  title: "Crafted with Intention",
  lead: "Luxury begins long before a garment is worn.",
  paragraphs: [
    "Every ZVEZDA piece is thoughtfully designed, meticulously crafted, and finished by skilled artisans who value precision above all else. We believe in creating fewer, better pieces—garments that transcend seasons and become part of a lasting wardrobe.",
    "From the selection of premium fabrics to the final hand-finished detail, every decision reflects our commitment to excellence.",
  ],
  closing: "Quiet luxury. Timeless craftsmanship. Uncompromising quality.",
};

export const atelierCraft = {
  eyebrow: "Atelier",
  titleLines: ["Crafted with", "intention"] as const,
  paragraphs: [
    "Every ZVEZDA piece is made to order in a single atelier — cut, sewn, and hand-finished one garment at a time. Nothing is produced until it is spoken for.",
    "Because each piece is made by hand, slight variation is not a flaw. It is the natural signature of craft — the proof that a person, not a factory, made it.",
  ],
};

export const zvezdaNameReveal = {
  words: ["ZVEZDA", "means", "“star”", "in", "Slavic", "languages."] as const,
  caption:
    "make the woman wearing it feel radiant and charming, like a star",
};

export const aboutMarqueeItems = [
  "MADE TO ORDER",
  "ONE PIECE AT A TIME",
  "HAND FINISHED",
  "EST. 2022",
  "QUIET LUXURY",
  "SINGLE ATELIER",
] as const;

export const aboutMedia = {
  heroLeft: {
    image: "/assets/images/shop/eclipse-royale/HSP_2982.jpg",
    video: "/assets/videos/products/set-8/White&Black1.mp4",
    alt: "Ivory and black gown in motion",
  },
  heroRight: {
    image: "/assets/images/shop/carmine-ascend/IMG_6792.jpg",
    video: "/assets/videos/products/set-12/RedDressSolo.mp4",
    alt: "Crimson gown, a first silhouette",
  },
  founder: {
    image: "/assets/images/about/bindu-reddy.jpg",
    alt: "Bindu Reddy, founder of ZVEZDA Atelier",
  },
  atelierFilm: {
    image: "/assets/images/shop/carmine-ascend/IMG_6791.jpg",
    video: "/assets/videos/products/set-12/RedDressSolo.mp4",
    alt: "The atelier film",
  },
  closeLeft: {
    image: "/assets/images/products/set-15/HSP_4946.jpg",
    video: "/assets/videos/products/set-15/PinkSolo1.mp4",
    alt: "Blush satin in motion",
  },
  closeRight: {
    image: "/assets/images/home-feature/HSP_6032.jpg",
    video: "/assets/videos/products/set-1/GardenSolo3.mp4",
    alt: "Garden silk, a quiet evening",
  },
} as const;

export const aboutArchive = [
  {
    caption: "The house",
    index: "01",
    image: "/assets/images/home-feature/HSP_6032.jpg",
    video: "/assets/videos/products/set-1/GardenSolo3.mp4",
    alt: "The house — garden silk",
  },
  {
    caption: "A first silhouette",
    index: "02",
    image: "/assets/images/shop/carmine-ascend/IMG_6791.jpg",
    video: "/assets/videos/products/set-12/RedDressSolo.mp4",
    alt: "A first silhouette in crimson",
  },
  {
    caption: "Atelier & process",
    index: "03",
    image: "/assets/images/film-web/HSP_3677.jpg",
    alt: "Atelier and process",
  },
  {
    caption: "Fabric in motion",
    index: "04",
    image: "/assets/images/products/set-15/HSP_4946.jpg",
    video: "/assets/videos/products/set-15/PinkSolo1.mp4",
    alt: "Fabric in motion",
  },
  {
    caption: "Hand finishing",
    index: "05",
    image: "/assets/images/film-web/HSP_4408.jpg",
    alt: "Hand finishing",
  },
  {
    caption: "The wearer",
    index: "06",
    image: "/assets/images/shop/eclipse-royale/HSP_2982.jpg",
    video: "/assets/videos/products/set-8/White&Black1.mp4",
    alt: "The wearer",
  },
] as const;

export const atelierTimeline = [
  {
    year: "2022",
    title: "The first piece",
    body: "The first ZVEZDA piece is made for a personal event.",
  },
  {
    year: "2022—Now",
    title: "The atelier",
    body: "ZVEZDA grows from a single dress into a full label and atelier, built on the idea that every woman deserves to feel like a star.",
  },
] as const;

export const enquiryOccasions = ["Wedding", "Party", "Gifting", "Other"] as const;

export const enquirySizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const enquiryBudgets = [
  "Under ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Prefer to discuss",
] as const;

export const enquirySources = ["Instagram", "Referral", "Event", "Other"] as const;
