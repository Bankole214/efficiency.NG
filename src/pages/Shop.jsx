import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProductCarousel from "../components/ProductCarousel";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import CheckoutModal from "../components/CheckoutModal";
import QuickViewModal from "../components/QuickViewModal";
import Footer from "../components/Footer";
import toast from "react-hot-toast";

export default function Shop({ products, categories, onAdminClick, onReviewClick, onAboutClick }) {
  const [filterCat, setFilterCat] = useState("All");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [quickView, setQuickView] = useState(null);

  const allCategories = [
    "All",
    ...new Set(categories.map(c => c.name)),
  ];
  const displayProducts =
    filterCat === "All"
      ? products
      : products.filter((p) => p.category === filterCat);

  const handleOrderSuccess = () => {
    toast.success("Order placed! Thank you for shopping with Efficiency.NG.");
  };

  const handleCategoryChange = (cat) => {
    setFilterCat(cat);
    toast.success(`Browsing ${cat} Furniture`, {
      id: "category-toast",
      icon: "🛋️",
    });
  };

  return (
    <>
      <Header
        categories={allCategories}
        activeCategory={filterCat}
        onCategoryChange={handleCategoryChange}
      />

      {/* Page Header: Centered Logo and Category Name */}
      <div
        style={{
          margin: "40px 0 20px 0",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(32px, 6vw, 48px)",
            fontWeight: 400,
            color: "#1C1C1A",
            textTransform: "capitalize",
            letterSpacing: -0.5,
          }}>
          {filterCat === "All" ? "Our Collection" : filterCat}
        </div>
        <div
          style={{
            width: 40,
            height: 1,
            background: "#C49A6C",
          }}
        />
      </div>

      <Hero />

      <ProductCarousel
        products={products}
        onQuickView={setQuickView}
      />

      <main
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding:
            "clamp(32px,5vw,56px) clamp(20px,4vw,48px) clamp(48px,8vw,96px)",
        }}>

        <div
          style={{
            marginBottom: 32,
            textAlign: "center",
          }}>
          <span style={{ fontSize: 12, color: "#888880" }}>
            {displayProducts.length} items
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(268px, 1fr))",
            gap: 24,
          }}>
          {displayProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onQuickView={setQuickView}
            />
          ))}
        </div>

        {displayProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "#888880",
            }}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 26,
                fontWeight: 300,
              }}>
              No products in this category yet.
            </p>
            <p style={{ fontSize: 13, marginTop: 8 }}>
              Check back soon, or browse another category.
            </p>
          </div>
        )}
      </main>

      <Footer
        onAdminClick={onAdminClick}
        onReviewClick={onReviewClick}
        onAboutClick={onAboutClick}
      />

      <CartDrawer onCheckout={() => setCheckoutOpen(true)} />
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />
      <QuickViewModal product={quickView} onClose={() => setQuickView(null)} />
    </>
  );
}
