import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../../context/StorageContext";
import "./ChadhavaUserDetailsModal.css";

const UserDetailsModal = ({
  isOpen,
  onClose,
  cart,
  page,
  puja,
  selectedPackage,
}) => {
  const navigate = useNavigate();
  const { devoteeDetails, setDevoteeDetails, setActiveCart } = useStorage();

  // Initialize state from context
  const [formData, setFormData] = useState({ name: "", whatsapp: "" });

  // This Effect runs whenever the modal opens to sync with saved data
  useEffect(() => {
    if (isOpen) {
      let name = "";
      let whatsapp = "";

      // Try to prefill from logged-in user in sessionStorage
      try {
        const user = JSON.parse(sessionStorage.getItem("user"));
        if (user) {
          name = user.name || "";
          whatsapp = user.number || "";
        }
      } catch (e) {
        // ignore parse errors
        console.log("error while filling form", e);
      }

      // Override with devoteeDetails if available
      if (devoteeDetails?.name) name = devoteeDetails.name;
      if (devoteeDetails?.whatsapp) whatsapp = devoteeDetails.whatsapp;

      setFormData({ name, whatsapp });
    }
  }, [isOpen, devoteeDetails]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save updated details to context (which syncs to sessionStorage)
    setDevoteeDetails(formData);
    setActiveCart(cart);

    onClose();

    // If we are already on the checkout page, onClose() above already
    // triggers fetchCartFromServer() in the parent, so the devotee
    // details update without needing a disruptive full page reload.
    // Only navigate when we're NOT already on the relevant page.
    if (page == "chadhava") {
      if (!window.location.pathname.includes("chadhava_review_booking")) {
        navigate("/chadhava_review_booking");
      }
    } else {
      if (!window.location.pathname.includes("puja_review_booking")) {
        navigate("/puja_review_booking", {
          state: {
            pujaData: puja,
            selectedPackage: selectedPackage, // In Puja flow, 'cart' is usually the selected package object
          },
        });
      }
    }
  };

  return (
    <div className="cudm-overlay" onClick={onClose}>
      <div className="cudm-card" onClick={(e) => e.stopPropagation()}>
        {/* Header art strip */}
        <div className="cudm-header">
          <img
            className="cudm-header-img"
            src="/assets/img/chadawa_detail/kalashchadawa.png"
            alt=""
            onError={(e) => { e.target.style.display = "none"; }}
          />
          <div className="cudm-header-pattern" />
          <div className="cudm-handle" />
          <button className="cudm-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        {/* Floating avatar straddling the header */}
        <div className="cudm-avatar">
          <i className="fas fa-user"></i>
        </div>

        <div className="cudm-body">
          <h3 className="cudm-title">Update Details</h3>
          <div className="cudm-subtitle-row">
            <span className="cudm-line" />
            <i className="fas fa-spa"></i>
            <span className="cudm-line" />
          </div>
          <p className="cudm-subtitle">
            Ensure your details are correct for the Sankalp
          </p>

          <form onSubmit={handleSubmit} className="cudm-form">
            <div className="cudm-field">
              <label>
                <span className="cudm-field-icon">
                  <i className="fas fa-user"></i>
                </span>
                Full Name
              </label>
              <input
                type="text"
                placeholder="eg. Rahul Sharma"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="cudm-field">
              <label>
                <span className="cudm-field-icon">
                  <i className="fab fa-whatsapp"></i>
                </span>
                WhatsApp Number
              </label>
              <div className="cudm-phone-row">
                <span className="cudm-country-code">
                  +91 <i className="fas fa-chevron-down"></i>
                </span>
                <input
                  type="tel"
                  placeholder="98765 43210"
                  pattern="[0-9]{10}"
                  required
                  value={formData.whatsapp}
                  onChange={(e) =>
                    setFormData({ ...formData, whatsapp: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="cudm-secure-note">
              <span className="cudm-secure-icon">
                <i className="fas fa-check"></i>
              </span>
              Your information is secure with us and will never be shared.
            </div>

            <button type="submit" className="cudm-submit-btn">
              Save & Continue <i className="fas fa-arrow-right"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;