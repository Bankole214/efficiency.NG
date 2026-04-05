import { useCart } from "../context/CartContext";

export default function FloatingCart() {
  const { cartCount, setShowCart } = useCart();

  return (
    <button
      onClick={() => setShowCart(true)}
      style={{
        position: "fixed",
        bottom: "clamp(24px, 5vw, 40px)",
        right: "clamp(24px, 5vw, 40px)",
        background: "#1C1C1A",
        color: "#FFF",
        width: "clamp(56px, 12vw, 68px)",
        height: "clamp(56px, 12vw, 68px)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.1)",
        cursor: "pointer",
        zIndex: 200,
        transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.08) translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1) translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.3)";
      }}
      aria-label="Open cart">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5">
        <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>

      {cartCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            background: "#C49A6C",
            color: "#fff",
            borderRadius: "50%",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(196,154,108,0.4)",
            border: "2px solid #1C1C1A",
          }}>
          {cartCount}
        </span>
      )}
    </button>
  );
}
