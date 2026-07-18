import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }

    // Verify session
    fetch("/api/admin/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("admin_token");
        router.push("/admin/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
        color: "#fff",
        fontFamily: "Inter, sans-serif"
      }}>
        <div style={{ fontSize: "14px", opacity: 0.7 }}>Loading Admin Panel...</div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard Overview", path: "/admin", icon: "📊" },
    { label: "Products Manager", path: "/admin/products", icon: "👜" },
    { label: "CMS Website Editor", path: "/admin/content", icon: "⚙️" },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#0a0a0a",
      color: "#f5f5f5",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Sidebar */}
      <aside style={{
        width: "260px",
        background: "rgba(18, 18, 18, 0.8)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: "4px"
        }}>
          <span style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.1em", color: "#fff" }}>
            MOROCCAN CRAFTS
          </span>
          <span style={{ fontSize: "10px", color: "#a855f7", fontWeight: "600", textTransform: "uppercase" }}>
            Admin Dashboard
          </span>
        </div>

        {/* User Info */}
        <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px",
            height: "36px",
            background: "#a855f7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            color: "#fff",
            fontSize: "14px"
          }}>
            {user?.username?.substring(0, 2).toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "13px", fontWeight: "500", color: "#fff" }}>{user?.username}</span>
            <span style={{ fontSize: "11px", color: "#888", textTransform: "capitalize" }}>{user?.role}</span>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const isActive = router.pathname === item.path;
            return (
              <Link href={item.path} key={item.path} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "10px",
                color: isActive ? "#fff" : "#aaa",
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                textDecoration: "none",
                fontSize: "13.5px",
                fontWeight: isActive ? "600" : "400",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "#aaa";
              }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: "20px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <button onClick={handleLogout} style={{
            width: "100%",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#f87171",
            padding: "10px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "500",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.18)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
          }}
          >
            Logout Session
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        padding: "40px",
        overflowY: "auto",
        maxHeight: "100vh"
      }}>
        {children}
      </main>
    </div>
  );
}
