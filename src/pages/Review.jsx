export default function Review({ onBackToShop }) {
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
          Customer Reviews
        </h1>
        <p style={{ fontSize: 16, color: "#888880" }}>
          What our customers say about Efficiency Furniture
        </p>
      </div>

      {/* Reviews Grid */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 24,
        }}>
        {[
          {
            name: "Sarah Johnson",
            rating: 5,
            text: "Absolutely love my new dining set! The quality is exceptional and it arrived exactly as described. The delivery team was professional and careful with the furniture.",
            date: "March 2026",
          },
          {
            name: "Michael Adebayo",
            rating: 5,
            text: "I've been shopping at Efficiency Furniture for years. Their customer service is outstanding and their furniture never disappoints. Highly recommend!",
            date: "February 2026",
          },
          {
            name: "Grace Okafor",
            rating: 5,
            text: "The bedroom furniture I purchased exceeded my expectations. Beautiful craftsmanship and very comfortable. Will definitely shop here again.",
            date: "January 2026",
          },
          {
            name: "David Thompson",
            rating: 5,
            text: "Fast delivery and excellent packaging. The sofa is perfect for my living room. Great value for money and the quality is top-notch.",
            date: "December 2025",
          },
          {
            name: "Amara Nwosu",
            rating: 5,
            text: "From selection to delivery, everything was seamless. The team helped me choose the right pieces for my space. Thank you for the amazing experience!",
            date: "November 2025",
          },
          {
            name: "James Wilson",
            rating: 5,
            text: "Outstanding quality furniture at reasonable prices. The attention to detail is impressive. My office chair is both stylish and ergonomic.",
            date: "October 2025",
          },
        ].map((review, i) => (
          <div
            key={i}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 8,
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            }}>
            {/* Rating */}
            <div style={{ marginBottom: 12 }}>
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </div>

            {/* Text */}
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "#1C1C1A",
                marginBottom: 16,
                fontStyle: "italic",
              }}>
              "{review.text}"
            </p>

            {/* Name & Date */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 12,
                color: "#888880",
              }}>
              <span style={{ fontWeight: 500 }}>{review.name}</span>
              <span>{review.date}</span>
            </div>
          </div>
        ))}
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