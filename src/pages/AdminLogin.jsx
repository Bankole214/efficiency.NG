import { useState } from "react";

// ─── ADMIN PASSWORD ───────────────────────────────────────────────────────────
// Change this in the .env file to your preferred admin password
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
// ─────────────────────────────────────────────────────────────────────────────

export default function AdminLogin({ onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setError(false);
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#F8F7F4",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}>
      <div
        style={{
          background: "#fff",
          padding: "48px 40px",
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          animation: "popIn 0.3s ease",
        }}>
        <div
          style={{
            width: 40,
            height: 3,
            background: "#C49A6C",
            marginBottom: 28,
          }}
        />
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 30,
            fontWeight: 400,
            marginBottom: 8,
          }}>
          Admin Panel
        </h2>
        <p
          style={{
            fontSize: 13,
            color: "#888880",
            marginBottom: 28,
            lineHeight: 1.6,
          }}>
          Enter your password to manage your furniture store.
        </p>

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ marginBottom: 8 }}
        />

        {error && (
          <p style={{ color: "#C0392B", fontSize: 12, marginBottom: 12 }}>
            Incorrect password. Please try again.
          </p>
        )}

        <button
          className="btn-dark"
          style={{ width: "100%", marginTop: 8 }}
          onClick={handleLogin}>
          Enter Admin
        </button>

        <button
          onClick={onBack}
          style={{
            marginTop: 16,
            background: "none",
            border: "none",
            fontSize: 12,
            color: "#888880",
            width: "100%",
            cursor: "pointer",
            letterSpacing: 0.5,
          }}>
          ← Return to Shop
        </button>
      </div>
    </div>
  );
}
