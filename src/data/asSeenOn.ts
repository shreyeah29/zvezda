export type AsSeenOnLook = {
  id: string;
  name: string;
  piece: string;
  href: string;
  images: {
    src: string;
    alt: string;
    position?: string;
  }[];
};

export const asSeenOnLooks: AsSeenOnLook[] = [
  {
    id: "zeenat-aman",
    name: "Zeenat Aman",
    piece: "The Ophelia set",
    href: "/products/zeenat",
    images: [
      {
        src: "/assets/images/as-seen-on/zeenat-aman.jpg",
        alt: "Zeenat Aman wearing The Ophelia set",
        position: "center 18%",
      },
      {
        src: "/assets/images/as-seen-on/zeenat-aman-alt.jpg",
        alt: "Zeenat Aman in The Ophelia set, champagne drapes",
        position: "center 22%",
      },
    ],
  },
  {
    id: "disha-patani",
    name: "Disha Patani",
    piece: "Allure slit",
    href: "/products/allure-slit",
    images: [
      {
        src: "/assets/images/as-seen-on/allure-full.jpg",
        alt: "Disha Patani wearing the Allure slit gown",
        position: "center 12%",
      },
      {
        src: "/assets/images/as-seen-on/allure-portrait.jpg",
        alt: "Disha Patani in the Allure slit gown, portrait",
        position: "center 18%",
      },
    ],
  },
  {
    id: "hina-khan",
    name: "Hina Khan",
    piece: "Rosalind",
    href: "/products/rosalind-jacket-blush-column-jumpsuit",
    images: [
      {
        src: "/assets/images/as-seen-on/rosalind-bloom.jpg",
        alt: "Hina Khan wearing the Rosalind jacket and blush column jumpsuit",
        position: "center 22%",
      },
    ],
  },
  {
    id: "rosa-imperiale",
    name: "Rosa impériale",
    piece: "Screenwriters Sangha",
    href: "/products/rosa-imperiale",
    images: [
      {
        src: "/assets/images/as-seen-on/rosa-profile.jpg",
        alt: "Rosa impériale worn to the Screenwriters Sangha awards",
        position: "center 16%",
      },
      {
        src: "/assets/images/as-seen-on/rosa-front.jpg",
        alt: "Rosa impériale, front with sculptural florals and train",
        position: "center 18%",
      },
      {
        src: "/assets/images/as-seen-on/rosa-award.jpg",
        alt: "Rosa impériale at the Outstanding Screenplay awards",
        position: "center 20%",
      },
    ],
  },
];
