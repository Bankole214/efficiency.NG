import { useState } from "react";
import toast from "react-hot-toast";

export function useConfirm() {
  const [confirmState, setConfirmState] = useState(null);

  const confirm = (
    message,
    onConfirm,
    onCancel = () => {},
    confirmText = "Confirm",
  ) => {
    const id = toast(
      (t) => (
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: "0 0 12px 0", fontSize: "14px" }}>{message}</p>
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onConfirm();
              }}
              style={{
                background: "#C0392B",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "500",
              }}>
              {confirmText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                onCancel();
              }}
              style={{
                background: "#666",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                fontWeight: "500",
              }}>
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        style: {
          background: "#1C1C1A",
          color: "#F8F7F4",
          borderRadius: "8px",
          padding: "16px",
          maxWidth: "300px",
        },
      },
    );
  };

  return { confirm };
}
