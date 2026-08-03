import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import apiService from "../../services/apiServices";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ScrollToTop from "./ScrollToTop";

import "./Walletpage.css";

// Simple inline transaction row — replace with a shared component later if you have one
function TransactionItem({ data }) {
    const isCredit = data.type === "credit";
    return (
        <div className="wallet-transaction-item">
            <div className="wallet-transaction-item__left">
                <span
                    className={`wallet-transaction-item__badge ${isCredit ? "wallet-transaction-item__badge--credit" : "wallet-transaction-item__badge--debit"
                        }`}
                >
                    {isCredit ? "↓" : "↑"}
                </span>
                <div>
                    <p className="wallet-transaction-item__message">{data.message}</p>
                    <p className="wallet-transaction-item__date">{data.date}</p>
                </div>
            </div>
            <p
                className={`wallet-transaction-item__amount ${isCredit ? "wallet-transaction-item__amount--credit" : "wallet-transaction-item__amount--debit"
                    }`}
            >
                {isCredit ? "+" : "-"}₹{data.amount}
            </p>
        </div>
    );
}

export default function WalletPage() {
    const [loading, setLoading] = useState(true);
    const [wallet, setWallet] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // ─── Fetch Wallet + Logs ───
    const getWalletData = async () => {
        try {
            setLoading(true);
            setError(null);

            // NOTE: adjust the method/signature below to match your actual
            // apiService wrapper (e.g. apiService.get(url) vs apiService.get(url, config))
           const res = await apiService.getBearer("https://admin.diviniq.in/user_api/get_profile");

            if (res.status) {
                const data = res.results_web || res.results;

                // ✅ Wallet
                setWallet(data.wallet || 0);

                // ❗ If your API doesn't give logs, use dummy or another API
                setTransactions([
                    {
                        id: "1",
                        type: "credit",
                        amount: 100,
                        message: "Wallet Recharge",
                        date: "Today",
                    },
                    {
                        id: "2",
                        type: "debit",
                        amount: 50,
                        message: "Astrology Consultation",
                        date: "Yesterday",
                    },
                ]);
            } else {
                setError("Unable to load your wallet balance right now.");
            }
        } catch (e) {
            setError("Unable to load your wallet balance right now.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getWalletData();
    }, []);

    return (
        <div className="wallet-page">
            <ScrollToTop />
            <Header />

            <div className="wallet-page__content">
                {/* Page header / breadcrumb */}
                <div className="wallet-header">
                    {/* Decorative hanging diya — scoped to header only */}
                    <div className="wallet-diya-hang">
                        <div className="wallet-diya-string"></div>

                        <img
                            src="/assets/img/wallet/diya_wallet.png"
                            alt=""
                            aria-hidden="true"
                            className="wallet-diya-decor"
                        />
                    </div>

                    <div className="wallet-container wallet-header__inner">
                        <p className="wallet-breadcrumb">
                            <span onClick={() => navigate("/")}>Home</span>
                            <span className="wallet-breadcrumb__sep">›</span>
                            <span className="wallet-breadcrumb__current">Wallet</span>
                        </p>
                        <h1 className="wallet-title">
                            Divin<span className="wallet-title__accent">IQ</span> Wallet
                        </h1>
                        <p className="wallet-subtitle">
                            Manage your wallet balance and transactions.
                        </p>
                    </div>
                </div>

                <div className="wallet-container wallet-body">
                    {/* Wallet Balance Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="wallet-balance-card"
                    >
                        {/* Fixed-width crop of the banner art — only ever shows the
                right-side mandala pattern, never the icon on its left edge,
                no matter how wide the card is */}
                        <img
                            src="/assets/img/wallet/walletbanner.png"
                            alt=""
                            aria-hidden="true"
                            className="wallet-balance-card__pattern"
                        />

                        <div className="wallet-balance-card__row">
                            {/* Wallet icon drawn as SVG — reliably positioned, doesn't
                  depend on where the icon happens to fall inside the
                  background image at different screen widths */}
                            <div className="wallet-icon-badge">
                                <svg viewBox="0 0 100 100" width="100%" height="100%">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="46"
                                        fill="none"
                                        stroke="#f4c15d"
                                        strokeWidth="1.5"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="38"
                                        fill="none"
                                        stroke="#f4c15d"
                                        strokeWidth="1"
                                        strokeDasharray="2 3"
                                    />
                                    <rect
                                        x="24"
                                        y="42"
                                        width="46"
                                        height="32"
                                        rx="6"
                                        fill="#f4c15d"
                                    />
                                    <rect
                                        x="24"
                                        y="42"
                                        width="46"
                                        height="32"
                                        rx="6"
                                        fill="none"
                                        stroke="#7a1f3d"
                                        strokeWidth="1.5"
                                        strokeDasharray="3 2"
                                    />
                                    <rect
                                        x="56"
                                        y="54"
                                        width="12"
                                        height="9"
                                        rx="2"
                                        fill="#7a1f3d"
                                    />
                                    <circle cx="60" cy="58" r="1.5" fill="#f4c15d" />
                                    <circle
                                        cx="50"
                                        cy="34"
                                        r="14"
                                        fill="#f4c15d"
                                        stroke="#7a1f3d"
                                        strokeWidth="1.5"
                                    />
                                    <text
                                        x="50"
                                        y="39"
                                        textAnchor="middle"
                                        fontSize="15"
                                        fontWeight="700"
                                        fill="#7a1f3d"
                                    >
                                        ₹
                                    </text>
                                </svg>
                            </div>

                            <div className="wallet-balance-card__text">
                                <p className="wallet-balance-label">Available Balance</p>
                                <h2 className="wallet-balance-amount">
                                    {loading ? (
                                        <span className="wallet-balance-loading">Loading...</span>
                                    ) : (
                                        <>₹ {wallet}</>
                                    )}
                                </h2>
                                {error && (
                                    <p className="wallet-balance-error">{error}</p>
                                )}

                                <button
                                    className="wallet-recharge-btn"
                                    onClick={() => navigate("/recharge-now")}
                                >
                                    <span>✦</span> Recharge Now <span>→</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Transactions */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                        className="wallet-transactions-card"
                    >
                        <h3 className="wallet-transactions-title">Recent Transactions</h3>

                        {loading ? (
                            <p className="wallet-transactions-empty">Loading...</p>
                        ) : transactions.length === 0 ? (
                            <p className="wallet-transactions-empty">No transactions yet</p>
                        ) : (
                            <div className="wallet-transactions-list">
                                {transactions.map((t) => (
                                    <TransactionItem key={t.id} data={t} />
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
}