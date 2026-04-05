import { useState } from "react";
import { fmt } from "../data/products";
import toast from "react-hot-toast";
import { useConfirm } from "../hooks/useConfirm.jsx";
import { useAnalytics } from "../context/AnalyticsContext";
import { addProductToFirestore, updateProductInFirestore, deleteProductFromFirestore } from "../services/productsService";
import { addCategoryToFirestore, deleteCategoryFromFirestore } from "../services/categoryService";

export default function Admin({
  products,
  onProductsChange,
  categories,
  onCategoriesChange,
  onSignOut,
  onViewShop,
}) {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: categories?.[0]?.name || "Other",
    desc: "",
    imgs: [],
    bestSelling: false,
  });
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isAddingCat, setIsAddingCat] = useState(false);
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
      setForm(f => ({ ...f, imgs: [...f.imgs, data.secure_url] }));
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload image. Check your Cloudinary credentials.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setForm(f => ({
      ...f,
      imgs: f.imgs.filter((_, i) => i !== index)
    }));
    toast.success("Image removed");
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.price || form.imgs.length === 0) {
      toast.error("Please fill in Name, Price, and add at least one image.");
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
        imgs: [],
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
      imgs: prod.imgs || (prod.img ? [prod.img] : []),
      bestSelling: prod.bestSelling || false,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({
      name: "",
      price: "",
      category: "Seating",
      desc: "",
      imgs: [],
      bestSelling: false,
    });
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

  const handleAddCategory = async () => {
    if (!newCatName.trim()) return;
    const trimmedNameLower = newCatName.trim().toLowerCase();
    
    if (trimmedNameLower === "other") {
        toast.error("The 'Other' category is already present as a fallback.");
        return;
    }
    if (categories.find(c => c.name.toLowerCase() === trimmedNameLower)) {
        toast.error("Category already exists");
        return;
    }
    setIsAddingCat(true);
    try {
        const addedCat = await addCategoryToFirestore(newCatName.trim());
        onCategoriesChange([...categories, addedCat]);
        setNewCatName("");
        toast.success(`Category "${addedCat.name}" added`);
    } catch (error) {
        toast.error("Failed to add category");
    } finally {
        setIsAddingCat(false);
    }
  };

  const handleDeleteCategory = (cat) => {
    if (cat.name.toLowerCase() === "other") {
        toast.error("Cannot delete the 'Other' fallback category");
        return;
    }
    confirm(
        `Are you sure you want to delete category "${cat.name}"? Products in this category will be moved to "Other".`,
        async () => {
            try {
                await deleteCategoryFromFirestore(cat.id, cat.name, products, onProductsChange);
                onCategoriesChange(categories.filter(c => c.id !== cat.id));
                toast.success(`Category "${cat.name}" deleted`);
            } catch (error) {
                toast.error("Failed to delete category");
            }
        },
        undefined,
        "Delete Category"
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              flexShrink: 0,
            }}>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: 4,
                color: "#F8F7F4",
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
                    background: "#F8F7F4",
                  }}
                />
              </span>
              Y
            </div>
            <div
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: 2,
                color: "#888880",
                marginTop: 0,
              }}>
              FURNITURE
            </div>
          </div>
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
              color: "#F8F7F4",
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
              color: "#F8F7F4",
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
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
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
                Product Images * ({form.imgs.length} uploaded)
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
                {uploading ? "Uploading..." : "📁 Add Image"}
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

          {/* Image preview gallery */}
          {form.imgs.length > 0 && (
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
                  Image Gallery ({form.imgs.length})
                </label>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                  gap: 12,
                  marginBottom: 12,
                }}>
                {form.imgs.map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      paddingBottom: "100%",
                      background: "#f5f5f5",
                      border: "1px solid #E8E6E0",
                      borderRadius: 4,
                      overflow: "hidden",
                    }}>
                    <img
                      src={img}
                      alt={`preview-${idx}`}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      style={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        background: "rgba(192, 57, 43, 0.9)",
                        border: "none",
                        color: "#fff",
                        width: 20,
                        height: 20,
                        fontSize: 12,
                        cursor: "pointer",
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => e.target.style.background = "#C0392B"}
                      onMouseLeave={(e) => e.target.style.background = "rgba(192, 57, 43, 0.9)"}
                      title="Remove image">
                        ×
                      </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 20 }}>
            <button className="btn-dark" onClick={handleSave}>
              {editingId ? "Save Changes" : "Add to Store"}
            </button>
          </div>
        </div>

        {/* Category Management */}
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
            🏷️  Category Management
          </h3>

          <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
            <input
              className="input-field"
              placeholder="New category name..."
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <button 
                className="btn-dark" 
                style={{ width: "auto", whiteSpace: "nowrap" }}
                onClick={handleAddCategory}
                disabled={isAddingCat}
            >
                {isAddingCat ? "Adding..." : "Add Category"}
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                style={{
                  background: "#F8F7F4",
                  border: "1px solid #E8E6E0",
                  padding: "6px 12px",
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                }}>
                <span>{cat.name}</span>
                {cat.name !== "Other" && (
                    <button
                        onClick={() => handleDeleteCategory(cat)}
                        style={{
                            background: "none",
                            border: "none",
                            color: "#888880",
                            cursor: "pointer",
                            fontSize: 14,
                            padding: "0 4px",
                        }}
                        title="Delete category"
                    >
                        ✕
                    </button>
                )}
              </div>
            ))}
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
                src={prod.imgs?.[0] || prod.img || "https://via.placeholder.com/64x64?text=No+Img"}
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
