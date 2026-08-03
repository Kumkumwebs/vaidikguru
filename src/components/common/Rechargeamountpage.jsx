import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ScrollToTop from "./ScrollToTop";

import "./RechargeAmountPage.css";

// Quick recharge presets — amount + bonus badge shown on each tile
const QUICK_RECHARGE_OPTIONS = [
  { amount: 15000, extra: 15 },
  { amount: 50000, extra: 20 },
  { amount: 4000, extra: 12 },
  { amount: 1000, extra: 10 },
  { amount: 50, extra: 100 },
  { amount: 200, extra: 20 },
  { amount: 8000, extra: 12 },
  { amount: 500, extra: 10 },
  { amount: 3000, extra: 10 },
  { amount: 311, extra: 100 },
  { amount: 2000, extra: 5 },
  { amount: 20000, extra: 15 },
  { amount: 100, extra: 50 },
  { amount: 211, extra: 100 },
  { amount: 20, extra: 0 },
];

export default function RechargeAmountPage() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handlePresetClick = (option) => {
    setSelectedPreset(option.amount);
    setAmount(String(option.amount));
  };

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
    setSelectedPreset(null);
  };

  const numericAmount = Number(amount) || 0;

  const handleProceed = () => {
    if (numericAmount <= 0) return;
    navigate("/recharge-checkout", { state: { amount: numericAmount } });
  };

  return (
    <div className="recharge-amount-page">
      <ScrollToTop />
      <Header />

      <div className="recharge-amount-page__content">
        {/* Decorative hanging diyas */}
        <img
          src="/assets/img/wallet/diya_wallet.png"
          alt=""
          aria-hidden="true"
          className="recharge-amount-diya-decor"
        />

        <div className="recharge-amount-container">
          {/* Page header / breadcrumb */}
          <p className="recharge-amount-breadcrumb">
            <span onClick={() => navigate("/")}>Home</span>
            <span className="recharge-amount-breadcrumb__sep">›</span>
            <span className="recharge-amount-breadcrumb__current">
              Recharge
            </span>
          </p>
          <h1 className="recharge-amount-title">
            Divin<span className="recharge-amount-title__accent">IQ</span>{" "}
            Recharge Wallet
          </h1>
          <p className="recharge-amount-subtitle">
            Add money to your wallet quickly and securely.
          </p>

          {/* Enter Amount */}
          <div className="recharge-amount-card">
            <h3 className="recharge-amount-card__title">Enter Amount</h3>
            <div className="recharge-amount-input-wrap">
              <span className="recharge-amount-input-icon">₹</span>
              <input
                type="text"
                inputMode="numeric"
                className="recharge-amount-input"
                placeholder="Enter amount"
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
          </div>

          {/* Quick Recharge */}
          <div className="recharge-amount-card">
            <h3 className="recharge-amount-card__title">Quick Recharge</h3>

            <div className="recharge-amount-grid">
              {QUICK_RECHARGE_OPTIONS.map((option) => (
                <button
                  key={`${option.amount}-${option.extra}`}
                  type="button"
                  className={`recharge-amount-tile ${
                    selectedPreset === option.amount
                      ? "recharge-amount-tile--selected"
                      : ""
                  }`}
                  onClick={() => handlePresetClick(option)}
                >
                  {option.extra > 0 && (
                    <span className="recharge-amount-tile__badge">
                      {option.extra}% Extra
                    </span>
                  )}
                  <span className="recharge-amount-tile__value">
                    ₹ {option.amount.toLocaleString("en-IN")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            className="recharge-amount-proceed-btn"
            onClick={handleProceed}
            disabled={numericAmount <= 0}
          >
            Proceed to Pay
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}