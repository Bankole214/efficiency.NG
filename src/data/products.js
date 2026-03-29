export const INITIAL_PRODUCTS = [
  {
    id: "p1",
    name: "Oslo Lounge Chair",
    price: 450000,
    category: "Seating",
    desc: "Sculptural low-profile chair with premium wool upholstery and solid walnut legs.",
    img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    bestSelling: true,
  },
  {
    id: "p2",
    name: "Minimal Oak Desk",
    price: 320000,
    category: "Office",
    desc: "Clean-lined solid oak desk with a single drawer and cable management.",
    img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80",
    bestSelling: true,
  },
  {
    id: "p3",
    name: "Cloud Linen Sofa",
    price: 850000,
    category: "Seating",
    desc: "Deep-seat three-seater sofa in natural linen with feather-filled cushions.",
    img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    bestSelling: true,
  },
  {
    id: "p4",
    name: "Travertine Side Table",
    price: 180000,
    category: "Tables",
    desc: "Natural travertine stone top on powder-coated steel base. Each piece unique.",
    img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600&q=80",
  },
  {
    id: "p5",
    name: "Arc Floor Lamp",
    price: 95000,
    category: "Lighting",
    desc: "Elegant arching floor lamp with a linen shade and weighted marble base.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
  },
  {
    id: "p6",
    name: "Walnut Wall Shelf",
    price: 75000,
    category: "Storage",
    desc: "Floating solid walnut shelf with invisible mounting hardware.",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
];

export const CATEGORIES = [
  "Seating",
  "Tables",
  "Office",
  "Lighting",
  "Storage",
  "Bedroom",
  "Other",
];

export const fmt = (n) => "₦" + Number(n).toLocaleString("en-NG");
