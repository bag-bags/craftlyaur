import Head from "next/head";
import Link from "next/link";

export default function CancelPage() {
  return (
    <>
      <Head>
        <title>Order Cancelled - Moroccan Crafts</title>
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
          <div style={{
            width: "72px",
            height: "72px",
            background: "#fef2f2",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px"
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>

          <h1 style={{
            fontSize: "24px",
            fontWeight: "700",
            color: "#111",
            margin: "0 0 12px",
            letterSpacing: "-0.02em"
          }}>
            Checkout Cancelled
          </h1>
          
          <p style={{
            fontSize: "14px",
            lineHeight: "1.6",
            color: "#666",
            margin: "0 0 32px"
          }}>
            Your transaction was not completed. No charges were made. If you had issues, feel free to try again or contact us.
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
            Back to Shop
          </Link>
        </div>
      </div>
    </>
  );
}
