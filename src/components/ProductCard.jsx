import { useState } from "react";
import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, index, onQuickView }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const mainImage = product.imgs?.[0] || product.img;

  return (
    <div
      className="pcard"
      onClick={() => onQuickView(product)}
      style={{ 
        animation: `fadeUp 0.45s ${index * 0.06}s ease both`,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        border: "1px solid #f0f0f0"
      }}>
      {/* Image */}
      <div
        style={{
          overflow: "hidden",
          height: 256,
          flexShrink: 0,
          position: "relative",
        }}>
        <img
          className="pcard-img"
          src={mainImage}
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
      <div style={{ 
        padding: "20px 22px 24px", 
        display: "flex", 
        flexDirection: "column", 
        flexGrow: 1 
      }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 4,
            gap: 8
          }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 19,
              fontWeight: 400,
              lineHeight: 1.2,
              margin: 0,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
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
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 42,
            flexGrow: 1
          }}>
          {product.desc}
        </p>

        <button
          className="btn-dark"
          style={{ width: "100%", marginTop: "auto" }}
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
