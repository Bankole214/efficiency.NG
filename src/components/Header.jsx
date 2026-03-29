import { useCart } from "../context/CartContext";

export default function Header({
  categories,
  activeCategory,
  onCategoryChange,
  onAdminClick,
}) {
  const { cartCount, setShowCart } = useCart();

  return (
    <header
      style={{
        background: "rgba(248,247,244,0.96)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid #E8E6E0",
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "0 clamp(20px,4vw,48px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 68,
        gap: 16,
      }}>
      {/* Logo */}
      <span
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: 4,
          color: "#1C1C1A",
          flexShrink: 0,
        }}>
        EFFICIENCY.NG
      </span>

      {/* Category Nav */}
      <nav
        style={{
          display: "flex",
          gap: "clamp(10px,2vw,24px)",
          alignItems: "center",
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 1,
        }}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`nav-cat${activeCategory === cat ? " active" : ""}`}
            onClick={() => onCategoryChange(cat)}>
            {cat}
          </button>
        ))}
      </nav>

      {/* Cart Button */}
      <button
        onClick={() => setShowCart(true)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#1C1C1A",
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          padding: 4,
        }}
        aria-label="Open cart">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4">
          <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
        {cartCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#C49A6C",
              color: "#fff",
              borderRadius: "50%",
              width: 18,
              height: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: 600,
            }}>
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}
