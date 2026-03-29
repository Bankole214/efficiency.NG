import { useState } from "react";
import { fmt, CATEGORIES } from "../data/products";
import toast from "react-hot-toast";
import { useConfirm } from "../hooks/useConfirm.jsx";
import { useAnalytics } from "../context/AnalyticsContext";
import { addProductToFirestore, updateProductInFirestore, deleteProductFromFirestore } from "../services/productsService";

export default function Admin({
  products,
  onProductsChange,
  onSignOut,
  onViewShop,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Seating",
    desc: "",
    img: "",
    bestSelling: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { confirm } = useConfirm();
  const { analytics, resetVisits } = useAnalytics();

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const setField = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("Image must be less than 5MB.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      setField("img", data.secure_url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Check your Cloudinary credentials.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || !form.img.trim()) {
      toast.error("Please fill in Name, Price, and Image URL.");
      return;
    }
    const price = parseInt(form.price.replace(/[^0-9]/g, ""), 10);
    if (isNaN(price) || price <= 0) {
      toast.error("Please enter a valid price (numbers only).");
      return;
    }

    try {
      if (editingId) {
        await updateProductInFirestore(editingId, { ...form, price });
        onProductsChange(
          products.map((p) =>
            p.id === editingId ? { ...p, ...form, price } : p,
          ),
        );
        toast.success("Product updated successfully!");
      } else {
        const newProduct = { ...form, price };
        const addedProduct = await addProductToFirestore(newProduct);
        onProductsChange([...products, addedProduct]);
        toast.success("Product added to the store!");
      }

      setForm({
        name: "",
        price: "",
        category: "Seating",
        desc: "",
        img: "",
        bestSelling: false,
      });
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
      console.error("Error saving product:", error);
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod.id);
    setForm({
      name: prod.name,
      price: String(prod.price),
      category: prod.category,
      desc: prod.desc || "",
      img: prod.img,
      bestSelling: prod.bestSelling || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      confirm(
        `Are you sure you want to delete "${product.name}"?`,
        async () => {
          try {
            await deleteProductFromFirestore(id);
            onProductsChange(products.filter((p) => p.id !== id));
            toast.success(`"${product.name}" deleted successfully`);
          } catch (error) {
            toast.error("Failed to delete product. Please try again.");
            console.error("Error deleting product:", error);
          }
        },
        undefined,
        "Delete",
      );
    }
  };

  const handleToggleBestSelling = async (id) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      try {
        const newBestSelling = !product.bestSelling;
        await updateProductInFirestore(id, { bestSelling: newBestSelling });
        onProductsChange(
          products.map((p) =>
            p.id === id ? { ...p, bestSelling: newBestSelling } : p,
          ),
        );
        toast.success(
          `"${product.name}" ${newBestSelling ? "marked as" : "removed from"} best selling`,
        );
      } catch (error) {
        toast.error("Failed to update product. Please try again.");
        console.error("Error updating product:", error);
      }
    }
  };

  const handleMarkBestSelling = (id) => {
    handleToggleBestSelling(id);
  };

  const handleSignOut = () => {
    confirm(
      "Are you sure you want to sign out?",
      () => {
        onSignOut();
        toast.success("Signed out successfully");
      },
      undefined,
      "Sign Out",
    );
  };

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: "#F8F7F4",
        minHeight: "100vh",
        color: "#1C1C1A",
      }}>
      {/* Admin Header */}
      <header
        style={{
          background: "#1C1C1A",
          borderBottom: "1px solid #2C2C28",
          padding: "0 clamp(20px,4vw,48px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 68,
          gap: 16,
        }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: 4,
              color: "#F8F7F4",
            }}>
            EFFICIENCY.NG
          </span>
          <span
            style={{
              background: "#C49A6C",
              color: "#fff",
              fontSize: 9,
              letterSpacing: 2,
              padding: "3px 8px",
              textTransform: "uppercase",
            }}>
            Admin
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={onViewShop}
            style={{
              background: "none",
              border: "1px solid #444",
              color: "#aaa",
              padding: "8px 20px",
              fontSize: 11,
              letterSpacing: 1.5,
              cursor: "pointer",
              textTransform: "uppercase",
            }}>
            View Shop
          </button>
          <button
            onClick={handleSignOut}
            style={{
              background: "none",
              border: "none",
              color: "#666",
              fontSize: 11,
              letterSpacing: 1,
              cursor: "pointer",
            }}>
            Sign Out
          </button>
        </div>
      </header>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "clamp(24px,4vw,48px) clamp(16px,4vw,40px)",
        }}>
        {/* Page Title */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(28px,5vw,42px)",
              fontWeight: 400,
            }}>
            Product Management
          </h1>
          <p style={{ fontSize: 13, color: "#888880", marginTop: 6 }}>
            {products.length} {products.length === 1 ? "item" : "items"} in your
            store
          </p>
        </div>

        {/* Form */}
        <div
          style={{
            background: "#fff",
            padding: "clamp(24px,4vw,36px)",
            marginBottom: 40,
            boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 24,
              flexWrap: "wrap",
              gap: 12,
            }}>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 22,
                fontWeight: 400,
              }}>
              {editingId ? "✏️  Edit Product" : "＋  Add New Product"}
            </h3>
            {editingId && (
              <button
                className="btn-outline"
                style={{ padding: "8px 16px", fontSize: 10 }}
                onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}>
            {[
              {
                key: "name",
                label: "Product Name *",
                placeholder: "e.g. Oslo Lounge Chair",
              },
              {
                key: "price",
                label: "Price in ₦ *",
                placeholder: "e.g. 450000",
              },
            ].map((f) => (
              <div key={f.key}>
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
                  className="input-field"
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => setField(f.key, e.target.value)}
                />
              </div>
            ))}

            <div>
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#888880",
                  display: "block",
                  marginBottom: 7,
                }}>
                Category
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setField("category", e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: 10,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "#888880",
                  display: "block",
                  marginBottom: 7,
                }}>
                Product Image *
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "12px 16px",
                  border: "1px solid #E8E6E0",
                  borderRadius: 4,
                  cursor: uploading ? "not-allowed" : "pointer",
                  background: uploading ? "#f5f5f5" : "#fff",
                  fontSize: 12,
                  color: uploading ? "#999" : "#666",
                  transition: "all 0.2s",
                }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  style={{ display: "none" }}
                />
                {uploading ? "Uploading..." : "📁 Choose Image"}
              </label>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <label
              style={{
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: "#888880",
                display: "block",
                marginBottom: 7,
              }}>
              Description
            </label>
            <textarea
              className="input-field"
              value={form.desc}
              rows={3}
              placeholder="Short product description..."
              onChange={(e) => setField("desc", e.target.value)}
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                cursor: "pointer",
                fontSize: 13,
                color: "#1C1C1A",
              }}>
              <input
                type="checkbox"
                checked={form.bestSelling}
                onChange={(e) => setField("bestSelling", e.target.checked)}
                style={{ width: 16, height: 16 }}
              />
              Mark as Best Selling
            </label>
          </div>

          {/* Image preview */}
          {form.img && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 7,
                }}>
                <label
                  style={{
                    fontSize: 10,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: "#888880",
                  }}>
                  Image Preview
                </label>
                <button
                  type="button"
                  onClick={() => setField("img", "")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#C0392B",
                    fontSize: 10,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: 0,
                  }}>
                  Clear Image
                </button>
              </div>
              <img
                src={form.img}
                alt="preview"
                style={{
                  height: 120,
                  objectFit: "cover",
                  border: "1px solid #E8E6E0",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button className="btn-dark" onClick={handleSave}>
              {editingId ? "Save Changes" : "Add to Store"}
            </button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div
          style={{
            background: "#fff",
            padding: "clamp(24px,4vw,36px)",
            marginBottom: 40,
            boxShadow: "0 2px 20px rgba(0,0,0,0.05)",
          }}>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 22,
              fontWeight: 400,
              marginBottom: 24,
            }}>
            📊 Sales Analytics
          </h3>

          {/* Key Metrics */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
              marginBottom: 32,
            }}>
            <div
              style={{
                background: "#F8F7F4",
                padding: 20,
                borderRadius: 8,
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#C49A6C",
                  marginBottom: 4,
                }}>
                {fmt(analytics.totalRevenue)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888880",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                Total Revenue
              </div>
            </div>

            <div
              style={{
                background: "#F8F7F4",
                padding: 20,
                borderRadius: 8,
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#C49A6C",
                  marginBottom: 4,
                }}>
                {analytics.totalSales}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888880",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                Total Sales
              </div>
            </div>

            <div
              style={{
                background: "#F8F7F4",
                padding: 20,
                borderRadius: 8,
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#C49A6C",
                  marginBottom: 4,
                }}>
                {analytics.totalVisits}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888880",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                Total Visits
              </div>
            </div>

            <div
              style={{
                background: "#F8F7F4",
                padding: 20,
                borderRadius: 8,
                textAlign: "center",
              }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  color: "#C49A6C",
                  marginBottom: 4,
                }}>
                ₦
                {analytics.averageOrderValue
                  ? fmt(analytics.averageOrderValue)
                  : "0"}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#888880",
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}>
                Avg Order Value
              </div>
            </div>
          </div>

          {/* Best Selling Products */}
          {analytics.bestSellingProducts.length > 0 && (
            <div style={{ marginBottom: 32 }}>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 16,
                  color: "#1C1C1A",
                }}>
                🏆 Best Selling Products
              </h4>
              <div style={{ display: "grid", gap: 12 }}>
                {analytics.bestSellingProducts
                  .slice(0, 5)
                  .map((product, index) => (
                    <div
                      key={product.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "12px 16px",
                        background: "#F8F7F4",
                        borderRadius: 6,
                      }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}>
                        <div
                          style={{
                            width: 24,
                            height: 24,
                            borderRadius: "50%",
                            background: "#C49A6C",
                            color: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontWeight: 500, fontSize: 14 }}>
                            {product.name}
                          </div>
                          <div style={{ fontSize: 12, color: "#888880" }}>
                            {product.sales}{" "}
                            {product.sales === 1 ? "sale" : "sales"}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}>
                        <div style={{ fontWeight: 600, color: "#C49A6C" }}>
                          ₦{fmt(product.revenue)}
                        </div>
                        <button
                          onClick={() => handleMarkBestSelling(product.id)}
                          style={{
                            background: products.find(
                              (p) => p.id === product.id,
                            )?.bestSelling
                              ? "#C49A6C"
                              : "none",
                            border: products.find((p) => p.id === product.id)
                              ?.bestSelling
                              ? "1px solid #C49A6C"
                              : "1px solid #F0EEE8",
                            padding: "4px 8px",
                            fontSize: 10,
                            color: products.find((p) => p.id === product.id)
                              ?.bestSelling
                              ? "#fff"
                              : "#666",
                            cursor: "pointer",
                            letterSpacing: 0.5,
                            transition: "all 0.2s",
                          }}>
                          {products.find((p) => p.id === product.id)
                            ?.bestSelling
                            ? "Best"
                            : "Mark"}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Revenue by Category */}
          {analytics.revenueByCategory.length > 0 && (
            <div>
              <h4
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  marginBottom: 16,
                  color: "#1C1C1A",
                }}>
                📈 Revenue by Category
              </h4>
              <div style={{ display: "grid", gap: 12 }}>
                {analytics.revenueByCategory.map((category) => (
                  <div
                    key={category.category}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 16px",
                      background: "#F8F7F4",
                      borderRadius: 6,
                    }}>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>
                        {category.category}
                      </div>
                      <div style={{ fontSize: 12, color: "#888880" }}>
                        {category.sales}{" "}
                        {category.sales === 1 ? "sale" : "sales"}
                      </div>
                    </div>
                    <div style={{ fontWeight: 600, color: "#C49A6C" }}>
                      ₦{fmt(category.revenue)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics.totalSales === 0 && (
            <p
              style={{
                fontSize: 14,
                color: "#888880",
                textAlign: "center",
                padding: "32px 0",
              }}>
              No sales data yet. Analytics will appear here once customers make
              purchases.
            </p>
          )}

          {/* Reset Analytics */}
          <div
            style={{
              marginTop: 32,
              paddingTop: 24,
              borderTop: "1px solid #E8E6E0",
              display: "flex",
              gap: 12,
              justifyContent: "center",
            }}>
            <button
              className="btn-outline"
              onClick={() => {
                confirm("Reset visit counter to 0?", () => {
                  resetVisits();
                  toast.success("Visit counter reset to 0");
                });
              }}
              style={{ fontSize: 14 }}>
              Reset Visit Counter
            </button>
          </div>
        </div>

        {/* Product List */}
        <h3
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 22,
            fontWeight: 400,
            marginBottom: 16,
          }}>
          All Products
        </h3>

        <div style={{ display: "grid", gap: 10 }}>
          {products.map((prod) => (
            <div
              key={prod.id}
              style={{
                background: "#fff",
                padding: "18px 24px",
                display: "flex",
                alignItems: "center",
                gap: 18,
                boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
              }}>
              <img
                src={prod.img}
                alt={prod.name}
                style={{
                  width: 64,
                  height: 64,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/64x64?text=No+Img";
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: 15,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                  {prod.name}
                </div>
                <div style={{ fontSize: 12, color: "#888880", marginTop: 3 }}>
                  {prod.category} • {fmt(prod.price)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button
                  className="btn-outline"
                  style={{ padding: "7px 18px", fontSize: 10 }}
                  onClick={() => handleEdit(prod)}>
                  Edit
                </button>
                <button
                  onClick={() => handleToggleBestSelling(prod.id)}
                  style={{
                    background: prod.bestSelling ? "#C49A6C" : "none",
                    border: prod.bestSelling
                      ? "1px solid #C49A6C"
                      : "1px solid #F0EEE8",
                    padding: "7px 14px",
                    fontSize: 10,
                    color: prod.bestSelling ? "#fff" : "#666",
                    cursor: "pointer",
                    letterSpacing: 0.5,
                    transition: "all 0.2s",
                  }}>
                  {prod.bestSelling ? "Best Selling" : "Mark Best"}
                </button>
                <button
                  onClick={() => handleDelete(prod.id)}
                  style={{
                    background: "none",
                    border: "1px solid #F0EEE8",
                    padding: "7px 14px",
                    fontSize: 10,
                    color: "#C0392B",
                    cursor: "pointer",
                    letterSpacing: 0.5,
                    transition: "all 0.2s",
                  }}>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <p
              style={{
                fontSize: 14,
                color: "#888880",
                padding: "32px 0",
                textAlign: "center",
              }}>
              No products yet. Add your first product above.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
