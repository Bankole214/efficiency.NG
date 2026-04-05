import { useState } from "react";

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
            marginBottom: 32,
          }}>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 24,
              fontWeight: 500,
              letterSpacing: 4,
              color: "#1C1C1A",
              position: "relative",
              paddingBottom: 6,
            }}>
            E
            <span style={{ position: "relative" }}>
              FFICIENC
              <span
                style={{
                  position: "absolute",
                  bottom: -3,
                  left: 0,
                  right: 0,
                  height: 1,
                  background: "#1C1C1A",
                }}
              />
            </span>
            Y
          </div>
          <div
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 2,
              color: "#AAA",
              marginTop: 0,
            }}>
            FURNITURE
          </div>
        </div>
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
