import { useState, useRef, useEffect } from "react";

/* ─────────────────────────────────────────────────────────────────────────
   LoginOTPModal
   Usage in Header.jsx (zero changes to Header logic needed):

     import LoginOTPModal from '../accounts/LoginOTPModal';

     <LoginOTPModal
       isOpen={isModalOpen}
       onClose={() => setIsModalOpen(false)}
       onSuccess={(data) => saveStorage(data)}
     />
   ───────────────────────────────────────────────────────────────────────── */

/* ── CONFIGURATION & API ─────────────────────────────────────────────── */
const API_BASE = "https://admin.diviniq.in/user_api/user_login_new";
const OTP_LEN = 4; // Single source of truth for dynamic OTP rendering

// Step 1: send OTP
async function apiSendOTP(phone) {
  const body = {
    number:       phone,
    otp:          "",
    type:         "",
    country:      "",
    country_code: "INR",
    deviceType:   "APP",
    deviceID:     "hbj",
    deviceToken:  "gvh",
  };
  try {
    const res  = await fetch(API_BASE, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    if (data?.status === true) {
      return { success: true, data: { expiresIn: 178, type: data.type, message: data.message } };
    }
    return { success: false, error: data?.message || "Failed to send OTP." };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

// Step 2: verify OTP
async function apiVerifyOTP(phone, otp) {
  const body = {
    number:       phone,
    otp,
    country:      "INR",
    country_code: "91",
  };
  try {
    const res  = await fetch(API_BASE, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });
    const data = await res.json();
    if (data?.status === true && data.results) {
      return {
        success: true,
        data: {
          token: data.token,
          user: {
            id:          data.results.id,
            name:        data.results.name,
            email:       data.results.email,
            number:      data.results.number,
            phone:       data.results.number,
            profile_img: data.results.profile_img,
          },
        },
      };
    }
    return { success: false, error: data?.message || "OTP verification failed." };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}

/* ── COLOUR PALETTE ── */
const C = {
  panelBg1:     "#0D0118",
  panelBg2:     "#200840",
  panelBg3:     "#4A0E82",
  gold:         "#C8862A",
  goldLight:    "#E5A83A",
  goldBorder:   "rgba(200,134,42,0.55)",
  titleBlack:   "#111827",
  textMed:      "#374151",
  textGray:     "#6B7280",
  textHint:     "#9CA3AF",
  borderLight:  "#E5E7EB",
  btnPurple:    "#4A0E82",
  btnVerify1:   "#6B1459",
  btnVerify2:   "#9D1B6E",
  linkPurple:   "#8B1E6B",
  labelPurple:  "#7C3AED",
  phonePill:    "#F3EDF8",
  createBg:     "#F5EEF8",
  secureBg:     "#F5EEF8",
  otpBorder:    "#C084FC",
  otpFocus:     "#7C3AED",
  expireRed:    "#DC2626",
  successGreen: "#059669",
};

/* ── SPINNER ── */
function Spinner({ size = 18, color = "#fff" }) {
  return (
    <span style={{
      display: "inline-block",
      width: size, height: size,
      border: `2.5px solid rgba(255,255,255,0.3)`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "diq-spin 0.7s linear infinite",
    }} />
  );
}

/* ── TOAST ── */
function Toast({ msg, type = "error", onDone }) {
  useEffect(() => {
    const id = setTimeout(onDone, 3500);
    return () => clearTimeout(id);
  }, [msg, onDone]);
  return (
    <div style={{
      position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)",
      zIndex: 100001,
      background: type === "success" ? C.successGreen : "#DC2626",
      color: "#fff", padding: "12px 22px", borderRadius: 10,
      fontSize: 13.5, fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      display: "flex", alignItems: "center", gap: 8,
      animation: "diq-fadein 0.25s ease", whiteSpace: "nowrap",
    }}>
      {type === "success" ? "✅" : "⚠️"} {msg}
    </div>
  );
}

/* ── LEFT PANEL ── */
function LeftPanel() {
  return (
    <div style={{
      width: 300, 
      minWidth: 300,
      backgroundImage: `url('/assets/img/login.jpeg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      borderRadius: "20px 0 0 20px",
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center",
      padding: "32px 24px 28px",
      position: "relative", 
      overflow: "hidden",
    }} />
  );
}

/* ── LOGIN SCREEN ── */
function LoginScreen({ onSendOTP }) {
  const [phone, setPhone]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const ok = phone.length === 10 && !loading;

  const handleSend = async () => {
    if (!ok) return;
    setError(null);
    setLoading(true);
    const res = await apiSendOTP(phone);
    setLoading(false);
    if (res.success) {
      onSendOTP(phone, res.data);
    } else {
      setError(res.error);
    }
  };

  return (
    <div style={{ padding:"36px 36px 32px", display:"flex", flexDirection:"column", flex:1 }}>
      <h1 style={{ fontSize:27, fontWeight:800, color:C.titleBlack, margin:"0 0 4px", lineHeight:1.2 }}>Login to Your Account</h1>
      <p style={{ fontSize:13.5, color:C.textGray, margin:"0 0 26px" }}>We're happy to have you back! 🙏</p>

      <div style={{ position:"relative", textAlign:"center", marginBottom:22 }}>
        <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:C.borderLight }}/>
        <span style={{ position:"relative", background:"#fff", padding:"0 14px", fontSize:12.5, fontWeight:700, color:C.labelPurple, letterSpacing:0.3 }}>Login with Mobile Number</span>
      </div>

      <label style={{ fontSize:13.5, fontWeight:700, color:C.titleBlack, marginBottom:8, display:"block" }}>Mobile Number</label>
      <div style={{
        display:"flex",
        border:`1.5px solid ${error ? C.expireRed : C.borderLight}`,
        borderRadius:10, overflow:"hidden", marginBottom:7, transition:"border-color 0.2s",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, padding:"0 12px", background:"#FAFAFA", borderRight:`1.5px solid ${C.borderLight}`, fontSize:13, color:C.textMed, whiteSpace:"nowrap", minWidth:82 }}>
          <span style={{ fontSize:18 }}>🇮🇳</span>
          <span style={{ fontSize:11, color:"#aaa" }}>▾</span>
          <span style={{ fontWeight:600 }}>+91</span>
        </div>
        <input
          type="tel"
          value={phone}
          onChange={e => { setError(null); setPhone(e.target.value.replace(/\D/g,"").slice(0,10)); }}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder="Enter your mobile number"
          style={{ flex:1, padding:"13px 14px", border:"none", outline:"none", fontSize:13.5, color:C.titleBlack, background:"transparent" }}
        />
      </div>

      {error && (
        <p style={{ fontSize:12.5, color:C.expireRed, margin:"0 0 6px", display:"flex", alignItems:"center", gap:4 }}>
          <span>⚠️</span> {error}
        </p>
      )}
      <p style={{ fontSize:12, color:C.textHint, margin:"0 0 20px" }}>We will send you a {OTP_LEN}-digit OTP on this number</p>

      <button
        onClick={handleSend}
        disabled={!ok}
        style={{
          width:"100%", padding:"15px",
          background: ok ? C.btnPurple : "#6c1191be",
          border:"none", borderRadius:10, color:"#eaeff1", fontSize:15.5, fontWeight:700,
          cursor: ok ? "pointer" : "not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:10, letterSpacing:0.2, marginBottom:22, transition:"background 0.2s",
        }}
      >
        {loading ? <><Spinner/> Sending OTP…</> : <>Send OTP <span style={{ fontSize:20 }}>→</span></>}
      </button>

      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
        <div style={{ flex:1, height:1, background:C.borderLight }}/>
        <span style={{ fontSize:12, color:C.textHint, fontWeight:500 }}>OR</span>
        <div style={{ flex:1, height:1, background:C.borderLight }}/>
      </div>

      <div style={{ border:`1px solid ${C.borderLight}`, borderRadius:12, padding:"16px 8px", display:"flex", justifyContent:"space-around", marginBottom:20 }}>
        {[
          { bg:"#FFF7ED", icon:"⚡",  title:"Quick Login",      desc:"Sign in within\nseconds"        },
          { bg:"#F5F0FF", icon:"🛡️", title:"Secure & Safe",    desc:"Your data is always\nprotected"  },
          { bg:"#F5F0FF", icon:"✅",  title:"Trusted Platform", desc:"Used by lakhs of\ndevotees"     },
        ].map((f,i) => (
          <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6, padding:"0 4px" }}>
            <div style={{ width:42, height:42, borderRadius:"50%", background:f.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>{f.icon}</div>
            <span style={{ fontSize:11.5, fontWeight:700, color:C.titleBlack, textAlign:"center" }}>{f.title}</span>
            <span style={{ fontSize:10.5, color:C.textGray, textAlign:"center", lineHeight:1.45, whiteSpace:"pre-line" }}>{f.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── OTP SCREEN ── */
function OTPScreen({ phone, otpMeta, onBack, onVerified, shieldSrc }) {
  const [digits, setDigits]   = useState(Array(OTP_LEN).fill(""));
  const [focused, setFocused] = useState(0);
  const [secs, setSecs]       = useState(otpMeta?.expiresIn ?? 178);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const refs = useRef([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  
  useEffect(() => {
    if (secs <= 0) return;
    const id = setInterval(() => setSecs(s => s - 1), 1000);
    return () => clearInterval(id);
  }, [secs]);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const handleChange = (i, val) => {
    const d = val.replace(/\D/g,"").slice(-1);
    const next = [...digits]; next[i] = d; setDigits(next);
    setError(null);
    if (d && i < OTP_LEN - 1) { refs.current[i+1]?.focus(); setFocused(i+1); }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      if (digits[i]) { const n = [...digits]; n[i] = ""; setDigits(n); }
      else if (i > 0) { refs.current[i-1]?.focus(); setFocused(i-1); }
    }
    if (e.key === "Enter" && allFilled) handleVerify();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g,"").slice(0, OTP_LEN);
    if (!pasted) return;
    const next = Array(OTP_LEN).fill("");
    [...pasted].forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, OTP_LEN - 1);
    refs.current[focusIdx]?.focus();
    setFocused(focusIdx);
  };

  const allFilled = digits.every(Boolean);

  const handleVerify = async () => {
    if (!allFilled || loading || secs === 0) return;
    setError(null);
    setLoading(true);
    const otp = digits.join("");
    const res = await apiVerifyOTP(phone, otp);
    setLoading(false);
    if (res.success) {
      onVerified(res.data);
    } else {
      setError(res.error);
      setDigits(Array(OTP_LEN).fill(""));
      setTimeout(() => refs.current[0]?.focus(), 50);
    }
  };

  const handleResend = async () => {
    setError(null);
    setSecs(0);
    const res = await apiSendOTP(phone);
    if (res.success) setSecs(res.data?.expiresIn ?? 178);
    else setError(res.error);
  };

  return (
   <div style={{ padding:"20px 20px 20px", display:"flex", flexDirection:"column", flex:1 }}>
      <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:6, fontSize:14, fontWeight:600, color:C.textMed, padding:0, marginBottom:12, alignSelf:"flex-start" }}>
        <span style={{ fontSize:16 }}>←</span> Back
      </button>

      <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
        <div style={{ width:82, height:82, borderRadius:"50%", background:"linear-gradient(135deg,#F3E8FF 0%,#FCE7F3 100%)", border:"2px solid rgba(139,30,107,0.10)", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", position:"relative" }}>
          {shieldSrc
            ? <img src={shieldSrc} alt="Secure" style={{ width:54, height:54, objectFit:"contain", filter:"drop-shadow(0 2px 8px rgba(100,0,80,0.3))" }}/>
            : <span style={{ fontSize:36 }}>🛡️</span>
          }
          <div style={{ position:"absolute", right:4, top:6, fontSize:13, transform:"rotate(-20deg)" }}>✉️</div>
        </div>
      </div>

      <div style={{ textAlign:"center", marginBottom:14 }}>
        <h2 style={{ fontSize:22, fontWeight:800, color:C.titleBlack, margin:"0 0 4px" }}>Verify Your Mobile Number</h2>
        <p style={{ fontSize:13, color:C.textGray, margin:0 }}>We've sent a {OTP_LEN}-digit OTP to</p>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:10, background:C.phonePill, borderRadius:10, padding:"12px 16px", marginBottom:18, border:"1.5px solid rgba(139,30,107,0.10)" }}>
        <span style={{ fontSize:20 }}>🇮🇳</span>
        <span style={{ flex:1, fontSize:15, fontWeight:700, color:C.titleBlack }}>+91 {phone.slice(0,5)} {phone.slice(5)}</span>
        <button onClick={onBack} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color:C.linkPurple, display:"flex", alignItems:"center", gap:3, padding:0 }}>
          Edit <span style={{ fontSize:12 }}>✏️</span>
        </button>
      </div>

      <label style={{ fontSize:13.5, fontWeight:700, color:C.titleBlack, marginBottom:10, display:"block" }}>Enter {OTP_LEN}-digit OTP</label>

      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        {digits.map((d,i) => (
          <input
            key={i}
            ref={el => refs.current[i] = el}
            type="tel"
            inputMode="numeric"
            maxLength={1}
            value={d}
            onChange={e => handleChange(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            onFocus={() => setFocused(i)}
            onPaste={i === 0 ? handlePaste : undefined}
            style={{
              flex:1, height:52,
              border:`2px solid ${error ? C.expireRed : focused===i ? C.otpFocus : (d ? C.otpBorder : C.borderLight)}`,
              borderRadius:10, textAlign:"center",
              fontSize:22, fontWeight:700, color:C.titleBlack,
              outline:"none", background:"#fff",
              transition:"border-color 0.15s",
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ fontSize:12.5, color:C.expireRed, margin:"0 0 8px", display:"flex", alignItems:"center", gap:4 }}>
          <span>⚠️</span> {error}
        </p>
      )}

      <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, color:C.textGray, marginBottom:18 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.linkPurple || "#8B1E6B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        {secs > 0
          ? <><span>OTP will expire in </span><span style={{ color:C.expireRed, fontWeight:700 }}>{mm}:{ss}</span></>
          : <span style={{ color:C.expireRed, fontWeight:700 }}>OTP expired. Please resend.</span>
        }
      </div>

      <button
        onClick={handleVerify}
        disabled={!allFilled || loading || secs === 0}
        style={{
          width:"100%", padding:"15px",
          background:`linear-gradient(135deg,${C.btnVerify1} 0%,${C.btnVerify2} 100%)`,
          opacity: (allFilled && !loading && secs > 0) ? 1 : 0.55,
          border:"none", borderRadius:10, color:"#fff", fontSize:15.5, fontWeight:700,
          cursor: (allFilled && !loading && secs > 0) ? "pointer" : "not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center",
          gap:10, letterSpacing:0.2, marginBottom:16,
        }}
      >
        {loading ? <><Spinner/> Verifying…</> : <>Verify OTP <span style={{ fontSize:20 }}>→</span></>}
      </button>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:13, color:C.textGray, marginBottom:16 }}>
        <span>Didn't receive OTP?</span>
        <button onClick={handleResend} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:C.linkPurple, display:"flex", alignItems:"center", gap:4, padding:0 }}>
          Resend OTP <span style={{ fontSize:14 }}>↺</span>
        </button>
      </div>

      <div style={{ background:C.secureBg, borderRadius:12, padding:"14px 16px", display:"flex", alignItems:"center", gap:12, border:"1px solid rgba(139,30,107,0.10)" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.linkPurple || "#8B1E6B"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <div style={{ flex:1 }}>
          <p style={{ fontSize:13, fontWeight:700, color:C.titleBlack, margin:"0 0 3px" }}>Secure & Confidential</p>
          <p style={{ fontSize:11.5, color:C.textGray, margin:0, lineHeight:1.5 }}>Your information is safe with us and<br/>never shared with anyone.</p>
        </div>
        {shieldSrc && (
          <img src={shieldSrc} alt="Secure" style={{ width:46, height:46, objectFit:"contain", flexShrink:0, filter:"drop-shadow(0 2px 6px rgba(100,0,80,0.25))" }}/>
        )}
      </div>
    </div>
  );
}

/* ── ROOT MODAL COMPONENT ── */
export default function LoginOTPModal({
  isOpen,
  onClose,
  onSuccess,
  shieldSrc = "/assets/img/shield.png",
}) {
  const [screen, setScreen]   = useState("login");
  const [phone, setPhone]     = useState("");
  const [otpMeta, setOtpMeta] = useState(null);
  const [toast, setToast]     = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = e => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) { setScreen("login"); setPhone(""); setOtpMeta(null); setToast(null); }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => { setToast(null); onClose(); };

  const handleSendOTP = (p, meta) => {
    setPhone(p);
    setOtpMeta(meta);
    setScreen("otp");
    setToast({ msg: `OTP sent to +91 ${p.slice(0,5)} ${p.slice(5)}`, type: "success" });
  };

  const handleVerified = (data) => {
    onSuccess?.(data);
    setToast({ msg: "Login successful! Welcome 🙏", type: "success" });
    setTimeout(handleClose, 900);
  };

  if (!isOpen) return null;

  return (
    <>
      <style>{`
        @keyframes diq-spin   { to { transform: rotate(360deg); } }
        @keyframes diq-fadein { from { opacity:0; transform:translateX(-50%) translateY(-10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
        @keyframes diq-modalin{ from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }
      `}</style>

      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)}/>}

      <div
        onClick={handleClose}
        style={{
          position:"fixed", inset:0, zIndex:99998,
          background:"rgba(8,2,22,0.75)",
          backdropFilter:"blur(6px)",
          WebkitBackdropFilter:"blur(6px)",
          display:"flex", alignItems:"center", justifyContent:"center",
          padding:16,
          fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display:"flex",
            width:"min(750px,100%)",
            maxHeight:"min(680px,95vh)",
            borderRadius:20, overflow:"hidden",
            boxShadow:"0 32px 100px rgba(0,0,0,0.65)",
            background:"#fff",
            animation:"diq-modalin 0.25s ease",
          }}
        >
          <LeftPanel />

          <div style={{ flex:1, background:"#fff", position:"relative", overflowY:"auto", display:"flex", flexDirection:"column" }}>
            <button
              onClick={handleClose}
              style={{
                position:"absolute", top:14, right:14,
                width:30, height:30, borderRadius:"50%",
                background:"#F3F4F6", border:"none", cursor:"pointer",
                fontSize:15, color:"#6B7280",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontWeight:600, zIndex:10,
              }}
            >✕</button>

            {screen === "login" ? (
              <LoginScreen onSendOTP={handleSendOTP}/>
            ) : (
              <OTPScreen
                phone={phone}
                otpMeta={otpMeta}
                onBack={() => setScreen("login")}
                shieldSrc={shieldSrc}
                onVerified={handleVerified}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}