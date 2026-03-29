import { useState } from "react";
import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, index, onQuickView }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div
      className="pcard"
      style={{ animation: `fadeUp 0.45s ${index * 0.06}s ease both` }}>
      {/* Image */}
      <div
        style={{
          overflow: "hidden",
          height: 256,
          cursor: "pointer",
          position: "relative",
        }}
        onClick={() => onQuickView(product)}>
        <img
          className="pcard-img"
          src={product.img}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=60";
          }}
        />
        {product.bestSelling && (
          <div
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              background: "#C49A6C",
              color: "white",
              padding: "4px 8px",
              fontSize: 10,
              fontWeight: 500,
              letterSpacing: 1,
              textTransform: "uppercase",
              borderRadius: 4,
            }}>
            Best Selling
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(28,28,26,0.04)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.3s",
          }}
          className="quick-overlay">
          <span
            style={{
              background: "rgba(248,247,244,0.92)",
              padding: "8px 16px",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}>
            Quick View
          </span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 22px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
          }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19,
              fontWeight: 400,
              lineHeight: 1.2,
              flex: 1,
              paddingRight: 8,
            }}>
            {product.name}
          </h3>
          <span style={{ fontSize: 15, fontWeight: 500, whiteSpace: "nowrap" }}>
            {fmt(product.price)}
          </span>
        </div>

        <p
          style={{
            fontSize: 10,
            color: "#C49A6C",
            letterSpacing: 1.5,
            textTransform: "uppercase",
            marginBottom: 10,
            fontWeight: 500,
          }}>
          {product.category}
        </p>

        <p
          style={{
            fontSize: 13,
            color: "#888880",
            lineHeight: 1.65,
            marginBottom: 20,
            minHeight: 44,
          }}>
          {product.desc}
        </p>

        <button
          className="btn-dark"
          style={{ width: "100%" }}
          onClick={handleAdd}>
          {added ? (
            <span className="added-flash" style={{ color: "#C49A6C" }}>
              ✓ Added to Cart
            </span>
          ) : (
            "Add to Cart"
          )}
        </button>
      </div>
    </div>
  );
}
