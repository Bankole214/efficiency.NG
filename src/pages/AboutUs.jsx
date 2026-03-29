export default function AboutUs({ onBackToShop }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8F7F4",
        padding: "clamp(20px,4vw,48px)",
      }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 36,
            fontWeight: 400,
            marginBottom: 8,
          }}>
          About Efficiency.NG
        </h1>
        <p style={{ fontSize: 16, color: "#888880" }}>
          Crafting timeless furniture for modern living
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {/* Mission */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 16,
              color: "#1C1C1A",
            }}>
            Our Mission
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#444440" }}>
            At Efficiency.NG, we believe that furniture should be more than just
            functional—it should be beautiful, durable, and timeless. Founded
            with a passion for quality craftsmanship, we curate a collection of
            furniture that combines modern design with traditional techniques.
            Every piece in our store is carefully selected to ensure it meets
            our high standards for quality, comfort, and style.
          </p>
        </section>

        {/* Story */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 16,
              color: "#1C1C1A",
            }}>
            Our Story
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#444440" }}>
            What started as a small passion project has grown into Nigeria's
            premier destination for contemporary furniture. We work directly
            with skilled artisans and trusted manufacturers to bring you pieces
            that tell a story of craftsmanship and care. Our journey began with
            a simple idea: make beautiful, affordable furniture accessible to
            everyone who appreciates quality design.
          </p>
        </section>

        {/* Values */}
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 24,
              color: "#1C1C1A",
            }}>
            Our Values
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: 24,
            }}>
            {[
              {
                title: "Quality First",
                desc: "We never compromise on quality. Every piece undergoes rigorous inspection before reaching our customers.",
              },
              {
                title: "Sustainable Practices",
                desc: "We're committed to environmentally responsible sourcing and production methods.",
              },
              {
                title: "Customer Satisfaction",
                desc: "Your satisfaction is our priority. We stand behind every purchase with excellent service.",
              },
              {
                title: "Design Excellence",
                desc: "We believe good design should be accessible. Our curated collection represents the best in modern furniture.",
              },
            ].map((value, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  padding: 24,
                  borderRadius: 8,
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                }}>
                <h3
                  style={{
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: "#1C1C1A",
                  }}>
                  {value.title}
                </h3>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.6,
                    color: "#666660",
                  }}>
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section style={{ textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 28,
              fontWeight: 400,
              marginBottom: 16,
              color: "#1C1C1A",
            }}>
            Get in Touch
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#444440" }}>
            Have questions about our products or need design advice? We'd love
            to hear from you. Reach out through our contact form, WhatsApp, or
            visit us on Instagram.
          </p>
        </section>
      </div>

      {/* Back Button */}
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <button
          onClick={onBackToShop}
          className="btn-outline"
          style={{ fontSize: 14 }}>
          ← Back to Shop
        </button>
      </div>
    </div>
  );
}