import { useState } from "react";
import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAnalytics } from "../context/AnalyticsContext";
import toast from "react-hot-toast";

// ─── PAYSTACK KEY ────────────────────────────────────────────────────────────
// Replace the value in .env file with your Paystack public key.
// Get it from: https://dashboard.paystack.com/#/settings/developer
const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
// ─────────────────────────────────────────────────────────────────────────────

export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { trackPurchase } = useAnalytics();
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  if (!open) return null;

  const isValid = form.name.trim() && form.email.trim() && form.phone.trim();

  const handlePay = () => {
    if (!isValid) return;
    if (!window.PaystackPop) {
      toast.error(
        "Payment widget is still loading. Please wait a moment and try again.",
      );
      return;
    }
    const orderRef = "FNS_" + Date.now();
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: cartTotal * 100, // Paystack expects kobo
      currency: "NGN",
      ref: orderRef,
      metadata: {
        custom_fields: [
          {
            display_name: "Customer Name",
            variable_name: "customer_name",
            value: form.name,
          },
          { display_name: "Phone", variable_name: "phone", value: form.phone },
        ],
      },
      callback: () => {
        // Track the purchase for analytics
        trackPurchase(cart, {
          name: form.name,
          email: form.email,
          phone: form.phone,
        });

        // Prepare order details for receipt
        const order = {
          ref: orderRef,
          date: new Date().toLocaleString(),
          customer: form,
          items: cart,
          total: cartTotal,
        };
        setOrderDetails(order);
        setShowReceipt(true);

        clearCart();
        setForm({ name: "", email: "", phone: "" });
        onSuccess();
      },
      onClose: () => {},
    });
    handler.openIframe();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}>
      {/* Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.5)",
          animation: "fadeIn 0.25s",
        }}
        onClick={() => {
          if (showReceipt) {
            setShowReceipt(false);
            onClose();
          } else {
            onClose();
          }
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "relative",
          background: "#fff",
          width: "100%",
          maxWidth: 460,
          padding: "clamp(28px,5vw,44px)",
          animation: "popIn 0.3s ease",
          maxHeight: "90vh",
          overflowY: "auto",
        }}>
        <div
          style={{
            width: 32,
            height: 3,
            background: "#C49A6C",
            marginBottom: 24,
          }}
        />
        {showReceipt ? (
          <>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                fontWeight: 400,
                marginBottom: 6,
              }}>
              Order Confirmed
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#888880",
                marginBottom: 28,
                lineHeight: 1.6,
              }}>
              Thank you for your purchase! Here's your order confirmation.
            </p>

            <div
              style={{
                background: "#F8F7F4",
                padding: "16px 18px",
                marginBottom: 24,
              }}>
              <div style={{ marginBottom: 12 }}>
                <strong>Order ID:</strong> {orderDetails?.ref}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Date:</strong> {orderDetails?.date}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Customer:</strong> {orderDetails?.customer.name}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Email:</strong> {orderDetails?.customer.email}
              </div>
              <div style={{ marginBottom: 12 }}>
                <strong>Phone:</strong> {orderDetails?.customer.phone}
              </div>
            </div>

            <div
              style={{
                background: "#F8F7F4",
                padding: "16px 18px",
                marginBottom: 24,
              }}>
              <h3 style={{ marginBottom: 12, fontSize: 16 }}>Order Items</h3>
              {orderDetails?.items.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 6,
                    color: "#888880",
                  }}>
                  <span>
                    {item.product.name} × {item.qty}
                  </span>
                  <span>{fmt(item.product.price * item.qty)}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  marginTop: 8,
                  borderTop: "1px solid #E8E6E0",
                }}>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#888880",
                  }}>
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                  }}>
                  {fmt(orderDetails?.total)}
                </span>
              </div>
            </div>

            <button
              className="btn-dark"
              style={{ width: "100%" }}
              onClick={() => {
                setShowReceipt(false);
                onClose();
              }}>
              Continue Shopping
            </button>
          </>
        ) : (
          <>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 30,
                fontWeight: 400,
                marginBottom: 6,
              }}>
              Checkout
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "#888880",
                marginBottom: 28,
                lineHeight: 1.6,
              }}>
              Enter your details. You'll be securely redirected to Paystack to
              complete your payment.
            </p>

            {/* Fields */}
            {[
              {
                key: "name",
                label: "Full Name",
                placeholder: "Chidi Okonkwo",
                type: "text",
              },
              {
                key: "email",
                label: "Email Address",
                placeholder: "you@example.com",
                type: "email",
              },
              {
                key: "phone",
                label: "Phone Number",
                placeholder: "+234 800 000 0000",
                type: "tel",
              },
            ].map((f) => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#888880",
                    display: "block",
                    marginBottom: 7,
                  }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  className="input-field"
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}

            {/* Order Summary */}
            <div
              style={{
                background: "#F8F7F4",
                padding: "16px 18px",
                margin: "8px 0 24px",
              }}>
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 6,
                    color: "#888880",
                  }}>
                  <span>
                    {item.product.name} × {item.qty}
                  </span>
                  <span>{fmt(item.product.price * item.qty)}</span>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  marginTop: 8,
                  borderTop: "1px solid #E8E6E0",
                }}>
                <span
                  style={{
                    fontSize: 11,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#888880",
                  }}>
                  Total
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                  }}>
                  {fmt(cartTotal)}
                </span>
              </div>
            </div>

            {!isValid && (
              <p style={{ fontSize: 12, color: "#C49A6C", marginBottom: 12 }}>
                Please fill in all fields to continue.
              </p>
            )}

            <button
              className="btn-dark"
              style={{ width: "100%", opacity: isValid ? 1 : 0.5 }}
              onClick={handlePay}>
              Pay {fmt(cartTotal)} with Paystack
            </button>

            <button
              onClick={onClose}
              style={{
                marginTop: 12,
                width: "100%",
                background: "none",
                border: "none",
                fontSize: 11,
                color: "#B0AEA8",
                cursor: "pointer",
                letterSpacing: 1,
              }}>
              Cancel
            </button>

            <p
              style={{
                fontSize: 11,
                color: "#C0BEBA",
                marginTop: 20,
                textAlign: "center",
                lineHeight: 1.6,
              }}>
              🔒 Payments are processed securely by Paystack. Your card details
              are never stored.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
