export type AsSeenOnImage = {
  src: string;
  alt: string;
  position?: string;
};

export type AsSeenOnLook = {
  id: string;
  name: string;
  piece: string;
  href: string;
  images: AsSeenOnImage[];
};

export const asSeenOnLooks: AsSeenOnLook[] = [
  {
    id: "zeenat-aman",
    name: "Zeenat Aman",
    piece: "The Ophelia set",
    href: "/products/zeenat",
    images: [
      {
        src: "/images/press/zeenat-hero.jpg",
        alt: "The Ophelia set",
        position: "center 22%",
      },
      {
        src: "/images/press/zeenat-alt.jpg",
        alt: "The Ophelia set, looking to camera",
        position: "center 20%",
      },
    ],
  },
  {
    id: "nikita-dutta",
    name: "Nikita Dutta",
    piece: "Allure suit",
    href: "/products/allure-slit",
    images: [
      {
        src: "/images/press/nikita-dutta.jpg",
        alt: "The Allure suit",
        position: "center 12%",
      },
      {
        src: "/images/press/nikita-dutta-alt.jpg",
        alt: "The Allure suit, portrait",
        position: "center 18%",
      },
    ],
  },
  {
    id: "manushi-chhillar",
    name: "Manushi Chhillar",
    piece: "Starlit halter gown",
    href: "/products/starlit-halter-gown",
    images: [
      {
        src: "/images/press/manushi-chhillar.jpg",
        alt: "The Starlit halter gown",
        position: "center 12%",
      },
      {
        src: "/images/press/manushi-chhillar-alt.jpg",
        alt: "The Starlit halter gown, at the table",
        position: "center 20%",
      },
    ],
  },
  {
    id: "neha-sharma",
    name: "Neha Sharma",
    piece: "Rosalind jacket and blush column jumpsuit",
    href: "/products/rosalind-jacket-blush-column-jumpsuit",
    images: [
      {
        src: "/images/press/neha-sharma.jpg",
        alt: "The Rosalind jacket and blush column jumpsuit",
        position: "center 42%",
      },
    ],
  },
  {
    id: "sakshi-sindwani",
    name: "Sakshi Sindwani",
    piece: "Rosa impériale",
    href: "/products/rosa-imperiale",
    images: [
      {
        src: "/images/press/sakshi-sindwani.jpg",
        alt: "Rosa impériale",
        position: "center 18%",
      },
      {
        src: "/images/press/sakshi-sindwani-front.jpg",
        alt: "Rosa impériale, full gown",
        position: "center 18%",
      },
      {
        src: "/images/press/sakshi-sindwani-train.jpg",
        alt: "Rosa impériale, train",
        position: "center 22%",
      },
    ],
  },
];
