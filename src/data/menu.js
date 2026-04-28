export const menuItems = [
  {
    title: "الصفحة الرئيسية",
    links: [{ href: "/", label: "Home", isCurrent: true }],
    isCurrent: true,
    hasDropdown: false,
  },
  {
    title: "عقارات",
    links: [
      { href: "/houses", label: "منازل" },
      { href: "/lands", label: "أراضي" },
    ],
  },
  {
    title: "سيارات",
    links: [{ href: "/cars", label: "السيارات" }],
    hasDropdown: false,
  },
  {
    title: "دراجات",
    links: [{ href: "/motorcycles", label: "الدراجات" }],
    hasDropdown: false,
  },
  {
    title: "مركبات بحرية",
    links: [{ href: "/marines", label: "المركبات البحرية" }],

    hasDropdown: false,
  },
  {
    title: "من نحن",
    links: [{ href: "/about-us", label: "الدراجات" }],
    hasDropdown: false,
  },
];
