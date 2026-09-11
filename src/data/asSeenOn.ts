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
        alt: "Zeenat Aman in The Ophelia set",
        position: "center 22%",
      },
      {
        src: "/images/press/zeenat-alt.jpg",
        alt: "Zeenat Aman in The Ophelia set, looking to camera",
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
        alt: "Nikita Dutta in the Allure suit",
        position: "center 12%",
      },
      {
        src: "/images/press/nikita-dutta-alt.jpg",
        alt: "Nikita Dutta in the Allure suit, portrait",
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
        alt: "Manushi Chhillar in the Starlit halter gown",
        position: "center 12%",
      },
      {
        src: "/images/press/manushi-chhillar-alt.jpg",
        alt: "Manushi Chhillar in the Starlit halter gown, at the table",
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
        alt: "Neha Sharma in the Rosalind jacket and blush column jumpsuit",
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
        alt: "Sakshi Sindwani in Rosa impériale",
        position: "center 18%",
      },
      {
        src: "/images/press/sakshi-sindwani-front.jpg",
        alt: "Sakshi Sindwani in Rosa impériale, full gown",
        position: "center 18%",
      },
      {
        src: "/images/press/sakshi-sindwani-train.jpg",
        alt: "Sakshi Sindwani in Rosa impériale, train",
        position: "center 22%",
      },
    ],
  },
];
