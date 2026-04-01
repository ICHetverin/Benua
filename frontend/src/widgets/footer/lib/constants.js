import { NAV_ITEMS } from "shared/lib/navigation";

export const FOOTER_SECTIONS = [
  {
    title: "Меню",
    links: NAV_ITEMS,
  },
  {
    title: "О нас",
    links: [
      { label: "О проекте", href: "/about#team" },
      { label: "Команда", href: "/about" },
      { label: "Университет", href: "https://itmo.ru", external: true },
    ],
  },
];
