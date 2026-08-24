import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import apiService from "../../services/apiServices";
import { mergeGiftTransactions } from "../../services/giftService";
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

const mapWalletTransaction = (t) => {
    const amountType = (t.amount_type || '').toLowerCase();
    const rawType = (t.type || t.category || '').toLowerCase();
    const desc = (t.description || '').trim();
    const astroName = (t.astro_name || '').trim();
    const pujaName = (t.puja_name || '').trim();
    
    const isCredit = amountType === 'credit' || rawType === 'admin' || rawType === 'bank' || desc.toLowerCase().includes('recharge') || desc.toLowerCase().includes('credit');
    
    let message = desc;
    if (!message) {
        if (rawType === 'gift' || desc.toLowerCase().includes('gift')) {
            message = astroName ? `Gift sent to ${astroName}` : 'Gift Transaction';
        } else if (rawType === 'puja' || rawType === 'pooja' || rawType === 'chadhava' || desc.toLowerCase().includes('puja') || desc.toLowerCase().includes('chadhava')) {
            message = pujaName ? `Puja Booking: ${pujaName}` : 'Puja / Sacred Offering Booking';
        } else if (rawType === 'chat') {
            message = astroName ? `Chat Consultation with ${astroName}` : 'Chat Consultation';
        } else if (rawType === 'audio' || rawType === 'call') {
            message = astroName ? `Call Consultation with ${astroName}` : 'Audio Call Consultation';
        } else if (rawType === 'video') {
            message = astroName ? `Video Consultation with ${astroName}` : 'Video Call Consultation';
        } else {
            message = isCredit ? "Wallet Recharge" : "Wallet Transaction";
        }
    }
    
    const rawDate = (t.transaction_date || t.created_at || '').trim();
    let dateStr = "Recent";
    if (rawDate) {
        const isoish = rawDate.replace(' ', 'T');
        const d = new Date(isoish);
        if (!isNaN(d.getTime())) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const dateFormatted = `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
            let hours = d.getHours();
            const minutes = String(d.getMinutes()).padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            const timeFormatted = `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
            dateStr = `${dateFormatted}, ${timeFormatted}`;
        } else {
            dateStr = rawDate;
        }
    }

    return {
        id: t.id || t.order_id || Math.random().toString(),
        type: isCredit ? "credit" : "debit",
        amount: Math.abs(Number(t.amount) || 0),
        message: message,
        date: dateStr,
    };
};

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

            const [profileRes, txnRes] = await Promise.all([
                apiService.getBearer("https://admin.vaidikguru.com/user_api/get_profile").catch(() => null),
                apiService.postBearer("https://admin.vaidikguru.com/user_api/transaction").catch(() => null)
            ]);

            if (profileRes?.status) {
                const data = profileRes.results_web || profileRes.results;
                setWallet(Number(data?.wallet || 0));
            }

            let apiList = [];
            if (txnRes && txnRes.result && txnRes.transactions && Array.isArray(txnRes.transactions.data)) {
                apiList = txnRes.transactions.data;
            } else if (txnRes && Array.isArray(txnRes.data)) {
                apiList = txnRes.data;
            }

            const merged = mergeGiftTransactions(apiList);
            setTransactions(merged.map(mapWalletTransaction));
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
                            Vaidik<span className="wallet-title__accent">Guru</span> Wallet
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