import { useState } from "react";
import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, setShowCart } = useCart();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  // Support both old (img) and new (imgs) formats
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
        padding: 20,
      }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: "relative",
          background: "#fff",
          maxWidth: 720,
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          animation: "popIn 0.3s ease",
          maxHeight: "90vh",
          overflow: "auto",
        }}>
        {/* Image Gallery */}
        <div
          style={{
            position: "relative",
            width: "50%",
            minWidth: 260,
            maxHeight: 440,
          }}>
          <img
            src={currentImage}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
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
                bottom: 12,
                left: 12,
                background: "rgba(28,28,26,0.85)",
                color: "#fff",
                padding: "6px 10px",
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 3,
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
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  borderRadius: 2,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#fff")}
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.9)")
                }>
                ‹
              </button>
              <button
                onClick={handleNextImage}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.9)",
                  border: "none",
                  cursor: "pointer",
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  borderRadius: 2,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.target.style.background = "#fff")}
                onMouseLeave={(e) =>
                  (e.target.style.background = "rgba(255,255,255,0.9)")
                }>
                ›
              </button>
            </>
          )}

          {/* Thumbnail dots */}
          {totalImages > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: 12,
                right: 12,
                display: "flex",
                gap: 6,
              }}>
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    border: "none",
                    cursor: "pointer",
                    background:
                      currentImageIndex === idx
                        ? "#C49A6C"
                        : "rgba(255,255,255,0.6)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (currentImageIndex !== idx)
                      e.target.style.background = "rgba(255,255,255,0.8)";
                  }}
                  onMouseLeave={(e) => {
                    if (currentImageIndex !== idx)
                      e.target.style.background = "rgba(255,255,255,0.6)";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ flex: 1, padding: "36px 32px", minWidth: 240 }}>
          <p
            style={{
              fontSize: 10,
              color: "#C49A6C",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 10,
              fontWeight: 500,
            }}>
            {product.category}
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 16,
            }}>
            {product.name}
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              marginBottom: 20,
            }}>
            {fmt(product.price)}
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#888880",
              lineHeight: 1.7,
              marginBottom: 28,
            }}>
            {product.desc}
          </p>
          <button
            className="btn-dark"
            style={{ width: "100%" }}
            onClick={handleAdd}>
            Add to Cart
          </button>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "#1C1C1A",
            border: "none",
            color: "#fff",
            width: 30,
            height: 30,
            cursor: "pointer",
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          ✕
        </button>
      </div>
    </div>
  );
}
