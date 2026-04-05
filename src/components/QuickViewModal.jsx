import { useState } from "react";
import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, setShowCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const images = product.imgs || (product.img ? [product.img] : []);
  const totalImages = images.length;
  const currentImage =
    images[currentImageIndex] ||
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=60";

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  const handleAdd = () => {
    addToCart(product);
    onClose();
    setShowCart(true);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 250,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(12px, 4vw, 24px)",
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "relative",
          background: "#fff",
          maxWidth: 600,
          width: "100%",
          height: "min(85vh, 760px)",
          display: "flex",
          flexDirection: "column",
          animation: "popIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          overflow: "hidden",
          borderRadius: 8,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}>
        {/* Image Section - Large & Centered */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "60%",
            background: "#F8F7F4",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}>
          <img
            src={currentImage}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
              padding: 20,
            }}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=60";
            }}
          />

          {/* Image counter */}
          {totalImages > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(28,28,26,0.8)",
                backdropFilter: "blur(4px)",
                color: "#fff",
                padding: "6px 12px",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 20,
                letterSpacing: 1,
              }}>
              {currentImageIndex + 1} / {totalImages}
            </div>
          )}

          {/* Navigation buttons */}
          {totalImages > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  borderRadius: "50%",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}>
                ‹
              </button>
              <button
                onClick={handleNextImage}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                  borderRadius: "50%",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  transition: "all 0.2s",
                }}>
                ›
              </button>
            </>
          )}
        </div>

        {/* Scrollable Details Section */}
        <div
          style={{
            flex: 1,
            padding: "32px clamp(20px, 5vw, 40px)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}>
          <p
            style={{
              fontSize: 10,
              color: "#C49A6C",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 8,
              fontWeight: 600,
            }}>
            {product.category}
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: 16,
              marginBottom: 16,
            }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: 400,
                lineHeight: 1.1,
                margin: 0,
              }}>
              {product.name}
            </h2>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(20px, 4vw, 24px)",
                margin: 0,
                color: "#1C1C1A",
                whiteSpace: "nowrap",
              }}>
              {fmt(product.price)}
            </p>
          </div>

          <p
            style={{
              fontSize: 14,
              color: "#666",
              lineHeight: 1.6,
              marginBottom: 32,
              flex: 1,
            }}>
            {product.desc}
          </p>

          <button
            className="btn-dark"
            style={{
              width: "100%",
              padding: "16px",
              fontSize: 12,
              letterSpacing: 2,
              marginTop: "auto",
            }}
            onClick={handleAdd}>
            Add to Cart
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "rgba(28,28,26,0.1)",
            border: "none",
            color: "#1C1C1A",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            transition: "all 0.2s",
            zIndex: 1,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(28,28,26,0.2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(28,28,26,0.1)")
          }>
          ✕
        </button>
      </div>
    </div>
  );
}
