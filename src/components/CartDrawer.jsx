import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ onCheckout }) {
  const { cart, cartCount, cartTotal, showCart, setShowCart, updateQty } = useCart();

  if (!showCart) return null;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }}>
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.35)",
          animation: "fadeIn 0.25s ease",
        }}
        onClick={() => setShowCart(false)}
      />

      {/* Drawer */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "min(420px,100vw)",
          background: "#fff",
          animation: "slideRight 0.3s cubic-bezier(0.22,1,0.36,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px 28px 18px",
            borderBottom: "1px solid #E8E6E0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 24,
                fontWeight: 400,
              }}
            >
              Your Cart
            </h2>
            <p style={{ fontSize: 12, color: "#888880", marginTop: 2 }}>
              {cartCount} {cartCount === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            onClick={() => setShowCart(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              cursor: "pointer",
              color: "#888880",
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 72, color: "#888880" }}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#D0CECC"
                strokeWidth="1"
                style={{ marginBottom: 16 }}
              >
                <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 20,
                  marginBottom: 8,
                }}
              >
                Your cart is empty
              </p>
              <p style={{ fontSize: 13 }}>Browse our collection below.</p>
              <button
                className="btn-dark"
                style={{ marginTop: 20 }}
                onClick={() => setShowCart(false)}
              >
                Browse Products
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                style={{
                  display: "flex",
                  gap: 14,
                  paddingBottom: 22,
                  marginBottom: 22,
                  borderBottom: "1px solid #F4F2EC",
                }}
              >
                <img
                  src={item.product.img}
                  alt={item.product.name}
                  style={{
                    width: 80,
                    height: 80,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: 17,
                      fontWeight: 400,
                      lineHeight: 1.2,
                      marginBottom: 4,
                    }}
                  >
                    {item.product.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#888880", marginBottom: 12 }}>
                    {fmt(item.product.price)} each
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button className="qty-btn" onClick={() => updateQty(item.product.id, -1)}>−</button>
                    <span style={{ fontSize: 14, minWidth: 20, textAlign: "center", fontWeight: 500 }}>
                      {item.qty}
                    </span>
                    <button className="qty-btn" onClick={() => updateQty(item.product.id, 1)}>+</button>
                  </div>
                </div>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 17,
                    whiteSpace: "nowrap",
                  }}
                >
                  {fmt(item.product.price * item.qty)}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "18px 28px 28px", borderTop: "1px solid #E8E6E0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#888880" }}>
                Total
              </span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 400 }}>
                {fmt(cartTotal)}
              </span>
            </div>
            <button
              className="btn-dark"
              style={{ width: "100%" }}
              onClick={() => { setShowCart(false); onCheckout(); }}
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => setShowCart(false)}
              style={{
                marginTop: 10,
                width: "100%",
                background: "none",
                border: "none",
                fontSize: 11,
                color: "#B0AEA8",
                cursor: "pointer",
                letterSpacing: 1,
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
