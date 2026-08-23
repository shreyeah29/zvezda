export const atelierContact = {
  careEmail: "atelierzvezda.official@gmail.com",
  pressEmail: "atelierzvezda.official@gmail.com",
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

export const enquiryOccasions = ["Wedding", "Party", "Gifting", "Other"] as const;

export const enquirySizes = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export const enquiryBudgets = [
  "Under ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Prefer to discuss",
] as const;

export const enquirySources = ["Instagram", "Referral", "Event", "Other"] as const;
