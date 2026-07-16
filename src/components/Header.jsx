import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLLECTION_NAMES = [
  "Footwear",
  "Bags & Backpacks",
  "Baskets & Decor",
  "All Products",
];

export default function Header({
  onContactClick,
  collectionsData = [],
  activeCollectionIdx = 0,
  onCollectionSwitch,
}) {
  const [showCollections, setShowCollections] = useState(false);
  const [hoveredCollection, setHoveredCollection] = useState(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowCollections(false);
      }
    };
    if (showCollections) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showCollections]);

  const handleCollectionClick = (index) => {
    if (onCollectionSwitch) {
      onCollectionSwitch(index);
    }
    setShowCollections(false);
    setHoveredCollection(null);
  };

  const handleDropdownEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowCollections(true);
  };

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowCollections(false);
      setHoveredCollection(null);
    }, 300);
  };

  // Get preview items for hovered collection
  const previewItems = hoveredCollection !== null && collectionsData[hoveredCollection]
    ? collectionsData[hoveredCollection].slice(0, 8)
    : [];

  return (
    <header
      className="site-header"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        padding: "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        pointerEvents: "none",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          pointerEvents: "auto",
        }}
      >
        {/* Text logo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span
              style={{
                fontFamily:
                  "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "15px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              MOROCCAN
            </span>
            <span
              style={{
                fontFamily:
                  "'Helvetica Neue', Helvetica, Arial, sans-serif",
                fontSize: "15px",
                fontWeight: "300",
                letterSpacing: "0.12em",
                color: "#000",
                textTransform: "uppercase",
              }}
            >
              CRAFTS
            </span>
          </div>
          <span
            style={{
              fontFamily:
                "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "8px",
              fontWeight: "400",
              letterSpacing: "0.2em",
              color: "#999",
              textTransform: "uppercase",
              marginTop: "-1px",
            }}
          >
            Est. 2026
          </span>
        </div>
      </div>

      {/* Right side - nav */}
      <div
        className="header-nav"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          pointerEvents: "auto",
        }}
      >
        {/* Collections Dropdown */}
        <div
          ref={dropdownRef}
          style={{ position: "relative" }}
          onMouseEnter={handleDropdownEnter}
          onMouseLeave={handleDropdownLeave}
        >
          <NavItem
            label="COLLECTIONS"
            number="01"
            onClick={() => setShowCollections((prev) => !prev)}
            isActive={showCollections}
          />

          <AnimatePresence>
            {showCollections && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="collections-dropdown"
                style={{
                  position: "absolute",
                  top: "calc(100% + 12px)",
                  right: 0,
                  display: "flex",
                  gap: "0px",
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(250, 248, 255, 0.9) 100%)",
                  backdropFilter: "blur(40px) saturate(200%)",
                  WebkitBackdropFilter: "blur(40px) saturate(200%)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 12px 48px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                  overflow: "hidden",
                  minWidth: "200px",
                }}
              >
                {/* Collection names list */}
                <div style={{ padding: "8px 0", minWidth: "200px" }}>
                  {COLLECTION_NAMES.map((name, index) => {
                    const isActive = activeCollectionIdx === index;
                    const isHovered = hoveredCollection === index;
                    const itemCount = collectionsData[index]?.length || 0;
                    return (
                      <motion.div
                        key={name}
                        onClick={() => handleCollectionClick(index)}
                        onMouseEnter={() => setHoveredCollection(index)}
                        style={{
                          padding: "10px 20px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "12px",
                          background: isHovered
                            ? "rgba(0,0,0,0.04)"
                            : "transparent",
                          transition: "background 0.15s ease",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          {/* Active indicator dot */}
                          <div
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: isActive ? "#000" : "transparent",
                              transition: "background 0.2s ease",
                              flexShrink: 0,
                            }}
                          />
                          <span
                            style={{
                              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                              fontSize: "13px",
                              fontWeight: isActive ? "600" : "400",
                              color: isActive ? "#000" : "#444",
                              letterSpacing: "0.02em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {name}
                          </span>
                        </div>
                        <span
                          style={{
                            fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                            fontSize: "10px",
                            fontWeight: "400",
                            color: "#aaa",
                            letterSpacing: "0.02em",
                          }}
                        >
                          {itemCount}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Product preview panel - appears on hover */}
                <AnimatePresence mode="wait">
                  {hoveredCollection !== null && previewItems.length > 0 && (
                    <motion.div
                      key={`preview-${hoveredCollection}`}
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 280 }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{
                        borderLeft: "1px solid rgba(0,0,0,0.06)",
                        overflow: "hidden",
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "280px",
                          padding: "12px",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "8px",
                          maxHeight: "320px",
                          overflowY: "auto",
                          scrollbarWidth: "none",
                        }}
                      >
                        {previewItems.map((item, idx) => (
                          <motion.div
                            key={item.title + idx}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.03, duration: 0.2 }}
                            onClick={() => handleCollectionClick(hoveredCollection)}
                            style={{
                              borderRadius: "10px",
                              overflow: "hidden",
                              background: "#f5f5f5",
                              cursor: "pointer",
                              aspectRatio: "1",
                              position: "relative",
                            }}
                          >
                            <img
                              src={item.image_url}
                              alt={item.title}
                              loading="lazy"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                            />
                            {/* Price tag */}
                            {item.price && (
                              <div
                                style={{
                                  position: "absolute",
                                  bottom: "6px",
                                  right: "6px",
                                  background: "rgba(0,0,0,0.7)",
                                  color: "#fff",
                                  fontSize: "9px",
                                  fontWeight: "600",
                                  padding: "2px 6px",
                                  borderRadius: "6px",
                                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                                }}
                              >
                                {item.price}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NavItem label="CONTACT" number="02" onClick={onContactClick} />
        <Divider />
        <QuoteText text="HANDMADE" />
      </div>

      {/* Mobile responsive styles + scrollbar hide */}
      <style>{`
        @media (max-width: 600px) {
          .site-header {
            padding: 16px 20px !important;
          }
          .header-nav {
            display: none !important;
          }
        }
        .collections-dropdown div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </header>
  );
}

function NavItem({ label, number, onClick, isActive = false }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "6px",
        cursor: "pointer",
        opacity: isActive ? 1 : 0.6,
        transition: "opacity 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.opacity = 1)
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.opacity = isActive ? 1 : 0.6)
      }
    >
      <span
        style={{
          fontFamily:
            "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "9px",
          fontWeight: "400",
          color: "#999",
        }}
      >
        {number}
      </span>
      <span
        style={{
          fontFamily:
            "'Helvetica Neue', Helvetica, Arial, sans-serif",
          fontSize: "11px",
          fontWeight: "500",
          letterSpacing: "0.08em",
          color: "#000",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        width: "1px",
        height: "12px",
        background: "rgba(0,0,0,0.15)",
      }}
    />
  );
}

function QuoteText({ text }) {
  return (
    <span
      style={{
        fontFamily:
          "'Helvetica Neue', Helvetica, Arial, sans-serif",
        fontSize: "11px",
        fontWeight: "400",
        letterSpacing: "0.05em",
        color: "#000",
        opacity: 0.4,
      }}
    >
      &ldquo;{text}&rdquo;
    </span>
  );
}
