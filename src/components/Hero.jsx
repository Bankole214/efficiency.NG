export default function Hero() {
  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding:
          "clamp(48px,8vw,96px) clamp(20px,4vw,48px) clamp(40px,6vw,64px)",
        borderBottom: "1px solid #E8E6E0",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <p
            style={{
              fontSize: 11,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#C49A6C",
              marginBottom: 16,
              fontWeight: 500,
            }}
          >
            Premium Furniture
          </p>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(40px,8vw,88px)",
              fontWeight: 300,
              lineHeight: 1.02,
              letterSpacing: -1,
              color: "#1C1C1A",
            }}
          >
            Crafted for
            <br />
            <em style={{ color: "#C49A6C" }}>Every Space.</em>
          </h1>
        </div>

        <p
          style={{
            maxWidth: 320,
            fontSize: 14,
            lineHeight: 1.8,
            color: "#888880",
            animation: "fadeUp 0.6s 0.1s ease both",
          }}
        >
          Timeless pieces for the modern home. Each item selected for quality,
          form, and beauty that endures.
        </p>
      </div>
    </section>
  );
}
