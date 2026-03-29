import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, setShowCart } = useCart();

  if (!product) return null;

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
      }}
    >
      <div
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }}
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
        }}
      >
        {/* Image */}
        <img
          src={product.img}
          alt={product.name}
          style={{ width: "50%", minWidth: 260, objectFit: "cover", maxHeight: 440 }}
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=60";
          }}
        />

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
            }}
          >
            {product.category}
          </p>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              lineHeight: 1.2,
              marginBottom: 16,
            }}
          >
            {product.name}
          </h2>
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              marginBottom: 20,
            }}
          >
            {fmt(product.price)}
          </p>
          <p
            style={{
              fontSize: 14,
              color: "#888880",
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            {product.desc}
          </p>
          <button className="btn-dark" style={{ width: "100%" }} onClick={handleAdd}>
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
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
