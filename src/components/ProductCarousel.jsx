import { useState } from "react";
import ProductCard from "./ProductCard";

export default function ProductCarousel({ products, onQuickView }) {
  const [scrollRatio, setScrollRatio] = useState(0);

  // Only show best-selling products
  const featuredProducts = products.filter((p) => p.bestSelling);

  if (featuredProducts.length === 0) return null;

  // Instead of complex transforms, let's use a native scrollable container with JS scroll methods for the buttons.
  const scrollToNext = () => {
    const el = document.getElementById("featured-carousel");
    if (el) el.scrollBy({ left: el.offsetWidth + 24, behavior: "smooth" });
  };

  const scrollToPrev = () => {
    const el = document.getElementById("featured-carousel");
    if (el) el.scrollBy({ left: -(el.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px,8vw,80px) clamp(20px,4vw,48px)",
        borderBottom: "1px solid #E8E6E0",
      }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(28px,5vw,42px)",
            fontWeight: 400,
            marginBottom: 8,
            color: "#1C1C1A",
          }}>
          Featured Collection
        </h2>
        <p style={{ fontSize: 14, color: "#888880" }}>
          Discover our most loved pieces
        </p>
      </div>

      <div style={{ position: "relative" }}>
        {/* Navigation Buttons */}
        {featuredProducts.length > 4 && (
          <>
            <button
              className="nav-buttons"
              onClick={scrollToPrev}
              style={{
                position: "absolute",
                left: -20,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#fff",
                border: "1px solid #E8E6E0",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1.05)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
              aria-label="Previous products">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <button
              className="nav-buttons"
              onClick={scrollToNext}
              style={{
                position: "absolute",
                right: -20,
                top: "50%",
                transform: "translateY(-50%)",
                background: "#fff",
                border: "1px solid #E8E6E0",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1.05)";
                e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(-50%) scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
              }}
              aria-label="Next products">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}

        {/* Products Grid Wrapper */}
        <div 
          className="carousel-viewport" 
          id="featured-carousel"
          onScroll={(e) => {
            const el = e.target;
            const maxScroll = el.scrollWidth - el.clientWidth;
            if (maxScroll > 0) {
              setScrollRatio(el.scrollLeft / maxScroll);
            }
          }}
          style={{ scrollBehavior: "smooth" }}>
          <div className="carousel-grid">
            {featuredProducts.map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                className="carousel-item fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard
                  product={product}
                  index={i}
                  onQuickView={onQuickView}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dots Indicator */}
        {featuredProducts.length > 4 && (
          <div
            className="carousel-dots"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 8,
              marginTop: 32,
            }}>
            {Array.from({ length: Math.ceil(featuredProducts.length / 4) }).map(
              (_, i, arr) => {
                const isActive = Math.round(scrollRatio * (arr.length - 1)) === i;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      const el = document.getElementById("featured-carousel");
                      if (el) {
                        const maxScroll = el.scrollWidth - el.clientWidth;
                        el.scrollTo({ left: (i / (arr.length - 1)) * maxScroll, behavior: "smooth" });
                      }
                    }}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      border: "none",
                      background: isActive ? "#C49A6C" : "#E8E6E0",
                      cursor: "pointer",
                      transition: "background 0.2s",
                    }}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                );
              }
            )}
          </div>
        )}

      </div>
    </section>
  );
}
