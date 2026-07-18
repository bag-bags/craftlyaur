import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function SuccessPage() {
  const router = useRouter();
  const { session_id } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session_id) {
      setLoading(false);
    }
  }, [session_id]);

  return (
    <>
      <Head>
        <title>Order Complete - Moroccan Crafts</title>
      </Head>
      <div style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at center, #ffffff 0%, #f4f4f4 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"
      }}>
        <div style={{
          maxWidth: "460px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "24px",
          padding: "40px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.5)",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.05)"
        }}>
          {/* Animated Success Check */}
          <div style={{
            width: "72px",
            height: "72px",
            background: "#e8f8f0",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111",
            margin: "0 0 12px",
            letterSpacing: "-0.02em"
          }}>
            Order Confirmed!
          </h1>
          
          <p style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#666",
            margin: "0 0 32px"
          }}>
            Thank you for your purchase. We are processing your order and will email your shipping details shortly.
          </p>

          <Link href="/" style={{
            display: "inline-block",
            background: "#000",
            color: "#fff",
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "600",
            padding: "14px 32px",
            borderRadius: "14px",
            transition: "transform 0.2s ease, opacity 0.2s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
          onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
          >
            Continue Browsing
          </Link>
        </div>
      </div>
    </>
  );
}
