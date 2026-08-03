 // src/pages/Orders.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideMenu from '../components/layout/SideMenu';
import PopupSearch from '../components/layout/PopupSearch';
import MobileMenu from '../components/layout/MobileMenu';
import apiService from '../services/apiServices';
import './Orders.css';

// ---------- date helpers (unchanged) ----------
const formatDateString = (date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${String(date.getDate()).padStart(2, '0')} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const formatTimeString = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

// Map one row from the /user_api/transaction response into the shape the
// page renders (id, name, duration, type, date/time, status, price, category).
// Real payload covers: "audio" / "video" / "chat" call debits, and
// "Admin" / "bank" wallet credits — mapped below, no mock fallback.
const mapApiTransaction = (t) => {
    // API sends "YYYY-MM-DD HH:mm:ss" (sometimes with single-digit hour/min/sec) —
    // pad it so `new Date(...)` parses reliably cross-browser.
    const rawDate = (t.transaction_date || t.created_at || '').trim();
    const isoish = rawDate.replace(' ', 'T');
    let dateObj = new Date(isoish);
    if (isNaN(dateObj.getTime())) {
        // fallback: pad "H:m:s" pieces manually, e.g. "2026-06-29 16:37:0" / "2025-11-18 11:8:10"
        const m = rawDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/);
        if (m) {
            const [, y, mo, d, h, mi, s] = m;
            dateObj = new Date(Number(y), Number(mo) - 1, Number(d), Number(h), Number(mi), Number(s));
        }
    }
    const validDate = isNaN(dateObj.getTime()) ? new Date() : dateObj;

    const minutes = parseInt(t.time, 10);
    const duration = !isNaN(minutes) && minutes > 0 ? `${minutes} min` : '-';

    const rawType = (t.type || '').toLowerCase();
    const amountType = (t.amount_type || '').toLowerCase();

    let category;
    if (rawType === 'video') category = 'Video';
    else if (rawType === 'chat') category = 'Chat';
    else if (rawType === 'audio') category = 'Call';
    else category = 'Wallet'; // e.g. "Admin", "bank" — recharges/credits/adjustments

    let typeLabel;
    if (category === 'Video') typeLabel = 'Video Call';
    else if (category === 'Chat') typeLabel = 'Chat Consultation';
    else if (category === 'Call') typeLabel = 'Audio Call';
    else typeLabel = t.description || t.type || 'Wallet Transaction';

    const amount = Number(t.amount) || 0;
    // Debit = money spent by the user -> shown as negative. Credit -> positive.
    const price = amountType === 'credit' ? amount : -amount;

    const daysAgo = Math.floor((Date.now() - validDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
        uid: t.id,
        id: t.order_id || t.id,
        name: (t.astro_name || '').trim() || (category === 'Wallet' ? (t.description || 'Wallet') : 'Astrologer'),
        verified: category !== 'Wallet',
        duration,
        type: typeLabel,
        date: formatDateString(validDate),
        time: formatTimeString(validDate),
        dateObj: validDate,
        daysAgo,
        status: 'Completed',
        price,
        category
    };
};

const OrdersPage = () => {
    const navigate = useNavigate();

    // Layout states
    const [showSideMenu, setShowSideMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // Filters & Pagination states
    const [activeCategory, setActiveCategory] = useState('Call');
    const [dateFilter, setDateFilter] = useState('All Time');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // Call simulation feedback
    const [notification, setNotification] = useState(null);

    // Live transaction data
    const [apiTransactions, setApiTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    const dropdownRef = useRef(null);
    const itemsPerPage = 4;

    // Fetch real transactions from the API
    useEffect(() => {
        let isMounted = true;

        const fetchTransactions = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                // Requesting /user_api/transaction via apiService automatically appends Bearer Token
                const json = await apiService.postBearer('https://admin.diviniq.in/user_api/transaction');

                console.log('Response:', json);
                if (!isMounted) return;

                if (json && json.result && json.transactions && Array.isArray(json.transactions.data)) {
                    setApiTransactions(json.transactions.data.map(mapApiTransaction));
                } else {
                    setApiTransactions([]);
                }
            } catch (err) {
                if (isMounted) {
                    console.error('Failed to load transactions:', err);
                    setLoadError('Unable to load your transactions right now. Please try again later.');
                    setApiTransactions([]);
                }
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchTransactions();

        return () => {
            isMounted = false;
        };
    }, []);

    // All data now comes straight from the API — no mock/hardcoded rows.
    const allData = apiTransactions;

    // Close date dropdown clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset pagination on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, dateFilter]);

    // Handle toast notification auto-hide
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // Categories definition
    const categories = [
        { key: 'Call', label: 'Call', icon: 'fas fa-phone-alt' },
        { key: 'Chat', label: 'Chat', icon: 'fas fa-comment-alt' },
        { key: 'Video', label: 'Video', icon: 'fas fa-video' },
        { key: 'Wallet', label: 'Wallet', icon: 'fas fa-wallet' },
        { key: 'Other', label: 'Other', icon: 'fas fa-th-large' },
        { key: 'Gift', label: 'Gift', icon: 'fas fa-gift' }
    ];

    // Filter transaction logic
    const getFilteredTransactions = () => {
        const items = allData.filter(item => item.category === activeCategory);

        return items.filter(item => {
            if (dateFilter === 'Last 7 Days') {
                return item.daysAgo <= 7;
            } else if (dateFilter === 'Last 30 Days') {
                return item.daysAgo <= 30;
            } else if (dateFilter === 'This Month') {
                const today = new Date();
                return item.dateObj.getMonth() === today.getMonth() && item.dateObj.getFullYear() === today.getFullYear();
            }
            return true; // All Time
        });
    };

    const filteredList = getFilteredTransactions();

    // Stats calculations
    const calculateStats = () => {
        // Total Orders
        const totalOrders = filteredList.length;

        // Total Spent
        const totalSpent = filteredList.reduce((sum, item) => {
            // Deduct from spent if item price is negative, recharge adds value so do not count as "spent"
            if (item.price < 0) {
                return sum + Math.abs(item.price);
            }
            return sum;
        }, 0);

        // Completed
        const completedCount = filteredList.filter(item => item.status === 'Completed' || item.status === 'Confirmed').length;
        const completionRate = totalOrders > 0 ? Math.round((completedCount / totalOrders) * 100) : 0;

        // Total Duration (for Call/Chat/Video)
        let totalMinutes = 0;
        filteredList.forEach(item => {
            if (item.duration && item.duration !== '-') {
                const mins = parseInt(item.duration.replace(' min', ''), 10);
                if (!isNaN(mins)) {
                    totalMinutes += mins;
                }
            }
        });

        const hrs = Math.floor(totalMinutes / 60);
        const mins = totalMinutes % 60;
        const durationString = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        return {
            totalOrders,
            totalSpent,
            completedCount,
            completionRate,
            durationString
        };
    };

    const stats = calculateStats();

    // Pagination slice
    const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = filteredList.slice(startIndex, startIndex + itemsPerPage);

    // Call/Chat again handler
    const handleAction = (item) => {
        if (activeCategory === 'Call') {
            setNotification({
                type: 'Call',
                message: `Initiating Call back to ${item.name}... Please wait.`
            });
            // Simulate redirection after delay
            setTimeout(() => {
                navigate(`/astrologer`);
            }, 2500);
        } else if (activeCategory === 'Chat') {
            setNotification({
                type: 'Chat',
                message: `Opening chat box with ${item.name}...`
            });
            setTimeout(() => {
                navigate(`/astrologer`);
            }, 2000);
        } else if (activeCategory === 'Wallet') {
            navigate('/recharge-now');
        } else {
            navigate('/astrologer');
        }
    };

    // Helper for category-specific circular icon
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Call': return 'fas fa-phone-alt';
            case 'Chat': return 'fas fa-comment-alt';
            case 'Video': return 'fas fa-video';
            case 'Wallet': return 'fas fa-wallet';
            case 'Other': return 'fas fa-om';
            case 'Gift': return 'fas fa-gift';
            default: return 'fas fa-receipt';
        }
    };

    // Helper for action button label
    const getActionBtnLabel = (category) => {
        switch (category) {
            case 'Call': return 'Call Again';
            case 'Chat': return 'Chat Again';
            case 'Video': return 'Video Again';
            case 'Wallet': return 'Recharge';
            case 'Other': return 'Book Again';
            case 'Gift': return 'Send Gift';
            default: return 'View';
        }
    };

    return (
        <div className="dq-page orders-page">
            {/* Sidemenu */}
            <SideMenu isOpen={showSideMenu} onClose={() => setShowSideMenu(false)} />

            {/* Popup Search */}
            <PopupSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

            {/* Mobile Menu */}
            <MobileMenu isOpen={showMobileMenu} onClose={() => setShowMobileMenu(false)} />

            {/* Header */}
            <Header
                onMenuToggle={() => setShowMobileMenu(true)}
                onSideMenuToggle={() => setShowSideMenu(true)}
                onSearchToggle={() => setShowSearch(true)}
            />

            {/* Toast Notification Simulation */}
            {notification && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    zIndex: 9999,
                    backgroundColor: '#7a0c0c',
                    color: '#ffffff',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(122, 12, 12, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    animation: 'slideUp 0.3s ease-out',
                    border: '1px solid #f9ebe3'
                }}>
                    <i className="fas fa-spinner fa-spin" style={{ color: '#fff' }}></i>
                    <span style={{ fontWeight: '500', fontSize: '14px' }}>{notification.message}</span>
                </div>
            )}

            <div className="orders-container">
                {/* Breadcrumbs */}
                <div className="orders-breadcrumbs">
                    <Link to="/">Home</Link>
                    <span>&gt;</span>
                    <span className="active-crumb">Orders</span>
                </div>

                {/* Page Header Card */}
                <div className="orders-header">
                    <div className="orders-header-left">
                        <h1>Orders & Transactions</h1>
                        <p>View all your activities, purchases, and wallet usage.</p>
                    </div>
                    <div className="orders-header-right">
                        <img
                            src="/assets/img/images/profile-hero-banner.png"
                            alt="Temples Background"
                            className="orders-header-bg-img"
                        />
                    </div>
                </div>

                {/* Filters & Control Bar */}
                <div className="orders-controls-bar">
                    <div className="orders-category-filters">
                        {categories.map((cat) => (
                            <button
                                key={cat.key}
                                className={`filter-btn ${activeCategory === cat.key ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.key)}
                            >
                                <i className={cat.icon}></i>
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    <div className="orders-date-selector" ref={dropdownRef}>
                        <button
                            className="date-dropdown-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <i className="far fa-calendar-alt"></i>
                            <span>{dateFilter}</span>
                            <i className="fas fa-chevron-down"></i>
                        </button>

                        {isDropdownOpen && (
                            <div className="date-dropdown-menu">
                                {['All Time', 'Last 7 Days', 'Last 30 Days', 'This Month'].map((option) => (
                                    <div
                                        key={option}
                                        className={`date-dropdown-item ${dateFilter === option ? 'active' : ''}`}
                                        onClick={() => {
                                            setDateFilter(option);
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="orders-stats-grid">
                    <div className="stat-card stat-orders">
                        <div className="stat-icon-wrapper">
                            <i className="fas fa-shopping-bag"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">
                                {activeCategory === 'Wallet' ? 'Total Transactions' : 'Total Orders'}
                            </span>
                            <span className="stat-value">{stats.totalOrders}</span>
                            <span className="stat-sub">{dateFilter}</span>
                        </div>
                    </div>

                    <div className="stat-card stat-spent">
                        <div className="stat-icon-wrapper">
                            <i className="fas fa-rupee-sign"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">
                                {activeCategory === 'Wallet' ? 'Total Spent' : 'Total Spent'}
                            </span>
                            <span className="stat-value">₹ {stats.totalSpent.toLocaleString('en-IN')}</span>
                            <span className="stat-sub">{dateFilter}</span>
                        </div>
                    </div>

                    <div className="stat-card stat-completed">
                        <div className="stat-icon-wrapper">
                            <i className="fas fa-clipboard-check"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Completed</span>
                            <span className="stat-value">{stats.completedCount}</span>
                            <span className="stat-sub">{stats.completionRate}% of Total</span>
                        </div>
                    </div>

                    <div className="stat-card stat-duration">
                        <div className="stat-icon-wrapper">
                            <i className="fas fa-clock"></i>
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">
                                {activeCategory === 'Wallet' ? 'Avg/Activity' : 'Total Duration'}
                            </span>
                            <span className="stat-value">
                                {activeCategory === 'Wallet' || activeCategory === 'Other' || activeCategory === 'Gift' ? 'N/A' : stats.durationString}
                            </span>
                            <span className="stat-sub">Across all orders</span>
                        </div>
                    </div>
                </div>

                {/* Transactions List */}
                <div className="orders-list-card">
                    {isLoading ? (
                        <div className="orders-empty-state">
                            <i className="fas fa-spinner fa-spin"></i>
                            <h3>Loading transactions...</h3>
                            <p>Fetching your latest activity.</p>
                        </div>
                    ) : loadError ? (
                        <div className="orders-empty-state">
                            <i className="fas fa-exclamation-circle"></i>
                            <h3>Something went wrong</h3>
                            <p>{loadError}</p>
                        </div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="orders-empty-state">
                            <i className="fas fa-receipt"></i>
                            <h3>No orders yet</h3>
                            <p>Try changing the date filter or category.</p>
                        </div>
                    ) : (
                        paginatedItems.map((item) => (
                            <div key={item.uid || item.id} className="order-item-row">
                                <div className="order-item-left">
                                    <div className="order-category-icon">
                                        <i className={getCategoryIcon(activeCategory)}></i>
                                    </div>
                                    <div className="order-details">
                                        <div className="order-meta">
                                            <span>Order ID: #{item.id}</span>
                                            {item.duration && item.duration !== '-' && (
                                                <>
                                                    <span>•</span>
                                                    <span>{item.duration}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="order-name-container">
                                            <h3 className="order-title">{item.name}</h3>
                                            {item.verified && (
                                                <i className="fas fa-check-circle verified-icon"></i>
                                            )}
                                        </div>
                                        <p className="order-subtitle">{item.type}</p>
                                    </div>
                                </div>

                                <div className="order-date-col">
                                    <i className="far fa-calendar-alt"></i>
                                    <div className="order-datetime">
                                        <span>{item.date}</span>
                                        <span className="order-time">{item.time}</span>
                                    </div>
                                </div>

                                <div className="order-status-col">
                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div className="order-right-col">
                                    <span className={`order-price ${item.price < 0 ? 'negative' : item.price > 0 ? 'positive' : ''}`}>
                                        {item.price < 0 ? `- ₹${Math.abs(item.price)}` : item.price > 0 ? `+ ₹${item.price}` : '₹0'}
                                    </span>
                                    {item.status !== 'Failed' && (
                                        <button
                                            className="order-action-btn"
                                            onClick={() => handleAction(item)}
                                        >
                                            {activeCategory === 'Call' && <i className="fas fa-phone-alt"></i>}
                                            {activeCategory === 'Chat' && <i className="fas fa-comment-alt"></i>}
                                            {activeCategory === 'Gift' && <i className="fas fa-gift"></i>}
                                            {getActionBtnLabel(activeCategory)}
                                        </button>
                                    )}
                                    <i className="fas fa-chevron-right chevron-arrow" onClick={() => handleAction(item)}></i>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination bar */}
                {filteredList.length > 0 && (
                    <div className="orders-pagination-bar">
                        <div className="pagination-info">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredList.length)} of {filteredList.length} orders
                        </div>
                        <div className="pagination-controls">
                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            >
                                <i className="fas fa-chevron-left"></i>
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`page-btn ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="page-btn"
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            >
                                <i className="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default OrdersPage;