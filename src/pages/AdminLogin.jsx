import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function AdminLogin({ onSuccess, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      onSuccess();
    } catch (err) {
      switch (err.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setError("Incorrect email or password.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        default:
          setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
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
        {/* Logo */}
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
          Sign in to manage your furniture store.
        </p>

        {/* Email */}
        <input
          type="email"
          className="input-field"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{ marginBottom: 12 }}
          autoComplete="email"
        />

        {/* Password */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <input
            type={showPassword ? "text" : "password"}
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{ paddingRight: 40 }}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#888880",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        </div>

        {error && (
          <p style={{ color: "#C0392B", fontSize: 12, marginBottom: 12 }}>
            {error}
          </p>
        )}

        <button
          className="btn-dark"
          style={{ width: "100%", marginTop: 8, opacity: loading ? 0.7 : 1 }}
          onClick={handleLogin}
          disabled={loading}>
          {loading ? "Signing in…" : "Enter Admin"}
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
