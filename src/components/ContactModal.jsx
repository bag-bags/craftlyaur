import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    }
  },
  exit: { 
    y: 30, 
    opacity: 0, 
    scale: 0.95,
    transition: {
      duration: 0.2
    }
  }
};

export default function ContactModal({ isOpen, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!name.trim()) return setError("Please enter your name.");
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) return setError("Please enter a valid email address.");
    if (!message.trim()) return setError("Please write a message.");

    setLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-overlay"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.15)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={onClose}
        >
          {/* Prevent overlay click propagation to dialog */}
          <motion.div
            key="contact-modal"
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.2) 100%)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: "28px",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)",
              padding: "36px",
              width: "100%",
              maxWidth: "460px",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                border: "none",
                background: "rgba(0,0,0,0.05)",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#333",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {success ? (
              /* --- SUCCESS VIEW --- */
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: "center", padding: "20px 0" }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(0, 200, 100, 0.1)",
                  color: "#00b050",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px auto",
                }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "20px",
                  fontWeight: "700",
                  color: "#111",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                }}>
                  Message Sent!
                </h3>
                <p style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: "1.5",
                  marginBottom: "24px",
                }}>
                  Thank you for reaching out. We have received your message and will notify you shortly.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    onClose();
                  }}
                  style={{
                    background: "#000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "20px",
                    padding: "10px 24px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "transform 0.1s ease",
                  }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              /* --- FORM VIEW --- */
              <>
                <h2 style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "24px",
                  fontWeight: "700",
                  color: "#111",
                  marginBottom: "6px",
                  letterSpacing: "-0.02em",
                }}>
                  Get in Touch
                </h2>
                <p style={{
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  fontSize: "14px",
                  color: "#555",
                  marginBottom: "24px",
                }}>
                  Have questions or want customized items? Send us a message!
                </p>

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {/* Name Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#444" }}>Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Name"
                      disabled={loading}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        background: "rgba(255,255,255,0.5)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border 0.2s ease, background 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1px solid #000";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "1px solid rgba(0,0,0,0.1)";
                        e.target.style.background = "rgba(255,255,255,0.5)";
                      }}
                    />
                  </div>

                  {/* Email Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#444" }}>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={loading}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        background: "rgba(255,255,255,0.5)",
                        fontSize: "14px",
                        outline: "none",
                        transition: "border 0.2s ease, background 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1px solid #000";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "1px solid rgba(0,0,0,0.1)";
                        e.target.style.background = "rgba(255,255,255,0.5)";
                      }}
                    />
                  </div>

                  {/* Message Input */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label style={{ fontSize: "12px", fontWeight: "600", color: "#444" }}>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Write your message here..."
                      rows="4"
                      disabled={loading}
                      style={{
                        padding: "12px 16px",
                        borderRadius: "14px",
                        border: "1px solid rgba(0,0,0,0.1)",
                        background: "rgba(255,255,255,0.5)",
                        fontSize: "14px",
                        outline: "none",
                        resize: "none",
                        transition: "border 0.2s ease, background 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.border = "1px solid #000";
                        e.target.style.background = "#fff";
                      }}
                      onBlur={(e) => {
                        e.target.style.border = "1px solid rgba(0,0,0,0.1)";
                        e.target.style.background = "rgba(255,255,255,0.5)";
                      }}
                    />
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ color: "#d32f2f", fontSize: "13px", fontWeight: "500", marginTop: "4px" }}
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      background: "#000",
                      color: "#fff",
                      border: "none",
                      borderRadius: "16px",
                      padding: "14px",
                      fontSize: "15px",
                      fontWeight: "600",
                      cursor: loading ? "not-allowed" : "pointer",
                      marginTop: "12px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      transition: "opacity 0.2s ease",
                    }}
                    onMouseEnter={(e) => { if(!loading) e.currentTarget.style.opacity = 0.9 }}
                    onMouseLeave={(e) => { if(!loading) e.currentTarget.style.opacity = 1 }}
                  >
                    {loading ? (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="spinner" style={{ animation: "spin 1s linear infinite" }}>
                          <line x1="12" y1="2" x2="12" y2="6"></line>
                          <line x1="12" y1="18" x2="12" y2="22"></line>
                          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                          <line x1="2" y1="12" x2="6" y2="12"></line>
                          <line x1="18" y1="12" x2="22" y2="12"></line>
                          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
          
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
