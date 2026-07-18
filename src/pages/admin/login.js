import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect straight to admin panel
    const token = localStorage.getItem("admin_token");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Admin Login - Moroccan Crafts</title>
      </Head>
      <div style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(20, 20, 20, 0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 24px 80px rgba(0, 0, 0, 0.5)",
          padding: "40px"
        }}>
          {/* Logo Title */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <span style={{
              fontSize: "14px",
              fontWeight: "700",
              letterSpacing: "0.15em",
              color: "#fff",
              display: "block",
              marginBottom: "4px"
            }}>
              MOROCCAN CRAFTS
            </span>
            <span style={{ fontSize: "11px", color: "#a855f7", fontWeight: "600", textTransform: "uppercase" }}>
              Admin Portal
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {error && (
              <div style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#f87171",
                padding: "12px 16px",
                borderRadius: "12px",
                fontSize: "13px",
                textAlign: "center"
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#aaa", fontWeight: "500" }}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border 0.2s ease",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#a855f7"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", color: "#aaa", fontWeight: "500" }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  padding: "12px 16px",
                  color: "#fff",
                  fontSize: "14px",
                  outline: "none",
                  transition: "border 0.2s ease",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "#a855f7"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "#a855f7",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "14px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "opacity 0.2s ease, transform 0.1s ease",
                marginTop: "10px"
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
              onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
