import React, { useState, useEffect } from "react";
import { useStorage } from "../context/StorageContext";
import { useNavigate } from "react-router-dom";

const PujaUserDetailsModal = ({
  isOpen,
  onClose,
  cart,
  page,
  puja,
  selectedPackage,
}) => {
  const navigate = useNavigate();
  const { setDevoteeDetails, setActiveCart } = useStorage();

  const [formData, setFormData] = useState({ name: "", whatsapp: "" });
  const [previousUsers, setPreviousUsers] = useState([]);
  const [showUserList, setShowUserList] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let name = "";
    let whatsapp = "";
    try {
      const user = JSON.parse(sessionStorage.getItem("user") || "null");
      if (user) {
        name = user.name || "";
        whatsapp = user.number || user.whatsapp || "";
      }
    } catch (e) {
      console.warn("Error reading user from sessionStorage", e);
    }
    setFormData({ name, whatsapp });
    setShowUserList(false);

    // Load previous users from localStorage
    try {
      const saved = JSON.parse(localStorage.getItem("devoteeUsers") || "[]");
      setPreviousUsers(saved);
    } catch (e) {
      console.warn("Error loading users", e);
    }
  }, [isOpen]);

  const handleEditClick = () => {
    setShowUserList((prev) => !prev);
  };

  const handleSelectUser = (user) => {
    setFormData({ name: user.name, whatsapp: user.whatsapp });
    setShowUserList(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save user to previousUsers list
    const updatedUsers = previousUsers.filter(
      (u) => !(u.name === formData.name && u.whatsapp === formData.whatsapp)
    );
    updatedUsers.unshift({ name: formData.name, whatsapp: formData.whatsapp });

    // Keep only last 10 users
    if (updatedUsers.length > 10) {
      updatedUsers.pop();
    }

    try {
      localStorage.setItem("devoteeUsers", JSON.stringify(updatedUsers));
    } catch (e) {
      console.warn("Error saving users", e);
    }

    setDevoteeDetails({
      name: formData.name,
      whatsapp: formData.whatsapp,
      sankalp: "",
    });
    try {
      const existing = JSON.parse(sessionStorage.getItem("user") || "{}");
      sessionStorage.setItem(
        "user",
        JSON.stringify({ ...existing, name: formData.name, number: formData.whatsapp })
      );
    } catch (_) { }
    setActiveCart(cart);
    onClose();
    if (page === "chadhava") {
      if (window.location.pathname.includes("chadhava_review_booking")) {
        window.location.reload();
      } else {
        navigate("/chadhava_review_booking");
      }
    } else {
      if (window.location.pathname.includes("puja_review_booking")) {
        window.location.reload();
      } else {
        navigate("/puja_review_booking", {
          state: { pujaData: puja, selectedPackage },
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,20,50,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px",
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          maxWidth: "420px",
          width: "100%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.22)",
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Close button ── */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "1.5px solid #e5e7eb",
            background: "#fff",
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#555",
            zIndex: 10,
          }}
        >
          ✕
        </button>

        {/* ── Header with gradient bg + decorative images ── */}
        <div
          style={{
            background: "linear-gradient(160deg, #f8f0ff 0%, #fdf6ee 60%, #fff 100%)",
            padding: "10px 20px 6px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Kalash — top-left decorative image */}
          <img
            src="/assets/img/pooja_fill/lotuskalash.png"
            alt=""
            aria-hidden="true"
            onError={(e) => (e.currentTarget.style.display = "none")}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 70,
              height: 70,
              objectFit: "contain",
              pointerEvents: "none",
            }}
          />

          {/* Avatar circle with edit badge */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#ede9fe",
              margin: "0 auto 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Person SVG icon */}
          <svg
              width="22"
              height="22"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="20" cy="14" r="8" fill="#7c3aed" opacity="0.85" />
              <ellipse cx="20" cy="34" rx="13" ry="7" fill="#7c3aed" opacity="0.6" />
            </svg>
            {/* Orange edit badge */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                bottom: 1,
                right: 1,
                width: 14,
                height: 14,
                background: "#f59e0b",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              <svg
                width="9"
                height="9"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8.5 1.5l2 2L3.5 10.5l-2.5.5.5-2.5L8.5 1.5z"
                  stroke="#fff"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "#1a1a2e",
              margin: "0 0 2px",
            }}
          >
            Update{" "}
            <span style={{ color: "#7c2d8e" }}>Details</span>
          </h3>
          <p style={{ fontSize: 11, color: "#888", margin: 0 }}>
            Ensure your details are correct for the Sankalp
          </p>

          {/* Decorative divider with flower */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              margin: "6px 0 0",
              color: "#c97a2c",
              fontSize: 14,
            }}
          >
            <span
              style={{
                flex: 1,
                height: 1.5,
                background:
                  "linear-gradient(to right, transparent, #e0b97a, transparent)",
                maxWidth: 60,
                display: "block",
              }}
            />
            ✿
            <span
              style={{
                flex: 1,
                height: 1.5,
                background:
                  "linear-gradient(to right, transparent, #e0b97a, transparent)",
                maxWidth: 60,
                display: "block",
              }}
            />
          </div>
        </div>

        {/* ── Body ── */}
        <div style={{ padding: "8px 16px 8px" }}>
          <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>

            {/* ── Full Name ── */}
            <div style={{ marginBottom: 6 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                {/* Left Side */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 12,
                    fontWeight: 700,
                    color: "#1a1a2e",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: "50%",
                      background: "#ede9fe",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#7c3aed"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>

                  Full Name
                </div>

                {/* Right Side Edit Button */}
                {previousUsers.length > 0 && (
                  <button
                    type="button"
                    onClick={handleEditClick}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: "50%",
                      border: "1px solid #ddd6fe",
                      background: showUserList ? "#ede9fe" : "#f5f3ff",
                      color: "#7c3aed",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                )}
              </div>

              <div style={{ position: "relative" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#f8f8fb",
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Enter your name"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    style={{
                      flex: 1,
                      padding: "8px 10px",
                      fontSize: 14,
                      color: "#1a1a2e",
                      border: "none",
                      background: "transparent",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Dropdown of previously saved users */}
                {showUserList && previousUsers.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 6px)",
                      left: 0,
                      right: 0,
                      background: "#fff",
                      border: "1.5px solid #e5e7eb",
                      borderRadius: 12,
                      boxShadow: "0 12px 30px rgba(0,0,0,0.14)",
                      zIndex: 20,
                      maxHeight: 160,
                      overflowY: "auto",
                    }}
                  >
                    {previousUsers.map((user, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectUser(user)}
                        style={{
                          padding: "10px 12px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          cursor: "pointer",
                          borderBottom:
                            idx !== previousUsers.length - 1
                              ? "1px solid #f0f0f0"
                              : "none",
                          background:
                            formData.name === user.name &&
                            formData.whatsapp === user.whatsapp
                              ? "#f0ebff"
                              : "#fff",
                        }}
                        onMouseEnter={(e) => {
                          if (
                            !(
                              formData.name === user.name &&
                              formData.whatsapp === user.whatsapp
                            )
                          ) {
                            e.currentTarget.style.background = "#faf8ff";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (
                            !(
                              formData.name === user.name &&
                              formData.whatsapp === user.whatsapp
                            )
                          ) {
                            e.currentTarget.style.background = "#fff";
                          }
                        }}
                      >
                        <div
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            background: "#ede9fe",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 700,
                              color: "#1a1a2e",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {user.name}
                          </div>
                          <div style={{ fontSize: 11, color: "#888" }}>
                            +91 {user.whatsapp}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dashed divider between fields */}
            <div
              style={{
                borderTop: "1.5px dashed #e9e2fb",
                margin: "2px 0 6px",
              }}
            />

            {/* ── Phone Number ── */}
            <div style={{ marginBottom: 6 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#1a1a2e",
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#ede9fe",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                  </svg>
                </div>
                Phone Number (WhatsApp)
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#f8f8fb",
                  border: "1.5px solid #e5e7eb",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {/* +91 prefix pill */}
                <div
                  style={{
                    background: "#fff",
                    borderRight: "1.5px solid #e5e7eb",
                    padding: "8px 10px",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#6d28d9",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    whiteSpace: "nowrap",
                  }}
                >
                  +91
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 6"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1l4 4 4-4"
                      stroke="#888"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <input
                  type="tel"
                  placeholder="Enter your number"
                  pattern="[0-9]{10}"
                  required
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, whatsapp: e.target.value }))
                  }
                  style={{
                    flex: 1,
                    padding: "8px 10px",
                    fontSize: 14,
                    color: "#1a1a2e",
                    border: "none",
                    background: "transparent",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* ── Info banner ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#f4f1ff",
                borderRadius: 10,
                border: "1.5px solid #ddd6fe",
                padding: "7px 10px",
                marginBottom: 8,
                marginTop: 2,
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  background: "#6d28d9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <p style={{ margin: 0, color: "#444", fontSize: 11, lineHeight: 1.3 }}>
                We will use this number to contact you on WhatsApp
              </p>
            </div>

            {/* ── Submit row with diya + button + lotus ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Diya image — left side */}
              <img
                src="/assets/img/pooja_fill/diyaform.png"
                alt=""
                aria-hidden="true"
                onError={(e) => (e.currentTarget.style.display = "none")}
                style={{
                  width: 30,
                  height: 30,
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />

              {/* Submit button */}
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "linear-gradient(90deg, #5b21b6 0%, #7c3aed 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  letterSpacing: 0.2,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                Save &amp; Continue →
              </button>

              {/* Lotus image — right side */}
              <img
                src="/assets/img/pooja_fill/diyaform.png"
                alt=""
                aria-hidden="true"
                onError={(e) => (e.currentTarget.style.display = "none")}
                style={{
                  width: 56,
                  height: 36,
                  objectFit: "contain",
                  flexShrink: 0,
                  borderRadius: "50%",
                }}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PujaUserDetailsModal;