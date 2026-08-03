import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import SideMenu from '../components/layout/SideMenu';
import MobileMenu from '../components/layout/MobileMenu';
import PopupSearch from '../components/layout/PopupSearch';
import ScrollTop from '../components/common/ScrollTop';
import ChadhavaService from '../services/chadhavaServices';
import apiService from '../services/apiServices';
import './ChadhavaListing.css';
import MobileBottomNav from '../components/layout/MobileNavbar';

// NOTE: verify this exact path against your backend router mount point —
// the handler is `router.post("/new_consultation_add", ...)`, normally
// mounted under a prefix. Follows the same pattern as other endpoints in
// this codebase (https://admin.diviniq.in/user_api/..., /puja/..., etc).
// Adjust the prefix below if your backend mounts it differently.
const CONSULTATION_API = "https://admin.diviniq.in/user_api/new_consultation_add";

/* ── helpers ── */
const BADGE_MAP = [
  { label:'Most Popular', cls:'popular', icon:'fas fa-fire' },
  { label:'New',          cls:'new',     icon:'fas fa-bolt' },
  { label:'Bestseller',   cls:'best',    icon:'fas fa-star' },
  { label:'Limited',      cls:'limited', icon:'fas fa-clock'},
];
const getBadge = (i) => BADGE_MAP[i % BADGE_MAP.length];

/* ── Custom Radio ── */
const RadioOpt = ({ label, count, checked, onChange }) => (
  <div className="ch-opt" onClick={onChange}>
    <span className={`ch-opt-circle${checked?' on':''}`} />
    <span>{label}</span>
    {count !== undefined && <span className="ch-opt-count">({count})</span>}
  </div>
);

/* ── Skeleton Card ── */
const SkeletonCard = () => (
  <div className="ch-card">
    <div className="ch-sk" style={{height:190,borderRadius:'14px 14px 0 0'}} />
    <div style={{padding:14}}>
      <div className="ch-sk mb-2" style={{height:14,width:'75%'}} />
      <div className="ch-sk mb-2" style={{height:12,width:'50%'}} />
      <div className="ch-sk mb-1" style={{height:11,width:'90%'}} />
      <div className="ch-sk mb-3" style={{height:11,width:'70%'}} />
      <div className="ch-sk" style={{height:1,marginBottom:10}} />
      <div className="d-flex justify-content-between">
        <div className="ch-sk" style={{height:18,width:70}} />
        <div className="ch-sk" style={{height:18,width:90}} />
      </div>
    </div>
  </div>
);

/* ── Chadhava Card ── */
const ChadhavaCard = ({ item, index, onView }) => {
  const [liked,  setLiked]  = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const { label, cls, icon } = getBadge(index);

  return (
    <motion.div className="ch-card"
      initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{duration:.28,delay:Math.min(index*.04,.32)}}
      onClick={()=>onView(item)}>

      {/* Badge */}
      <div className="ch-badge-wrap">
        <span className={`ch-badge ${cls}`}><i className={icon} />{label}</span>
      </div>

      {/* Heart */}
      <button className={`ch-heart${liked?' on':''}`}
        onClick={e=>{e.stopPropagation();setLiked(!liked)}}>
        <i className={liked?'fas fa-heart':'far fa-heart'} />
      </button>

      {/* Image */}
      <div className="ch-img-wrap">
        {(() => {
          const imgSrc = item.chadhavaImage || item.image || item.pimage;
          return imgSrc && !imgErr
            ? (
              <>
                <img src={imgSrc} alt={item.title || item.name} onError={()=>setImgErr(true)} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    padding: '10px 14px',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      maxWidth: '58%',
                      textAlign: 'right',
                      fontSize: 13.5,
                      fontWeight: 700,
                      lineHeight: 1.3,
                      color: '#5e1730',
                      textShadow: '0 1px 3px rgba(255,255,255,0.55)',
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              </>
            )
            : <div className="ch-img-placeholder"><i className="fas fa-om" /></div>;
        })()}
      </div>

      {/* Body */}
      <div className="ch-card-body">
        <div className="ch-card-name">{item.title}</div>
        {item.templeName && (
          <div className="ch-card-loc">
            <i className="fas fa-gopuram" />
            {item.templeName}
          </div>
        )}
        <div className="ch-card-desc">
          {item.description || item.short_description || 'Experience divine blessings through this sacred offering.'}
        </div>
      </div>

      {/* Footer */}
      <div className="ch-card-footer">
        <div>
          <span className="ch-price-from">Starting from</span>
          <div className="ch-price">₹{item.price > 0 ? item.price.toLocaleString('en-IN') : 'Free'}</div>
        </div>
        <button className="ch-details-btn" onClick={e=>{e.stopPropagation();onView(item)}}>
          Details View <i className="fas fa-arrow-right" />
        </button>
      </div>
    </motion.div>
  );
};

