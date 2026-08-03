import React, { useEffect, useState } from "react";
import UserDetailsModal from "../common/ChadhavaUserDetailsModel";
import "./Pujapackages.css";

const PACKAGE_TYPE_IMAGES = {
  individual: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
  partner: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
  family: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
  joint: "https://png.pngtree.com/png-clipart/20250105/original/pngtree-indian-young-girl-holding-pooja-thali-or-performing-worship-png-image_18736844.png",
};

const PujaPackages = ({ puja }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!puja) return null;

  // auto-select recommended / popular package
  const recommendedPkg =
    puja.packages.find(p => p.isPopular) || puja.packages[0];

  const [selectedId, setSelectedId] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);

  useEffect(() => {
    if (recommendedPkg) {
      setSelectedId(recommendedPkg._id);
      setSelectedPkg(recommendedPkg);
    }
  }, [recommendedPkg]);

  const handleSelectPackage = (pkg) => {
    setSelectedId(pkg._id);
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  return (
    <div className="container">
      <div className="pp-wrapper">
        <h2 className="pp-title">Choose Your Puja Package</h2>

        <div className="pp-grid">
          {puja.packages.map(pkg => {
            const typeKey = pkg.packageType?.toLowerCase() || "individual";

            return (
              <div
                key={pkg._id}
                className={`pp-card ${selectedId === pkg._id ? "pp-active" : ""}`}
                onClick={() => {
                  setSelectedId(pkg._id);
                  setSelectedPkg(pkg);
                }}
              >
                {/* RADIO CIRCLE */}
                <div className="pp-radio">
                  {selectedId === pkg._id && (
                    <svg
                      className="pp-radio-check"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#fff"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* ⭐ MOST POPULAR */}
                {pkg.isPopular && (
                  <span className="pp-popular-badge">⭐ Most Popular</span>
                )}

                {/* 🖼️ IMAGE + HEADER + PRICE ROW */}
                <div className="pp-card-row">
                  <div className="pp-type-image">
                    <img
                      src={PACKAGE_TYPE_IMAGES[typeKey]}
                      alt={pkg.packageType}
                    />
                    <span className="pp-person-badge">
                      <svg
                        className="pp-person-icon"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.4c-3.3 0-9.8 1.6-9.8 4.9v2.5h19.6v-2.5c0-3.3-6.5-4.9-9.8-4.9z" />
                      </svg>
                      {pkg.maxMembers || 1} {pkg.maxMembers > 1 ? "People" : "Person"}
                    </span>
                  </div>

                  <div className="pp-card-info">
                    <h3 className="pp-card-name">{pkg.packageName}</h3>
                    <p className="pp-subtitle">
                      {Array.isArray(pkg.packageDescription)
                        ? pkg.packageDescription[0]
                        : pkg.packageDescription}
                    </p>
                    <div className="pp-price">₹{pkg.packagePrice}</div>
                  </div>
                </div>

                {/* CTA — only visible when this card is selected */}
                {selectedId === pkg._id && (
                  <button
                    className="pp-select-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPackage(pkg);
                    }}
                  >
                    Participate
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <UserDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cart={selectedPkg}
        page={"puja"}
        puja={puja}
        selectedPackage={selectedPkg}
      />
    </div>
  );
};

export default PujaPackages;