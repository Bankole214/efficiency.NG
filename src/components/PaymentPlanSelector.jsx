import React from 'react';
import { fmt } from '../data/products';
import { PaymentPlan } from '../services/orderService';

export default function PaymentPlanSelector({ selectedPlan, onChange, total }) {
  const depositAmount = total * 0.8;

  return (
    <div style={{ marginBottom: 24 }}>
      <label
        style={{
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          color: "#888880",
          display: "block",
          marginBottom: 12,
        }}>
        Select Payment Plan
      </label>
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Full Payment Option */}
        <div
          onClick={() => onChange(PaymentPlan.FULL)}
          style={{
            border: `1px solid ${selectedPlan === PaymentPlan.FULL ? "#C49A6C" : "#E8E6E0"}`,
            background: selectedPlan === PaymentPlan.FULL ? "#FAF8F5" : "#fff",
            padding: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease"
          }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1A", marginBottom: 4 }}>
              Full Payment
            </div>
            <div style={{ fontSize: 12, color: "#888880" }}>
              Pay the total amount now
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#C49A6C" }}>
            {fmt(total)}
          </div>
        </div>

        {/* 80% Deposit Option */}
        <div
          onClick={() => onChange(PaymentPlan.DEPOSIT)}
          style={{
            border: `1px solid ${selectedPlan === PaymentPlan.DEPOSIT ? "#C49A6C" : "#E8E6E0"}`,
            background: selectedPlan === PaymentPlan.DEPOSIT ? "#FAF8F5" : "#fff",
            padding: "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            transition: "all 0.2s ease"
          }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "#1C1C1A", marginBottom: 4 }}>
              80% Deposit
            </div>
            <div style={{ fontSize: 12, color: "#888880" }}>
              Pay 80% now, pay {fmt(total * 0.2)} on delivery
            </div>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#C49A6C" }}>
            {fmt(depositAmount)}
          </div>
        </div>
      </div>
    </div>
  );
}
