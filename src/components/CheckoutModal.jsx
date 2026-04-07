import { useRef, useState } from "react";
import { fmt } from "../data/products";
import { useCart } from "../context/CartContext";
import { useAnalytics } from "../context/AnalyticsContext";
import toast from "react-hot-toast";
import PaymentPlanSelector from "./PaymentPlanSelector";
import { PaymentPlan, OrderStatus, PaymentStatus, initiatePayment, createOrder } from "../services/orderService";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;


export default function CheckoutModal({ open, onClose, onSuccess }) {
  const { cart, cartTotal, clearCart } = useCart();
  const { trackPurchase } = useAnalytics();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [showReceipt, setShowReceipt] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentPlan, setPaymentPlan] = useState(PaymentPlan.FULL);
  const receiptRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!open) return null;

  const isValid = form.name.trim() && form.email.trim() && form.phone.trim() && form.address.trim();

  const handlePay = () => {
    if (!isValid) return;
    if (!window.PaystackPop) {
      toast.error(
        "Payment widget is still loading. Please wait a moment and try again.",
      );
      return;
    }
    const orderRef = "FNS_" + Date.now();
    const chargeAmount = initiatePayment(cartTotal, paymentPlan);

    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: form.email,
      amount: chargeAmount * 100,
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
        const processOrder = async () => {
          trackPurchase(cart, {
            name: form.name,
            email: form.email,
            phone: form.phone,
          });

          const order = {
            ref: orderRef,
            customer: form,
            items: cart,
            total: cartTotal,
            amountPaid: chargeAmount,
            balanceDue: cartTotal - chargeAmount,
            paymentPlan,
            paymentStatus: paymentPlan === PaymentPlan.FULL ? PaymentStatus.PAID : PaymentStatus.PARTIAL,
            status: OrderStatus.PENDING,
          };

          try {
            const savedOrder = await createOrder(order);
            setOrderDetails({ ...savedOrder, date: new Date().toLocaleString() });
            setShowReceipt(true);
    
            clearCart();
            setForm({ name: "", email: "", phone: "", address: "" });
            setPaymentPlan(PaymentPlan.FULL);
            onSuccess();
          } catch (error) {
            toast.error("Payment successful, but failed to save order. Support will contact you.");
          }
        };
        processOrder();
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
        
        {/* Close Button "X" */}
        <button
          onClick={() => {
            setShowReceipt(false);
            onClose();
          }}
          style={{
            position: "absolute",
            top: 24,
            right: 24,
            background: "none",
            border: "none",
            fontSize: 24,
            color: "#888880",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 32,
            height: 32,
            transition: "color 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1C1A")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#888880")}
          aria-label="Close modal">
          ×
        </button>

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
              <div style={{ marginBottom: 12 }}>
                <strong>Delivery Address:</strong> {orderDetails?.customer.address}
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
                <span style={{ fontSize: 13, color: "#888880" }}>Subtotal</span>
                <span>{fmt(orderDetails?.total)}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                }}>
                <span style={{ fontSize: 13, color: "#888880" }}>Outstanding Balance</span>
                <span style={{ color: orderDetails?.balanceDue > 0 ? "#C0392B" : "#27AE60", fontWeight: 500 }}>
                  {orderDetails?.balanceDue > 0 ? fmt(orderDetails?.balanceDue) : "₦0"}
                </span>
              </div>

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
                  Amount Paid
                </span>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: 20,
                    fontWeight: 500,
                  }}>
                  {fmt(orderDetails?.amountPaid)}
                </span>
              </div>
            </div>

            <button
              className="btn-dark"
              style={{ width: "100%", marginBottom: 12 }}
              onClick={() => {
                if (!receiptRef.current) return;
                
                // Get the HTML content of the receipt
                const receiptHtml = receiptRef.current.innerHTML;
                
                // Open a new window
                const printWindow = window.open('', '_blank', 'width=800,height=900');
                
                // Write the receipt HTML into the new window with print-specific styling
                printWindow.document.write(`
                  <html>
                    <head>
                      <title>Receipt - ${orderDetails?.ref || 'Order'}</title>
                      <style>
                        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
                        
                        body {
                          font-family: 'DM Sans', sans-serif;
                          color: #1C1C1A;
                          background: #fff;
                          margin: 0;
                          padding: 40px;
                        }
                        @media print {
                          body { padding: 0; }
                          @page { margin: 20mm; }
                        }
                      </style>
                    </head>
                    <body>
                      ${receiptHtml}
                      <script>
                        setTimeout(() => {
                          window.print();
                          window.close();
                        }, 500);
                      </script>
                    </body>
                  </html>
                `);
                
                printWindow.document.close();
              }}>
              📥 Save Receipt as PDF
            </button>

            <button
              className="btn-outline"
              style={{ width: "100%" }}
              onClick={() => {
                setShowReceipt(false);
                onClose();
              }}>
              Continue Shopping
            </button>

            <div
              ref={receiptRef}
              style={{ display: "none" }}>
              <div
                style={{
                  width: "100%",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}>
                {/* Receipt Header / Logo */}
                <div style={{ textAlign: "center", marginBottom: "40px", borderBottom: "2px solid #E8E6E0", paddingBottom: "32px" }}>
                  <div
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "32px",
                      fontWeight: 600,
                      letterSpacing: "6px",
                      color: "#1C1C1A",
                      marginBottom: "8px",
                    }}>
                    E<span style={{ textDecoration: "underline", textDecorationThickness: "1px", textUnderlineOffset: "4px" }}>FFICIENC</span>Y
                  </div>
                  <div style={{ fontSize: "11px", letterSpacing: "3px", color: "#888880", textTransform: "uppercase" }}>
                    Furniture
                  </div>
                </div>

                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 500, textAlign: "center", marginBottom: "32px" }}>
                  Official Receipt
                </h1>

                {/* Order Info */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px", fontSize: "14px" }}>
                  <div>
                    <div style={{ color: "#888880", marginBottom: "4px" }}>Date</div>
                    <div style={{ fontWeight: 500 }}>{orderDetails?.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#888880", marginBottom: "4px" }}>Order ID</div>
                    <div style={{ fontWeight: 500 }}>{orderDetails?.ref}</div>
                  </div>
                </div>

                {/* Customer Info */}
                <div style={{ background: "#fff", border: "1px solid #E8E6E0", padding: "24px", borderRadius: "4px", marginBottom: "32px" }}>
                  <h3 style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#888880", marginBottom: "16px", marginTop: 0 }}>
                    Billed To
                  </h3>
                  <div style={{ fontSize: "15px", fontWeight: 500, marginBottom: "8px" }}>{orderDetails?.customer.name}</div>
                  <div style={{ fontSize: "14px", color: "#555", marginBottom: "4px" }}>{orderDetails?.customer.email}</div>
                  <div style={{ fontSize: "14px", color: "#555", marginBottom: "4px" }}>{orderDetails?.customer.phone}</div>
                  <div style={{ fontSize: "14px", color: "#555" }}>{orderDetails?.customer.address}</div>
                </div>

                {/* Items Table */}
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", borderBottom: "1px solid #1C1C1A", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div style={{ flex: 1, fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#888880" }}>Description</div>
                    <div style={{ width: "80px", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#888880", textAlign: "right" }}>Qty</div>
                    <div style={{ width: "120px", fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#888880", textAlign: "right" }}>Amount</div>
                  </div>
                  {orderDetails?.items.map((item) => (
                    <div key={item.product.id} style={{ display: "flex", marginBottom: "16px", fontSize: "14px" }}>
                      <div style={{ flex: 1, fontWeight: 500 }}>{item.product.name}</div>
                      <div style={{ width: "80px", textAlign: "right", color: "#555" }}>{item.qty}</div>
                      <div style={{ width: "120px", textAlign: "right", fontWeight: 500 }}>{fmt(item.product.price * item.qty)}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ marginLeft: "auto", borderTop: "1px solid #E8E6E0", paddingTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
                    <span style={{ color: "#888880" }}>Subtotal</span>
                    <span>{fmt(orderDetails?.total)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px", fontSize: "14px" }}>
                    <span style={{ color: "#888880" }}>Outstanding Balance</span>
                    <span style={{ color: orderDetails?.balanceDue > 0 ? "#C0392B" : "#27AE60", fontWeight: 500 }}>
                      {orderDetails?.balanceDue > 0 ? fmt(orderDetails?.balanceDue) : "₦0"}
                    </span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "16px", paddingTop: "16px", borderTop: "2px solid #1C1C1A" }}>
                    <span style={{ fontSize: "14px", fontWeight: 600 }}>Amount Paid</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 600, color: "#C49A6C" }}>
                      {fmt(orderDetails?.amountPaid)}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ marginTop: "64px", paddingTop: "32px", borderTop: "1px solid #E8E6E0", textAlign: "center" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontStyle: "italic", marginBottom: "16px", marginTop: 0 }}>
                    Thank you for shopping with us!
                  </p>
                  <div style={{ fontSize: "12px", color: "#888880" }}>
                    123 Efficiency Boulevard, Lagos, Nigeria • support@efficiency.com • +234 800 000 0000
                  </div>
                </div>
              </div>
            </div>
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
              {
                key: "address",
                label: "Delivery Address",
                placeholder: "123 Main St, Lagos",
                type: "text",
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

            {/* Payment Plan Selector */}
            <PaymentPlanSelector 
              selectedPlan={paymentPlan} 
              onChange={setPaymentPlan} 
              total={cartTotal} 
            />

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
                  Subtotal
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
              Pay {fmt(initiatePayment(cartTotal, paymentPlan))} with Paystack
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
