export type AsSeenOnLook = {
  id: string;
  name: string;
  piece: string;
  src: string;
  alt: string;
  position?: string;
};

export const asSeenOnHero: AsSeenOnLook = {
  id: "zeenat-aman",
  name: "Zeenat Aman",
  piece: "In the golden kaftan",
  src: "/images/press/zeenat-hero.jpg",
  alt: "Zeenat Aman in the golden kaftan",
  position: "center 22%",
};

export const asSeenOnLooks: AsSeenOnLook[] = [
  {
    id: "nikita-dutta",
    name: "Nikita Dutta",
    piece: "Allure suit",
    src: "/images/press/nikita-dutta.jpg",
    alt: "Nikita Dutta in the Allure suit",
    position: "center 12%",
  },
  {
    id: "manushi-chhillar",
    name: "Manushi Chhillar",
    piece: "Starlit halter gown",
    src: "/images/press/manushi-chhillar.jpg",
    alt: "Manushi Chhillar in the Starlit halter gown",
    position: "center 12%",
  },
  {
    id: "neha-sharma",
    name: "Neha Sharma",
    piece: "Rosalind jacket and blush column jumpsuit",
    src: "/images/press/neha-sharma.jpg",
    alt: "Neha Sharma in the Rosalind jacket and blush column jumpsuit",
    position: "center 42%",
  },
  {
    id: "sakshi-sindwani",
    name: "Sakshi Sindwani",
    piece: "Rosa impériale",
    src: "/images/press/sakshi-sindwani.jpg",
    alt: "Sakshi Sindwani in Rosa impériale",
    position: "center 18%",
  },
];