/* ── Personalized Recommendation Modal — posts to /new_consultation_add ── */
const RecommendationModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { ok: true|false, msg }

  if (!isOpen) return null;

  const reset = () => {
    setName(""); setPhone(""); setMessage(""); setResult(null); setSubmitting(false);
  };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setResult({ ok: false, msg: "Please enter your name and phone number." });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await apiService.post(CONSULTATION_API, {
        service: "chadhava",
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      });
      if (res?.status) {
        setResult({ ok: true, msg: "Thanks! Our team will reach out to you shortly." });
      } else {
        setResult({ ok: false, msg: res?.message || "Something went wrong. Please try again." });
      }
    } catch (err) {
      console.error("consultation submit error:", err);
      setResult({ ok: false, msg: "Network error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: 18, width: "100%", maxWidth: 420,
          padding: "26px 24px", boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h5 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#111827" }}>
            Get a Personalized Recommendation
          </h5>
          <button
            onClick={handleClose}
            style={{
              width: 28, height: 28, borderRadius: "50%", border: "1.5px solid #e5e7eb",
              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <p style={{ fontSize: 12.5, color: "#6b7280", margin: "0 0 18px" }}>
          Tell us what you're looking for and our team will suggest the right Chadhava offering for you.
        </p>

        {result?.ok ? (
          <div style={{ textAlign: "center", padding: "18px 0" }}>
            <i className="fas fa-check-circle" style={{ fontSize: 34, color: "#059669", marginBottom: 10, display: "block" }} />
            <p style={{ fontSize: 13.5, color: "#111827", fontWeight: 600, margin: 0 }}>{result.msg}</p>
            <button
              onClick={handleClose}
              className="ch-rec-btn"
              style={{ marginTop: 18 }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px", marginBottom: 12,
                border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, outline: "none",
              }}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: "100%", padding: "11px 14px", marginBottom: 12,
                border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, outline: "none",
              }}
            />
            <textarea
              placeholder="What are you looking for? (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{
                width: "100%", padding: "11px 14px", marginBottom: 12,
                border: "1.5px solid #e5e7eb", borderRadius: 9, fontSize: 13.5, outline: "none",
                resize: "vertical", fontFamily: "inherit",
              }}
            />
            {result?.ok === false && (
              <p style={{ color: "#dc2626", fontSize: 12, marginBottom: 10 }}>{result.msg}</p>
            )}
            <button
              type="submit"
              className="ch-rec-btn"
              disabled={submitting}
              style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ── Recommend Card ── */
const RecommendCard = ({ onOpen }) => (
  <div className="ch-rec">
    <div className="ch-rec-ico"><i className="fas fa-hands-praying" /></div>
    <div className="ch-rec-t">Can't find the right offering?</div>
    <p className="ch-rec-s">Tell us your requirements and our team will help you.</p>
    <button className="ch-rec-btn" onClick={onOpen}>Get Personalized Recommendation</button>
    <div className="ch-rec-trust">Trusted by 50K+ Devotees</div>
    <div>
      {['#c0392b','#e67e22','#27ae60','#2980b9','#8e44ad'].map((c,i)=>(
        <span key={i} className="ch-rec-av" style={{background:c}}>{['A','M','R','S','V'][i]}</span>
      ))}
    </div>
  </div>
);

/* ── Sidebar ── */
const SidebarContent = ({ filters, setFilters, onApply, searchVal, setSearchVal }) => {
  const set   = (k,v) => setFilters(f=>({...f,[k]:v}));
  const reset = ()    => { setFilters({category:'all',priceBucket:'',sortBy:'popular',temple:'',occasion:'',search:''}); setSearchVal(''); };
  const [rv, setRv]   = useState(10000);

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="ch-sb-title">Filters</span>
        <button className="ch-sb-reset" onClick={reset}>Reset All</button>
      </div>

      {/* Search in sidebar */}
      <div className="ch-sb-search">
        <input
          type="text"
          className="ch-sb-search-input"
          placeholder="Search offerings..."
          value={searchVal}
          onChange={e=>setSearchVal(e.target.value)}
          onKeyDown={e=>e.key==='Enter' && onApply()}
        />
        <button className="ch-sb-search-btn" onClick={onApply}>
          <i className="fas fa-search" />
        </button>
      </div>

      <div className="ch-div" />

      <div className="ch-fh">Category</div>
      {[
        {v:'all',l:'All Chadhavas',c:45},{v:'saree',l:'Saree Chadava',c:12},
        {v:'vastra',l:'Vastra Chadava',c:9},{v:'chola',l:'Chola Chadava',c:7},
        {v:'pushpa',l:'Pushpa Chadava',c:6},{v:'other',l:'Other Chadavas',c:11},
      ].map(({v,l,c})=>(
        <RadioOpt key={v} label={l} count={c} checked={filters.category===v} onChange={()=>set('category',v)} />
      ))}

      <div className="ch-div" />

      <div className="ch-fh">Price Range</div>
      <input type="range" className="ch-range-input" min={0} max={10000} step={100} value={rv}
        onChange={e=>setRv(+e.target.value)}
        style={{background:`linear-gradient(to right,#c0392b ${rv/100}%,#e5e7eb ${rv/100}%)`}}
      />
      <div className="ch-range-ends"><span>₹0</span><span>₹10,000+</span></div>
      <div className="ch-buckets">
        {[['₹0-₹499','0-499'],['₹500-₹1499','500-1499'],['₹1500-₹4999','1500-4999'],['₹5000+','5000+']].map(([l,v])=>(
          <button key={v} className={`ch-bucket${filters.priceBucket===v?' on':''}`}
            onClick={()=>set('priceBucket',filters.priceBucket===v?'':v)}>{l}</button>
        ))}
      </div>

      <div className="ch-div" />

      <div className="ch-fh">Sort By</div>
      {[['popular','Most Popular'],['price_low','Price: Low to High'],['price_high','Price: High to Low'],['recent','Recently Added'],['az','A - Z']].map(([v,l])=>(
        <RadioOpt key={v} label={l} checked={filters.sortBy===v} onChange={()=>set('sortBy',v)} />
      ))}

      <div className="ch-div" />

      <div className="ch-fh">Temple</div>
      <select className="ch-sel" value={filters.temple} onChange={e=>set('temple',e.target.value)}>
        <option value="">All Temples</option>
        {['Ujjain Mahakaleshwar','Kashi Vishwanath','Tirupati Balaji','Gaya Vishnupad','Moksha Dham, Haridwar'].map(t=>(
          <option key={t}>{t}</option>
        ))}
      </select>

      <div className="ch-div" />

      <div className="ch-fh">Occasion</div>
      <select className="ch-sel" value={filters.occasion} onChange={e=>set('occasion',e.target.value)}>
        <option value="">All Occasions</option>
        {['Ekadashi','Somvar','Purnima','Amavasya','Navratri','Mahashivratri'].map(o=>(
          <option key={o}>{o}</option>
        ))}
      </select>

      <button className="ch-apply" onClick={onApply}>
        <i className="fas fa-filter" /> Apply Filters
      </button>
    </>
  );
};

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
const ChadhavaListing = () => {
  const navigate = useNavigate();
  const [items,         setItems]         = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(false);
  const [drawerOpen,    setDrawerOpen]    = useState(false);
  const [page,          setPage]          = useState(1);
  const [totalPages,    setTotalPages]    = useState(5);
  const [searchVal,     setSearchVal]     = useState('');
  const [filters, setFilters] = useState({category:'all',priceBucket:'',sortBy:'popular',temple:'',occasion:'',search:''});

  const [showSideMenu,   setShowSideMenu]   = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch,     setShowSearch]     = useState(false);
  const [showRecModal,   setShowRecModal]   = useState(false);

  const PAGE_SIZE = 9;
  const [allItems, setAllItems] = useState([]); // full list from the API, unsliced

  const fetchItems = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const res = await ChadhavaService.getChadhavaList(filters.search || null);
      // API: { status:true, data:[{ result:[...] }] }
      let list = null;
      if (res?.status && res?.data?.[0]?.result) list = res.data[0].result;
      else if (res?.results) list = res.results;
      else if (Array.isArray(res)) list = res;

      if (list) {
        setAllItems(list);
        setTotalPages(Math.max(1, Math.ceil(list.length / PAGE_SIZE)));
      } else {
        setError(true);
      }
    } catch (e) { console.error(e); setError(true); }
    finally  { setLoading(false); }
  }, [filters.search]);

  useEffect(()=>{ fetchItems(); },[fetchItems]);

  // Since the API returns everything in one shot, pagination here is
  // purely a client-side slice of the already-fetched full list — the
  // "page" state just picks which 9-item window of allItems to show.
  useEffect(() => {
    const start = (page - 1) * PAGE_SIZE;
    setItems(allItems.slice(start, start + PAGE_SIZE));
  }, [allItems, page]);

  const handleSearch = () => { setFilters(f=>({...f,search:searchVal})); setPage(1); };
  const handleApply  = () => { setPage(1); fetchItems(); setDrawerOpen(false); };
  const handleView   = (item) => navigate(`/chadhava/${item._id || item.id}`);
  const goPage = (p) => { setPage(p); window.scrollTo({top:0,behavior:'smooth'}); };
  const pages  = Array.from({length:Math.min(totalPages,5)},(_,i)=>i+1);
  const isSinglePage = totalPages <= 1;

  return (
    <div className="main-wrapper" style={{paddingTop:0,marginTop:0}}>
     
      <SideMenu   isOpen={showSideMenu}   onClose={()=>setShowSideMenu(false)} />
      <PopupSearch isOpen={showSearch}    onClose={()=>setShowSearch(false)} />
      <MobileMenu isOpen={showMobileMenu} onClose={()=>setShowMobileMenu(false)} />
        
      <Header
        onMenuToggle={()=>setShowMobileMenu(true)}
        onSideMenuToggle={()=>setShowSideMenu(true)}
        onSearchToggle={()=>setShowSearch(true)}
      />

      {/* ══ HERO ══ */}
      <div className="ch-hero-outer">
        <div className="container">
          <div className="ch-hero">
            <img src="/assets/img/bg/chadawa.webp" alt="Explore Holy Chadavas - Sacred Offerings" className="ch-hero-img" />
           
          </div>

         
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="ch-body">
        <div className="container">

          {/* Mobile top bar */}
          <div className="ch-mob-top">
            <button className="ch-filter-mob-btn" onClick={()=>setDrawerOpen(true)}>
              <i className="fas fa-sliders-h" /> Filters
            </button>
            <select className="ch-sort-sel" value={filters.sortBy} onChange={e=>setFilters(f=>({...f,sortBy:e.target.value}))}>
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low–High</option>
              <option value="price_high">Price: High–Low</option>
              <option value="recent">Recently Added</option>
              <option value="az">A – Z</option>
            </select>
          </div>

          {/* Drawer */}
          <div className="ch-drawer-wrap">
            <div className={`ch-drawer-overlay${drawerOpen?' show':''}`} onClick={()=>setDrawerOpen(false)} />
            <div className={`ch-drawer${drawerOpen?' open':''}`}>
              <SidebarContent filters={filters} setFilters={setFilters} onApply={handleApply} searchVal={searchVal} setSearchVal={setSearchVal} />
            </div>
          </div>

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-md-3 ch-sidebar-desktop">
              <div className="ch-sidebar-box">
                <SidebarContent filters={filters} setFilters={setFilters} onApply={handleApply} searchVal={searchVal} setSearchVal={setSearchVal} />
              </div>
            </div>

            {/* Main */}
            <div className="col-md-9 col-12">

              {/* Header row */}
              <div className="ch-mhdr">
                <div className="ch-mhdr-left">
                  <h2>Sacred Chadhavas</h2>
                  <p>Choose from our wide range of holy offerings and feel the divine blessings.</p>
                </div>
                <div className="ch-mhdr-right">
                  {!loading && (
                    <span className="ch-showing">
                      Showing {allItems.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, allItems.length)} of {allItems.length} offerings
                    </span>
                  )}
                  <select className="ch-sort-sel" value={filters.sortBy} onChange={e=>setFilters(f=>({...f,sortBy:e.target.value}))}>
                    <option value="popular">Top Rated</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="recent">Recently Added</option>
                    <option value="az">A – Z</option>
                  </select>
                </div>
              </div>

              {/* Error */}
              {error && !loading && (
                <div className="text-center py-5">
                  <i className="fas fa-exclamation-circle fa-3x d-block mb-3" style={{color:'#d1d5db'}} />
                  <p className="fw-bold text-dark mb-1">Chadhava not found</p>
                  <p className="small text-muted mb-3">Please check your connection and try again.</p>
                  <button className="ch-apply" style={{width:'auto',display:'inline-flex',padding:'10px 28px',borderRadius:9}}
                    onClick={fetchItems}>Retry</button>
                </div>
              )}

              {/* Grid */}
              {!error && (
                <div className="row g-3">
                  {loading
                    ? Array.from({length:9}).map((_,i)=>(
                        <div key={i} className="col-12 col-md-4"><SkeletonCard /></div>
                      ))
                    : <>
                        {items.map((item,i)=>(
                          <div key={item._id||i} className="col-12 col-md-4">
                            <ChadhavaCard item={item} index={i} onView={handleView} />
                          </div>
                        ))}
                        <div className="col-12 col-md-4"><RecommendCard onOpen={() => setShowRecModal(true)} /></div>
                      </>
                  }
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && items.length > 0 && !isSinglePage && (
                <div className="ch-pg">
                  <button className="ch-pg-btn" disabled={page===1} onClick={()=>goPage(page-1)}>
                    <i className="fas fa-chevron-left" style={{fontSize:11}} />
                  </button>
                  {pages.map(p=>(
                    <button key={p} className={`ch-pg-btn${page===p?' cur':''}`} onClick={()=>goPage(p)}>{p}</button>
                  ))}
                  {totalPages>5 && <><span className="ch-pg-dots">…</span><button className="ch-pg-btn" onClick={()=>goPage(totalPages)}>{totalPages}</button></>}
                  <button className="ch-pg-btn" disabled={page===totalPages} onClick={()=>goPage(page+1)}>
                    <i className="fas fa-chevron-right" style={{fontSize:11}} />
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      <Footer />
      <ScrollTop />
      <MobileBottomNav/>

      <RecommendationModal isOpen={showRecModal} onClose={() => setShowRecModal(false)} />
    </div>
  );
};

export default ChadhavaListing;