import Head from "next/head";
import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: {},
    usersCount: 0,
  });
  
  // Registration Form State
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;

    // Fetch products
    fetch("/api/admin/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((products) => {
        const categories = {};
        products.forEach((p) => {
          categories[p.brand] = (categories[p.brand] || 0) + 1;
        });
        setStats((prev) => ({
          ...prev,
          totalProducts: products.length,
          categories,
        }));
      })
      .catch(console.error);
  }, []);

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    setRegSuccess("");
    setRegError("");
    setRegLoading(true);

    const token = localStorage.getItem("admin_token");

    try {
      const res = await fetch("/api/admin/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: regUsername,
          password: regPassword,
          role: "admin",
        }),
      });

      const data = await res.ok ? await res.json() : null;

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to create user");
      }

      setRegSuccess(`Successfully registered new admin user "${regUsername}"!`);
      setRegUsername("");
      setRegPassword("");
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Dashboard Overview - Moroccan Crafts</title>
      </Head>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {/* Header */}
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#fff", margin: "0 0 6px" }}>
            Overview
          </h1>
          <p style={{ fontSize: "14px", color: "#aaa", margin: 0 }}>
            Quick overview stats of your products, content, and team members.
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px"
        }}>
          {/* Card 1 */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "16px",
            padding: "24px",
          }}>
            <div style={{ fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px" }}>
              Total Products Loaded
            </div>
            <div style={{ fontSize: "36px", fontWeight: "700", color: "#fff" }}>
              {stats.totalProducts}
            </div>
          </div>

          {/* Card 2 */}
          {Object.entries(stats.categories).map(([category, count]) => (
            <div key={category} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "16px",
              padding: "24px",
            }}>
              <div style={{ fontSize: "12px", color: "#888", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {category.replace("Moroccan ", "")}
              </div>
              <div style={{ fontSize: "36px", fontWeight: "700", color: "#fff" }}>
                {count}
              </div>
            </div>
          ))}
        </div>

        {/* Multi-User Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px",
          marginTop: "12px"
        }}>
          {/* Register User Form */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            padding: "32px",
          }}>
            <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", margin: "0 0 8px" }}>
              Add New Admin User
            </h3>
            <p style={{ fontSize: "13px", color: "#aaa", margin: "0 0 24px" }}>
              Create a new user account with administrative permissions to manage the store.
            </p>

            <form onSubmit={handleRegisterUser} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {regSuccess && (
                <div style={{
                  background: "rgba(34, 197, 94, 0.1)",
                  border: "1px solid rgba(34, 197, 94, 0.2)",
                  color: "#4ade80",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}>
                  {regSuccess}
                </div>
              )}

              {regError && (
                <div style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#f87171",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  fontSize: "13px",
                }}>
                  {regError}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#aaa" }}>Username</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Username"
                  required
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", color: "#aaa" }}>Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Password"
                  required
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    padding: "10px 14px",
                    color: "#fff",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={regLoading}
                style={{
                  background: "#a855f7",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px",
                  fontSize: "13.5px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "opacity 0.2s ease",
                  marginTop: "8px"
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
                onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
              >
                {regLoading ? "Creating account..." : "Register Account"}
              </button>
            </form>
          </div>

          {/* Quick tips panel */}
          <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#fff", margin: "0 0 12px" }}>
                Stripe Payments Status
              </h3>
              <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#aaa", margin: "0 0 16px" }}>
                To enable Stripe checkout for customers, turn on the Checkout integration inside the **CMS Website Editor** tab.
              </p>
              <p style={{ fontSize: "13.5px", lineHeight: "1.6", color: "#aaa", margin: 0 }}>
                Ensure your Stripe secret and publishable keys are fully configured in the server environment configuration file (`.env.local`).
              </p>
            </div>

            <div style={{
              background: "rgba(168, 85, 247, 0.08)",
              border: "1px solid rgba(168, 85, 247, 0.15)",
              borderRadius: "12px",
              padding: "16px",
              marginTop: "24px"
            }}>
              <span style={{ fontSize: "13px", fontWeight: "600", color: "#c084fc", display: "block", marginBottom: "4px" }}>
                Stripe Credentials:
              </span>
              <code style={{ fontSize: "11px", color: "#e9d5ff", wordBreak: "break-all" }}>
                STRIPE_SECRET_KEY / NEXT_PUBLIC_STRIPE_KEY
              </code>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
