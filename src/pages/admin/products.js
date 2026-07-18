import Head from "next/head";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null); // null means adding a new product
  
  // Form fields
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [productUrl, setProductUrl] = useState("");
  const [brand, setBrand] = useState("Moroccan Footwear");
  const [primaryColor, setPrimaryColor] = useState("other");
  const [primaryColorHex, setPrimaryColorHex] = useState("#888888");
  const [description, setDescription] = useState("");
  const [gallery, setGallery] = useState([]);
  
  // Upload states
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const fetchProducts = () => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    
    fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditIndex(null);
    setTitle("");
    setPrice("");
    setImageUrl("");
    setProductUrl("");
    setBrand("Moroccan Footwear");
    setPrimaryColor("other");
    setPrimaryColorHex("#888888");
    setDescription("");
    setGallery([]);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const openEditModal = (index, product) => {
    setEditIndex(index);
    setTitle(product.title);
    setPrice(product.price);
    setImageUrl(product.image_url);
    setProductUrl(product.product_url || "");
    setBrand(product.brand);
    setPrimaryColor(product.primary_color || "other");
    setPrimaryColorHex(product.primary_color_hex || "#888888");
    setDescription(product.description || "");
    setGallery(product.gallery || []);
    setFormError("");
    setFormSuccess("");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e, isGallery = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("admin_token");
    const formData = new FormData();
    formData.append("image", file);

    if (isGallery) setUploadingGallery(true);
    else setUploadingMain(true);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      if (isGallery) {
        setGallery(prev => [...prev, data.url]);
      } else {
        setImageUrl(data.url);
      }
    } catch (err) {
      alert("Upload failed: " + err.message);
    } finally {
      setUploadingGallery(false);
      setUploadingMain(false);
    }
  };

  const removeFromGallery = (urlIdx) => {
    setGallery(prev => prev.filter((_, idx) => idx !== urlIdx));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!title || !price || !imageUrl) {
      setFormError("Title, price and product main image are required");
      return;
    }

    const token = localStorage.getItem("admin_token");
    const body = {
      product: {
        title,
        price,
        image_url: imageUrl,
        product_url: productUrl,
        brand,
        primary_color: primaryColor,
        primary_color_hex: primaryColorHex,
        description,
        gallery
      }
    };

    if (editIndex !== null) {
      body.index = editIndex;
    }

    try {
      const method = editIndex !== null ? "PUT" : "POST";
      const res = await fetch("/api/admin/products", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      setFormSuccess(editIndex !== null ? "Product updated successfully!" : "Product created successfully!");
      fetchProducts();
      setTimeout(() => setIsModalOpen(false), 800);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (index) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("admin_token");

    try {
      const res = await fetch(`/api/admin/products?index=${index}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete product");
      }
      fetchProducts();
    } catch (err) {
      alert("Delete failed: " + err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <Head>
        <title>Manage Products - Moroccan Crafts</title>
      </Head>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header section */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", margin: "0 0 6px" }}>
              Products Manager
            </h1>
            <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>
              Add, update, or remove products displayed in the 3D showcase.
            </p>
          </div>

          <button onClick={openAddModal} style={{
            background: "#a855f7",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 20px",
            fontSize: "13.5px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            + Add New Product
          </button>
        </div>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search products by title or brand..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "12px 16px",
              color: "#fff",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        {/* Product Table */}
        {loading ? (
          <div style={{ color: "#aaa", fontSize: "14px" }}>Loading products catalog...</div>
        ) : (
          <div style={{
            background: "rgba(255,255,255,0.01)",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
            overflow: "hidden"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <th style={{ padding: "16px 20px", color: "#aaa", fontWeight: "500", width: "80px" }}>Image</th>
                  <th style={{ padding: "16px 20px", color: "#aaa", fontWeight: "500" }}>Title</th>
                  <th style={{ padding: "16px 20px", color: "#aaa", fontWeight: "500", width: "180px" }}>Category</th>
                  <th style={{ padding: "16px 20px", color: "#aaa", fontWeight: "500", width: "100px" }}>Price</th>
                  <th style={{ padding: "16px 20px", color: "#aaa", fontWeight: "500", width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: "#fff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", fontWeight: "500", color: "#fff" }}>
                      {p.title}
                    </td>
                    <td style={{ padding: "12px 20px", color: "#aaa" }}>
                      {p.brand.replace("Moroccan ", "")}
                    </td>
                    <td style={{ padding: "12px 20px", fontWeight: "600", color: "#4ade80" }}>
                      {p.price}
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "8px" }}>
                        <button onClick={() => openEditModal(idx, p)} style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "none",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12.5px"
                        }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(idx)} style={{
                          background: "rgba(239,68,68,0.1)",
                          border: "none",
                          color: "#f87171",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontSize: "12.5px"
                        }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Dialog Modal */}
      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px"
        }}>
          <div style={{
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "640px",
            maxHeight: "90vh",
            overflowY: "auto",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "24px"
          }}>
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#fff", margin: 0 }}>
                {editIndex !== null ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{
                background: "transparent",
                border: "none",
                color: "#888",
                fontSize: "24px",
                cursor: "pointer"
              }}>&times;</button>
            </div>

            {formSuccess && <div style={{ color: "#4ade80", fontSize: "14px" }}>{formSuccess}</div>}
            {formError && <div style={{ color: "#f87171", fontSize: "14px" }}>{formError}</div>}

            <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#aaa" }}>Product Title *</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#aaa" }}>Price (e.g. $86) *</label>
                  <input type="text" value={price} onChange={e => setPrice(e.target.value)} required style={inputStyle} />
                </div>
              </div>

              {/* Row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#aaa" }}>Category Collection *</label>
                  <select value={brand} onChange={e => setBrand(e.target.value)} style={inputStyle}>
                    <option value="Moroccan Footwear">Footwear</option>
                    <option value="Moroccan Bags">Bags & Backpacks</option>
                    <option value="Moroccan Home">Baskets & Decor</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#aaa" }}>External Purchase URL (Optional)</label>
                  <input type="text" value={productUrl} onChange={e => setProductUrl(e.target.value)} placeholder="https://www.faire.com/..." style={inputStyle} />
                </div>
              </div>

              {/* Row 3 (Colors) */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#aaa" }}>Primary Color Tag</label>
                  <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} placeholder="black, brown, etc" style={inputStyle} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "12px", color: "#aaa" }}>Color hex value</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input type="color" value={primaryColorHex} onChange={e => setPrimaryColorHex(e.target.value)} style={{ width: "40px", height: "40px", border: "none", background: "transparent", cursor: "pointer" }} />
                    <input type="text" value={primaryColorHex} onChange={e => setPrimaryColorHex(e.target.value)} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#aaa" }}>Product Description</label>
                <textarea rows="4" value={description} onChange={e => setDescription(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
              </div>

              {/* Main Image File Upload */}
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <span style={{ fontSize: "12px", fontWeight: "600", color: "#fff" }}>Main Product Photo</span>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <input type="file" accept="image/*" onChange={e => handleImageUpload(e, false)} style={{ display: "none" }} id="main-photo-upload" />
                  <label htmlFor="main-photo-upload" style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12.5px"
                  }}>
                    {uploadingMain ? "Uploading main photo..." : "Choose Image File"}
                  </label>
                  {imageUrl && <span style={{ fontSize: "11px", color: "#aaa", wordBreak: "break-all" }}>{imageUrl}</span>}
                </div>
              </div>

              {/* Gallery Images List & Upload */}
              <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px dashed rgba(255,255,255,0.1)",
                borderRadius: "12px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#fff" }}>Gallery Images ({gallery.length})</span>
                  <div>
                    <input type="file" accept="image/*" onChange={e => handleImageUpload(e, true)} style={{ display: "none" }} id="gallery-photo-upload" />
                    <label htmlFor="gallery-photo-upload" style={{
                      background: "#a855f7",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "11.5px"
                    }}>
                      {uploadingGallery ? "Uploading..." : "+ Add to Gallery"}
                    </label>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "4px 0" }}>
                  {gallery.map((url, idx) => (
                    <div key={idx} style={{ position: "relative", flexShrink: 0, width: "64px", height: "64px", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button type="button" onClick={() => removeFromGallery(idx)} style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(239,68,68,0.85)",
                        border: "none",
                        color: "#fff",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        cursor: "pointer"
                      }}>&times;</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "12px" }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#aaa",
                  borderRadius: "10px",
                  padding: "10px 20px",
                  cursor: "pointer",
                  fontSize: "13.5px"
                }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  background: "#a855f7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 24px",
                  cursor: "pointer",
                  fontSize: "13.5px",
                  fontWeight: "600"
                }}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

const inputStyle = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box"
};
