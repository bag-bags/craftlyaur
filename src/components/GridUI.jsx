import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONFIG } from "./grid/gridConfig";
// 1. THE PHYSICS
// High stiffness, moderate damping = "Snappy but smooth" (Apple feel)
const islandTransition = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 1,
};

export function UnifiedControlBar({
  currentCollection,
  onSwitch,
  setZoomTrigger,
  isZoomedIn,
  hasActiveSelection,
  activeProductData,
  nikeFilter,
  onFilterChange,
}) {
  const collections = [
    "Footwear",
    "Bags & Backpacks",
    "Baskets & Decor",
    "All Products",
  ];

  const nikeFilters = [
    { id: "all", label: "All" },
    { id: "sandals", label: "Sandals" },
    { id: "slippers", label: "Slippers" },
  ];

  // Hover state for popovers
  const [showDescription, setShowDescription] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const descTimeoutRef = useRef(null);
  const galleryTimeoutRef = useRef(null);

  // Close popovers when selection changes
  useEffect(() => {
    if (!hasActiveSelection) {
      setShowDescription(false);
      setShowGallery(false);
    }
  }, [hasActiveSelection]);

  const handleDescEnter = () => {
    if (galleryTimeoutRef.current) clearTimeout(galleryTimeoutRef.current);
    setShowGallery(false);
    if (descTimeoutRef.current) clearTimeout(descTimeoutRef.current);
    setShowDescription(true);
  };
  const handleDescLeave = () => {
    descTimeoutRef.current = setTimeout(() => setShowDescription(false), 200);
  };
  const handleGalleryEnter = () => {
    if (descTimeoutRef.current) clearTimeout(descTimeoutRef.current);
    setShowDescription(false);
    if (galleryTimeoutRef.current) clearTimeout(galleryTimeoutRef.current);
    setShowGallery(true);
  };
  const handleGalleryLeave = () => {
    galleryTimeoutRef.current = setTimeout(() => setShowGallery(false), 200);
  };

  // Check if product has gallery images
  const hasGallery = activeProductData?.gallery?.length > 0;

  return (
    <div
      className="control-bar-container"
      style={{
        position: "fixed",
        bottom: "40px",
        left: "0",
        right: "0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {/* --- POPOVER PANELS (above the island) --- */}
      <AnimatePresence>
        {showDescription && activeProductData?.description && (
          <motion.div
            key="desc-popover"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onMouseEnter={handleDescEnter}
            onMouseLeave={handleDescLeave}
            className="popover-panel"
            style={{
              maxWidth: "420px",
              width: "90vw",
              maxHeight: "260px",
              marginBottom: "12px",
              padding: "20px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(250, 245, 255, 0.85) 100%)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              overflowY: "auto",
              pointerEvents: "auto",
            }}
          >
            <p style={{
              margin: 0,
              fontSize: "13px",
              lineHeight: "1.7",
              color: "#333",
              fontWeight: "400",
              whiteSpace: "pre-line",
            }}>
              {activeProductData.description}
            </p>
          </motion.div>
        )}

        {showGallery && hasGallery && (
          <motion.div
            key="gallery-popover"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            onMouseEnter={handleGalleryEnter}
            onMouseLeave={handleGalleryLeave}
            className="popover-panel"
            style={{
              maxWidth: "520px",
              width: "90vw",
              marginBottom: "12px",
              padding: "12px",
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.88) 0%, rgba(250, 245, 255, 0.85) 100%)",
              backdropFilter: "blur(40px) saturate(200%)",
              WebkitBackdropFilter: "blur(40px) saturate(200%)",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
              pointerEvents: "auto",
            }}
          >
            <div style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              padding: "4px 0",
              scrollbarWidth: "none",
            }}>
              {activeProductData.gallery.map((url, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  style={{
                    flexShrink: 0,
                    width: "120px",
                    height: "120px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                    background: "#f5f5f5",
                  }}
                >
                  <img
                    src={url}
                    alt={`${activeProductData.title} - view ${idx + 1}`}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </motion.div>
              ))}
            </div>
            {/* Hide scrollbar */}
            <style>{`
              .popover-panel div::-webkit-scrollbar { display: none; }
            `}</style>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        THE ISLAND CONTAINER
        - layout: Animates width/height changes
        - borderRadius: 32px is standard for pill shapes
      */}
      <motion.div
        className="control-bar-island"
        layout
        transition={islandTransition}
        style={{
          background:
            "linear-gradient(135deg, rgba(255, 240, 235, 0.4) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(245, 235, 255, 0.4) 100%)", // Very subtle orange to purple gradient for glassy depth
          backdropFilter: "blur(40px) saturate(200%)", // Increased blur for more glassy feel
          WebkitBackdropFilter: "blur(40px) saturate(200%)", // Safari support
          borderRadius: "32px",
          border: "1px solid rgba(255, 255, 255, 0.3)", // Subtle white border for glass edge
          boxShadow:
            "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.5)", // Soft shadow + inner highlight
          padding: "6px",
          display: "flex",
          alignItems: "center",
          pointerEvents: "auto",
          height: "56px",
          overflow: "hidden", // Crucial for clipping content during resize
        }}
      >
        {/* 
          mode="popLayout" is CRITICAL. 
          It lets the outgoing component "pop" out of the layout flow 
          so the container can instantly shrink/grow to the new content's size.
        */}
        <AnimatePresence mode="popLayout" initial={false}>
          {hasActiveSelection ? (
            /* ---------------- STATE 1: PRODUCT ACTIONS (Active Selection) ---------------- */
            <motion.div
              key="product-actions-mode"
              initial={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(4px)",
              }}
              transition={{
                ...islandTransition,
                opacity: { duration: 0.2 },
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              {/* Buy Now Button */}
              <motion.button
                onClick={() => {
                  if (activeProductData?.product_url) {
                    window.open(activeProductData.product_url, "_blank");
                  }
                }}
                style={{
                  background: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "24px",
                  padding: "0 20px",
                  height: "44px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Buy Now
              </motion.button>

              {/* Description Button */}
              <motion.button
                onMouseEnter={handleDescEnter}
                onMouseLeave={handleDescLeave}
                style={{
                  background: showDescription ? "rgba(0,0,0,0.1)" : "transparent",
                  color: "#333",
                  border: "1px solid rgba(0,0,0,0.08)",
                  borderRadius: "24px",
                  padding: "0 16px",
                  height: "44px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                  transition: "background 0.2s ease",
                }}
                whileHover={{ scale: 1.03, backgroundColor: "rgba(0,0,0,0.06)" }}
                whileTap={{ scale: 0.95 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Description
              </motion.button>

              {/* Gallery Button - only if there are gallery images */}
              {hasGallery && (
                <motion.button
                  onMouseEnter={handleGalleryEnter}
                  onMouseLeave={handleGalleryLeave}
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  style={{
                    background: showGallery ? "rgba(0,0,0,0.1)" : "transparent",
                    color: "#333",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "24px",
                    padding: "0 16px",
                    height: "44px",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    whiteSpace: "nowrap",
                    transition: "background 0.2s ease",
                  }}
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(0,0,0,0.06)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  Gallery
                </motion.button>
              )}
            </motion.div>
          ) : isZoomedIn ? (
            /* ---------------- STATE 2: COMPACT (Zoomed In) ---------------- */
            <motion.div
              key="compact-mode"
              initial={{
                opacity: 0,
                scale: 0.5,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                filter: "blur(4px)",
              }}
              transition={{
                ...islandTransition,
                opacity: { duration: 0.2 },
              }}
              style={{ display: "flex" }}
            >
              <ControlButton
                icon="remove"
                onClick={() => setZoomTrigger("OUT")}
                label="Zoom Out"
              />
            </motion.div>
          ) : (
            /* ---------------- STATE 2: EXPANDED (Zoomed Out) ---------------- */
            <motion.div
              key="expanded-mode"
              initial={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(4px)",
              }}
              animate={{
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                filter: "blur(4px)",
              }}
              transition={{
                ...islandTransition,
                opacity: { duration: 0.2 },
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ControlButton
                icon="add"
                onClick={() =>
                  setZoomTrigger(CONFIG.zoomIn)
                }
                label="Zoom In"
              />

              {/* Vertical Divider */}
              <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "24px" }}
                transition={{ delay: 0.1 }}
                style={{
                  width: "1px",
                  background: "rgba(0,0,0,0.08)",
                  margin: "0 2px",
                  boxShadow:
                    "0 0 1px rgba(255, 255, 255, 0.3)", // Subtle highlight for glassy feel
                }}
              />

              {/* Collection Tabs Group */}
              <div style={{ display: "flex", gap: "2px" }}>
                {collections.map((name, index) => {
                  const isActive =
                    currentCollection === index;
                  return (
                    <TabButton
                      key={name}
                      isActive={isActive}
                      onClick={() => onSwitch(index)}
                    >
                      {name}
                    </TabButton>
                  );
                })}
              </div>

              {/* Nike Filters - only show when Nike collection is active (desktop only) */}
              {currentCollection === 0 && (
                <div className="desktop-filters">
                  {/* Vertical Divider */}
                  <motion.div
                    layout
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={islandTransition}
                    style={{
                      width: "1px",
                      height: "24px",
                      background: "rgba(0,0,0,0.08)",
                      margin: "0 6px",
                      transformOrigin: "center",
                    }}
                  />

                  {/* Filter Chips */}
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={islandTransition}
                    style={{ display: "flex", gap: "4px" }}
                  >
                    {nikeFilters.map((filter) => (
                      <FilterChip
                        key={filter.id}
                        isActive={nikeFilter === filter.id}
                        onClick={() => onFilterChange(filter.id)}
                        layoutGroup="desktop"
                      >
                        {filter.label}
                      </FilterChip>
                    ))}
                  </motion.div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile Nike Filters - appears above main bar */}
      <AnimatePresence>
        {currentCollection === 0 && !isZoomedIn && !hasActiveSelection && (
          <motion.div
            className="mobile-filters"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={islandTransition}
            style={{
              position: "absolute",
              bottom: "70px",
              left: 0,
              right: 0,
              display: "none", // Hidden by default, shown on mobile via CSS
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(40px) saturate(200%)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                padding: "6px 8px",
                gap: "4px",
                pointerEvents: "auto",
              }}
            >
              {nikeFilters.map((filter) => (
                <FilterChip
                  key={`mobile-${filter.id}`}
                  isActive={nikeFilter === filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  layoutGroup="mobile"
                >
                  {filter.label}
                </FilterChip>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Responsive scaling for shorter viewports (tablets) and mobile */}
      <style>{`
        .desktop-filters {
          display: flex;
          align-items: center;
        }
        .mobile-filters {
          display: none !important;
        }
        @media (max-height: 800px) {
          .control-bar-container {
            bottom: 24px !important;
          }
          .control-bar-island {
            height: 48px !important;
            border-radius: 24px !important;
            padding: 4px !important;
          }
        }
        @media (max-height: 650px) {
          .control-bar-container {
            bottom: 16px !important;
          }
          .control-bar-island {
            height: 44px !important;
          }
        }
        @media (max-width: 768px) {
          .control-bar-container {
            bottom: 20px !important;
          }
          .control-bar-island {
            height: 48px !important;
            padding: 4px !important;
          }
          .desktop-filters {
            display: none !important;
          }
          .mobile-filters {
            display: flex !important;
          }
        }
        @media (max-width: 480px) {
          .control-bar-container {
            bottom: 16px !important;
          }
          .control-bar-island {
            height: 44px !important;
          }
          .control-button {
            width: 36px !important;
            height: 36px !important;
          }
          .tab-button {
            padding: 6px 10px !important;
            font-size: 12px !important;
          }
          .filter-chip {
            padding: 4px 8px !important;
            font-size: 11px !important;
          }
          .mobile-filters {
            bottom: 60px !important;
          }
        }
      `}</style>
    </div>
  );
}

// --- Sub-components for cleaner code & isolated animations ---

function ControlButton({ onClick, icon, label }) {
  return (
    <motion.button
      layout="position" // Prevents icon distortion during resize
      onClick={onClick}
      className="control-button"
      whileHover={{
        scale: 1.05,
        backgroundColor: "rgba(0,0,0,0.05)",
      }}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.2 }}
      style={{
        width: "44px",
        height: "44px",
        borderRadius: "50%",
        border: "none",
        background: "transparent",
        color: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        outline: "none",
      }}
      aria-label={label}
    >
      {/* Simple SVG Icons instead of text for a sharper look */}
      {icon === "add" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      )}
    </motion.button>
  );
}

function TabButton({ children, isActive, onClick }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="tab-button"
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        color: isActive ? "#000" : "#666",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "600",
        cursor: "pointer",
        whiteSpace: "nowrap", // Prevents text wrapping during resize
        zIndex: 1,
        transition: "color 0.2s ease",
      }}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          transition={islandTransition}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(255, 255, 255, 0.6)", // Solid background for active state
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(255, 255, 255, 0.4)",
            boxShadow:
              "0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
            zIndex: -1,
          }}
        />
      )}
    </motion.button>
  );
}

function FilterChip({ children, isActive, onClick, layoutGroup = "default" }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className="filter-chip"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={islandTransition}
      style={{
        position: "relative",
        border: "none",
        background: "transparent",
        color: isActive ? "#fff" : "#555",
        padding: "6px 12px",
        borderRadius: "14px",
        fontSize: "12px",
        fontWeight: "500",
        cursor: "pointer",
        whiteSpace: "nowrap",
        zIndex: 1,
      }}
    >
      {/* Animated background pill */}
      {isActive && (
        <motion.div
          layoutId={`activeFilterIndicator-${layoutGroup}`}
          transition={islandTransition}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.85)",
            borderRadius: "14px",
            zIndex: -1,
          }}
        />
      )}
      {!isActive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0, 0, 0, 0.05)",
            borderRadius: "14px",
            zIndex: -1,
          }}
        />
      )}
      {children}
    </motion.button>
  );
}
