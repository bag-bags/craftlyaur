import Head from "next/head";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    header: { brandName: "", brandSuffix: "", tagline: "", quoteText: "" },
    buttons: { buyNow: "", description: "", gallery: "", contact: "" },
    footer: { copyright: "", links: [] },
    stripe: { enabled: false, currency: "usd" }
  });
  
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load CMS content:", err);
        setLoading(false);
      });
  }, []);

  const handleHeaderChange = (field, val) => {
    setContent(prev => ({
      ...prev,
      header: { ...prev.header, [field]: val }
    }));
  };

  const handleButtonsChange = (field, val) => {
    setContent(prev => ({
      ...prev,
      buttons: { ...prev.buttons, [field]: val }
    }));
  };

  const handleFooterChange = (field, val) => {
    setContent(prev => ({
      ...prev,
      footer: { ...prev.footer, [field]: val }
    }));
  };

  const handleStripeChange = (field, val) => {
    setContent(prev => ({
      ...prev,
      stripe: { ...prev.stripe, [field]: val }
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setSaving(true);

    const token = localStorage.getItem("admin_token");

    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update content");

      setSuccessMsg("CMS Content updated successfully!");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ color: "#aaa", fontSize: "14px" }}>Loading content editor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Head>
        <title>Website Editor - Moroccan Crafts</title>
      </Head>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", margin: "0 0 6px" }}>
              CMS Website Editor
            </h1>
            <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>
              Edit header, footer, buttons labels, and toggle Stripe payments integration.
            </p>
          </div>

          <button onClick={handleSave} disabled={saving} style={{
            background: "#a855f7",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "10px 24px",
            fontSize: "13.5px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "opacity 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            {saving ? "Saving..." : "Save Website Changes"}
          </button>
        </div>

        {successMsg && (
          <div style={{ background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.2)", color: "#4ade80", padding: "12px 16px", borderRadius: "12px", fontSize: "13.5px" }}>
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#f87171", padding: "12px 16px", borderRadius: "12px", fontSize: "13.5px" }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* Header CMS Editor */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Header Configuration</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Brand First Name</label>
                <input type="text" value={content.header.brandName} onChange={e => handleHeaderChange("brandName", e.target.value)} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Brand Suffix Name</label>
                <input type="text" value={content.header.brandSuffix} onChange={e => handleHeaderChange("brandSuffix", e.target.value)} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Tagline (e.g. Est. 2026)</label>
                <input type="text" value={content.header.tagline} onChange={e => handleHeaderChange("tagline", e.target.value)} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Quote text</label>
                <input type="text" value={content.header.quoteText} onChange={e => handleHeaderChange("quoteText", e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Buttons CMS Editor */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Button Labels</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Buy Now Button Label</label>
                <input type="text" value={content.buttons.buyNow} onChange={e => handleButtonsChange("buyNow", e.target.value)} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Description Button Label</label>
                <input type="text" value={content.buttons.description} onChange={e => handleButtonsChange("description", e.target.value)} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Gallery Button Label</label>
                <input type="text" value={content.buttons.gallery} onChange={e => handleButtonsChange("gallery", e.target.value)} style={inputStyle} />
              </div>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Contact Us Button Label</label>
                <input type="text" value={content.buttons.contact} onChange={e => handleButtonsChange("contact", e.target.value)} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Stripe Config CMS Editor */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Stripe Payments Configuration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <input
                  type="checkbox"
                  id="stripe-enabled"
                  checked={content.stripe.enabled}
                  onChange={e => handleStripeChange("enabled", e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "#a855f7", cursor: "pointer" }}
                />
                <label htmlFor="stripe-enabled" style={{ fontSize: "14px", fontWeight: "600", color: "#fff", cursor: "pointer" }}>
                  Enable Stripe checkout button for active purchases
                </label>
              </div>
              <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 10px" }}>
                When checked, clicking on "Buy Now" triggers a secure Checkout session redirecting the customer to Stripe hosted payment gateway.
              </p>
              
              <div style={{ ...inputGroupStyle, maxWidth: "240px" }}>
                <label style={labelStyle}>Billing Currency</label>
                <select value={content.stripe.currency} onChange={e => handleStripeChange("currency", e.target.value)} style={inputStyle}>
                  <option value="usd">USD ($)</option>
                  <option value="eur">EUR (€)</option>
                  <option value="mad">MAD (DH)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer CMS Editor */}
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Footer Configuration</h3>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Copyright Line</label>
              <input type="text" value={content.footer.copyright} onChange={e => handleFooterChange("copyright", e.target.value)} style={inputStyle} />
            </div>
          </div>
          
        </form>
      </div>
    </AdminLayout>
  );
}

const sectionStyle = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "20px",
  padding: "32px",
};

const sectionTitleStyle = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#fff",
  margin: "0 0 20px 0"
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px"
};

const labelStyle = {
  fontSize: "12px",
  color: "#aaa",
  fontWeight: "500"
};

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
