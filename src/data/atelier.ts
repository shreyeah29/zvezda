export const atelierContact = {
  careEmail: "care@zvezdaatelier.com",
  pressEmail: "press@zvezdaatelier.com",
  instagramUrl: "https://www.instagram.com/zvezda_atelier/",
  instagramHandle: "@zvezda_atelier",
  /** International format without +. Empty until a WhatsApp number is provided. */
  whatsapp: "",
} as const;

export const aboutHero = {
  eyebrow: "The House",
  title: "Feel like a star.",
  image: "/assets/images/products/set-15/HSP_4946.jpg",
  imageAlt: "A signature ZVEZDA look — crimson petal serenade",
};

export const founderStory = {
  eyebrow: "Founder Story",
  name: "Bindu Reddy",
  intro:
    "Zvezda Atelier is a refined expression of luxury, where understated glamour meets timeless craftsmanship.",
  paragraphs: [
    "Founded by Bindu Reddy, a stylist turned designer, the brand is built on a foundation of expertise, intuition, and artistry. Having studied styling at the Australian Style Institute, Sydney, Bindu honed her skills in understanding silhouettes, fabric interplay, and the nuances of personal style.",
    "With a career spanning both luxury and retail fashion, her deep-rooted knowledge of fashion retail and high-end styling informs her approach to design, ensuring that each Zvezda Atelier piece is not just an outfit, but an experience.",
    "The debut collection embodies her signature aesthetic — quiet luxury, effortless femininity, and timeless silhouettes. Every garment is meticulously crafted with an intuitive understanding of fit, movement, and refinement, designed for women who appreciate elegance without excess.",
    "With a commitment to quality, exclusivity, and craftsmanship, Zvezda Atelier is not just about dressing a woman — it's about elevating her presence.",
  ],
};

export const zvezdaMeaning = {
  eyebrow: "The Name",
  title: "What ZVEZDA Means",
  body: 'ZVEZDA means "star" in Slavic languages. The name captures exactly what every piece is designed to do — make the woman wearing it feel radiant and charming, like a star.',
};

export const craftNote = {
  eyebrow: "Atelier",
  title: "Crafted with intention",
  paragraphs: [
    "Every ZVEZDA piece is made to order and crafted with intention. From hand-selected fabrics to intricate detailing and finishing, each creation is brought to life by skilled artisans with meticulous care.",
    "As every piece is individually crafted, subtle variations in colour, texture, embroidery, and finish may occur — making each ZVEZDA creation truly one of a kind.",
  ],
};

export const atelierTimeline = [
  {
    year: "2022",
    title: "The first piece",
    body: "The first ZVEZDA piece is made for a personal event.",
  },
  {
    year: "2022–Present",
    title: "The atelier",
    body: "ZVEZDA grows from a single dress into a full label and atelier, built on the idea that every woman deserves to feel like a star.",
  },
] as const;

export const aboutPortraits = [
  {
    src: "/assets/images/home-feature/HSP_6032.jpg",
    alt: "Editorial still from the ZVEZDA atelier",
    caption: "The house",
    note: "Founder portrait of Bindu Reddy to be placed here.",
  },
  {
    src: "/assets/images/products/set-1/HSP_4590.jpg",
    alt: "Jardin elegance dress — garden green couture gown",
    caption: "A first silhouette",
    note: "The original 2022 dress can replace this frame when the archive photograph is ready.",
  },
  {
    src: "/assets/images/home/collection-split/HSP_3336.jpg",
    alt: "Close study of a ZVEZDA gown",
    caption: "Atelier & process",
    note: "Behind-the-scenes making shots belong here.",
  },
  {
    src: "/assets/images/products/set-9/HSP_3218.jpg",
    alt: "Ivory eclipse — a signature ZVEZDA look",
    caption: "A signature look",
    note: "Ivory eclipse, from the debut collection.",
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
