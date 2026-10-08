import type { BoatPackage } from "@/types";

export const SEED_PACKAGES: BoatPackage[] = [
  {
    id: "mangrove-group", slug: "mangrove-group", type: "group", sortOrder: 1, isActive: true,
    name: "Mangrove Group Boating",
    imageUrl: "/packages/mangrove-group.jpg",
    description: "Enjoy peaceful mangrove group boating with family and friends, creating unforgettable nature-filled memories together.",
    pricePerPerson: 500, listPricePerPerson: 500,
    features: ["Guided tour through dense mangrove forest channels", "Perfect for families and scenic bird-watching", "Experienced local guide", "Safety-focused boating experience"],
    agePolicy: ["Below age 2: No ticket required", "Age 2–5: Half Ticket", "Age 5+: Full Ticket"],
    ctaLabel: "BOOK GROUP BOAT",
  },
  {
    id: "couple-escape", slug: "couple-escape", type: "private", sortOrder: 2, isActive: true,
    name: "Couple Escape",
    imageUrl: "/packages/couple-escape.jpg",
    description: "A 100% private boat for proposals, anniversaries and quiet golden-hour moments.",
    privateTiers: [
      { id: "couple", label: "Couple Escape", minGuests: 1, maxGuests: 2, price: 3600 },
      { id: "friends-family", label: "Friends & Family Cruise", minGuests: 3, maxGuests: 5, price: 4000 },
      { id: "royal", label: "Royal Private Cruise", minGuests: 6, maxGuests: 8, price: 4400 },
      { id: "grand", label: "Grand Family Cruise", minGuests: 9, maxGuests: 10, price: 5000 },
    ],
    features: ["100% private boat", "Romantic background music", "Scenic Arikamedu route", "Ideal for proposals and anniversaries", "Complimentary bottled water", "Wet tissues"],
    ctaLabel: "BOOK PRIVATE CHARTER",
  },
  {
    id: "bulk-booking", slug: "bulk-booking", type: "bulk", sortOrder: 3, isActive: true,
    name: "Bulk Booking",
    imageUrl: "/packages/bulk.jpg",
    description: "Book group tickets easily with special bulk discounts for families, schools and corporate teams.",
    pricePerPerson: 400, listPricePerPerson: 500, minGuests: 10,
    features: ["Budget-friendly shared boating", "Group experience", "Certified safety protocols", "Backwater and river mouth cruise", "Suitable for schools and corporate groups"],
    ctaLabel: "BOOK SHARED RIDE",
  },
];

export const DESTINATIONS = [
  { n: "01", name: "Mangrove Forest Boating", img: "/placeholders/mangrove.jpg", highlights: ["Mangrove tunnels", "Bird watching", "Nature photography", "Eco-tourism"],
    text: "Experience the best Mangrove Forest Boating in Pondicherry. Cruise through lush green mangrove tunnels, enjoy peaceful backwaters, spot native birds and discover a unique ecosystem up close." },
  { n: "02", name: "River Mouth", img: "/placeholders/river-mouth.jpg", highlights: ["Bay of Bengal", "Ocean views", "Sunrise/sunset", "Photography"],
    text: "Witness the breathtaking River Mouth where the river meets the Bay of Bengal. Enjoy panoramic ocean views, fresh sea breeze and beautiful sunrise or sunset moments." },
  { n: "03", name: "Arikamedu", img: "/placeholders/arikamedu.jpg", highlights: ["Ancient heritage", "Indo-Roman history", "Archaeology", "Scenic river views"],
    text: "Discover the ancient heritage of Arikamedu, one of India's important archaeological sites. Cruise along the river near the historic Indo-Roman trading port dating back over 2,000 years." },
  { n: "04", name: "Fishing Harbour", img: "/placeholders/fishing-harbour.jpg", highlights: ["Fishing boats", "Local fishermen", "Coastal views", "Photography"],
    text: "Explore the vibrant Pondicherry Fishing Harbour and experience the daily life of local fishermen." },
] as const;