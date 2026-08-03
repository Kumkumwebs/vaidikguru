import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStorage } from "../context/StorageContext";
import apiService from "../services/apiServices";

// Served from the public folder — not bundled via import.
// Actual file lives at: public/assets/img/images/profile-hero-banner.jpeg
const HERO_BANNER_IMAGE = "/assets/img/images/profile-hero-banner.jpeg";

// NOTE: matches the real backend routes exactly —
//   GET  /user_api/get_profile     (router.get("/get_profile", ...))
//   PUT  /user_api/profile_update  (router.put("/profile_update", ...))
// The backend ONLY persists name, email, gender, dob, tob, pob, rashi.
// There is no marital_status / profession / profile_for / country / gotra
// on the server, so those fields were dropped from this page.
const GET_PROFILE_URL = "https://admin.diviniq.in/user_api/get_profile";
const UPDATE_PROFILE_URL = "https://admin.diviniq.in/user_api/profile_update";

// Read-only fields — not part of profile_update, just displayed.
const PHONE_FIELD = { key: "number", label: "Phone Number", icon: "phone" };
const REFERRAL_FIELD = { key: "referral_code", label: "Referral Code", icon: "gift" };

const RASHI_OPTIONS = [
  "Mesh (Aries)",
  "Vrishabh (Taurus)",
  "Mithun (Gemini)",
  "Kark (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makar (Capricorn)",
  "Kumbh (Aquarius)",
  "Meen (Pisces)",
];

const FIELD_DEFS = [
  { key: "name", label: "Name", icon: "user", type: "text", placeholder: "Enter your name" },
  { key: "email", label: "Email", icon: "mail", type: "email", placeholder: "Enter your email" },
  { key: "gender", label: "Gender", icon: "gender", type: "select", options: ["Male", "Female", "Other"] },
  { key: "dob", label: "Date of Birth", icon: "calendar", type: "date" },
  { key: "tob", label: "Time of Birth", icon: "clock", type: "time" },
  { key: "pob", label: "Place of Birth", icon: "pin", type: "text", placeholder: "Enter place of birth" },
  { key: "rashi", label: "Rashi", icon: "om", type: "select", options: RASHI_OPTIONS },
];

const EMPTY_PROFILE = {
  name: "",
  email: "",
  gender: "",
  dob: "",
  tob: "",
  pob: "",
  rashi: "",
  number: "",
  country_code: "91",
  referral_code: "",
};

const ICONS = {
  user: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .3 2 .6 3a2 2 0 01-.5 2.1L8 10a16 16 0 006 6l1.2-1.2a2 2 0 012.1-.5c1 .3 2 .5 3 .6a2 2 0 011.7 2z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  ),
  gender: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="15" r="5" />
      <path d="M16 8l5-5M21 3v4M21 3h-4" />
      <path d="M12.5 11.5L16 8" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="16" y1="3" x2="16" y2="7" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 6-9 12-9 12S3 16 3 10a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  om: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M8 9l4-2 4 2M8 15l4 2 4-2" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.6l-1-1a5.5 5.5 0 10-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 000-7.8z" />
    </svg>
  ),
  briefcase: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c0-4 3-7 7-7s7 3 7 7" />
      <circle cx="17" cy="8" r="3" />
      <path d="M22 21c0-3-2-6-5-6.8" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15 15 0 010 20 15 15 0 010-20z" />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M3 12h18" />
      <path d="M12 8v13" />
      <path d="M12 8c-1.5-3-5-3-5 0s3.5 0 5 0z" />
      <path d="M12 8c1.5-3 5-3 5 0s-3.5 0-5 0z" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4z" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useStorage();

  const [values, setValues] = useState(EMPTY_PROFILE);
  const [editingKey, setEditingKey] = useState(null);
  const [fieldDraft, setFieldDraft] = useState("");
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkDraft, setBulkDraft] = useState(EMPTY_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch profile — calls GET /user_api/get_profile directly. Token comes
  // from sessionStorage via apiService.getBearer (same as the rest of the
  // project's services). Reusable so we can re-sync after every save too.
  const loadProfile = async () => {
    setErrorMsg("");
    try {
      const response = await apiService.getBearer(GET_PROFILE_URL);

      if (response?.status) {
        const web = response.results_web || {};
        // The route converts tob to 24h "HH:MM:SS" at the TOP level
        // (response.tob), not inside results_web — that's the value
        // that's actually compatible with <input type="time">.
        const tob24 = (response.tob || "").slice(0, 5);

        setValues({
          name: web.name || "",
          email: web.email || "",
          gender: web.gender || "",
          dob: web.dob || "",
          tob: tob24,
          pob: web.pob || "",
          rashi: web.rashi || "",
          number: web.number || "",
          country_code: web.country_code || "91",
          referral_code: web.referral_code || "",
        });
        return true;
      }

      setErrorMsg(response?.message || "Failed to load profile");
      return false;
    } catch (err) {
      setErrorMsg("Failed to load profile");
      return false;
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      await loadProfile();
      if (!cancelled) {
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Shared save call — calls PUT /user_api/profile_update directly, then
  // re-fetches the profile so the whole page reflects exactly what the
  // server persisted (instead of relying only on the local optimistic state).
  // The backend only accepts/persists: name, email, gender, dob, tob, pob, rashi.
  // tob is sent as the raw 24h "HH:MM" value from the time input — the
  // backend's convertTime12to24() passes 24h strings through unchanged
  // when there's no AM/PM modifier, so no extra conversion is needed.
  const persistProfile = async (profileData) => {
    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const body = {
        name: profileData.name || "",
        email: profileData.email || "",
        gender: profileData.gender || "",
        dob: profileData.dob || "",
        tob: profileData.tob || "",
        pob: profileData.pob || "",
        rashi: profileData.rashi || "",
      };

      const response = await apiService.putBearer(UPDATE_PROFILE_URL, body);

      if (response?.status) {
        setSuccessMsg(response.message || "Successfully !");
        // Keep the StorageContext user name in sync.
        if (profileData.name && profileData.name !== user?.name) {
          setUser({ ...user, name: profileData.name });
        }
        // Re-fetch so every field — including anything the server computes
        // or normalizes — reflects the latest saved state, not just the
        // one field we optimistically updated locally.
        await loadProfile();
        return true;
      }

      setErrorMsg(response?.message || "Failed to update profile");
      return false;
    } catch (err) {
      setErrorMsg("Failed to update profile");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const startFieldEdit = (key) => {
    if (isBulkEditing) return;
    setFieldDraft(values[key] || "");
    setEditingKey(key);
  };

  const cancelFieldEdit = () => {
    setEditingKey(null);
    setFieldDraft("");
  };

  const startBulkEdit = () => {
    setEditingKey(null);
    setBulkDraft(values);
    setIsBulkEditing(true);
  };

  const cancelBulkEdit = () => {
    setIsBulkEditing(false);
    setBulkDraft(values);
  };

  // ── handleEditChange ──────────────────────────────────────────────
  // Single onChange handler for every editable input/select, whichever
  // mode is active. In bulk mode it updates bulkDraft[key]; in per-field
  // mode it just updates fieldDraft (there's only one key being edited
  // at a time, so the key isn't needed there).
  const handleEditChange = (key, value) => {
    if (isBulkEditing) {
      setBulkDraft((prev) => ({ ...prev, [key]: value }));
    } else {
      setFieldDraft(value);
    }
  };

  // ── handleEditSave ────────────────────────────────────────────────
  // Single save handler for both per-field and bulk edit. Figures out
  // which mode is active, builds the right payload, applies it locally,
  // exits edit mode, then persists to the API.
  const handleEditSave = async () => {
    let updated;

    if (isBulkEditing) {
      updated = bulkDraft;
      setIsBulkEditing(false);
    } else {
      updated = { ...values, [editingKey]: fieldDraft };
      setEditingKey(null);
      setFieldDraft("");
    }

    setValues(updated);
    await persistProfile(updated);
  };

  const displayValue = (f) => {
    const v = values[f.key];
    return v ? v : "Not set";
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const initial = values.name ? values.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div style={styles.page}>
      <style>{`
        .pp-field-card {
          transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease;
        }
        .pp-field-card:hover {
          border-color: #f0c2cf;
          box-shadow: 0 8px 20px rgba(194,24,91,0.08);
          transform: translateY(-2px);
        }
        .pp-field-card:hover .pp-field-icon {
          background: linear-gradient(135deg,#f0a93b,#c2185b);
          transform: scale(1.04);
        }
        .pp-field-card:hover .pp-field-icon svg {
          stroke: #fff;
        }
        .pp-field-card:hover .pp-field-edit {
          opacity: 1;
          background: #fdeef0;
          border-color: #f0c2cf;
        }
        .pp-field-edit {
          opacity: 0.45;
          transition: opacity 0.18s ease, background 0.18s ease, border-color 0.18s ease;
        }
        .pp-field-icon {
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .pp-field-icon svg {
          transition: stroke 0.18s ease;
        }
        .pp-field-card-editing {
          border-color: #c2185b;
          box-shadow: 0 0 0 3px rgba(194,24,91,0.08);
        }
        .pp-input:focus, .pp-select:focus {
          border-color: #c2185b !important;
          box-shadow: 0 0 0 3px rgba(194,24,91,0.1);
        }
        .pp-field-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 10px;
        }
        @media (max-width: 900px) {
          .pp-field-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 560px) {
          .pp-field-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section style={styles.heroBanner}>
        <div style={styles.heroContent}>
          <div style={styles.heroEyebrow}>Welcome Back</div>
          <div style={styles.heroTitle}>
            My <span style={{ color: colors.gold }}>Profile</span>
          </div>
          <div style={styles.heroDividerWrap}>
            <span style={styles.heroDivider} />
            <span style={styles.heroDividerIcon}>✺</span>
          </div>
          <div style={styles.heroSub}>Manage your personal information and preferences</div>
        </div>

        <div style={styles.heroWave}>
          <svg viewBox="0 0 1440 60" preserveAspectRatio="none" style={{ width: "100%", height: 60, display: "block" }}>
            <path d="M0,30 C240,60 480,0 720,20 C960,40 1200,10 1440,30 L1440,60 L0,60 Z" fill={colors.roseBg} />
            <path d="M0,30 C240,60 480,0 720,20 C960,40 1200,10 1440,30" fill="none" stroke={colors.goldDeep} strokeWidth="2" />
          </svg>
        </div>
      </section>

      <div style={styles.pageWrap}>
        <aside style={styles.sidebar}>
          {SIDEBAR_ITEMS.map((item, i) => (
            <div key={item.title} style={{ ...styles.navItem, ...(i === 0 ? styles.navItemActive : {}) }}>
              <div style={{ ...styles.navIcon, ...(i === 0 ? styles.navIconActive : {}) }}>
                <span style={{ ...styles.iconBase, color: i === 0 ? "#c2185b" : "#8a7f86" }}>{ICONS[item.icon]}</span>
              </div>
              <div>
                <div style={{ ...styles.navTitle, ...(i === 0 ? { color: "#c2185b" } : {}) }}>{item.title}</div>
                <div style={styles.navSub}>{item.sub}</div>
              </div>
            </div>
          ))}

          <div style={styles.helpBox}>
            <div style={styles.helpTop}>
              <div style={styles.helpAvatar}>🙏</div>
              <div>
                <div style={styles.helpTitle}>Need Help?</div>
                <div style={styles.helpSub}>We are here to assist you</div>
              </div>
            </div>
            <button style={styles.btnContact} type="button">
              Contact Support
            </button>
          </div>
        </aside>

        <main style={styles.profileCard}>
          {!isBulkEditing ? (
            <button style={styles.editPill} type="button" onClick={startBulkEdit} disabled={isLoading}>
              <span style={styles.iconSm}>{ICONS.pencil}</span>
              Edit Profile
            </button>
          ) : (
            <div style={styles.editPillGroup}>
              <button style={styles.cancelPill} type="button" onClick={cancelBulkEdit} disabled={isSaving}>
                <span style={styles.iconSm}>{ICONS.x}</span>
                Cancel
              </button>
              <button style={styles.savePill} type="button" onClick={handleEditSave} disabled={isSaving}>
                <span style={styles.iconSm}>{ICONS.check}</span>
                {isSaving ? "Saving..." : "Save All"}
              </button>
            </div>
          )}

          <div style={styles.profileHead}>
            <div style={styles.avatarCircle}>{initial}</div>
            <div style={styles.profileName}>My Profile</div>
            <div style={styles.profileSub}>Your personal details and account information</div>
            <div style={styles.smallDivider} />
          </div>

          {isLoading && <div style={styles.statusBanner}>Loading your profile...</div>}
          {errorMsg && <div style={styles.errorBanner}>{errorMsg}</div>}
          {successMsg && <div style={styles.successBanner}>{successMsg}</div>}

          <div className="pp-field-grid" style={styles.fieldGrid}>
            <div style={styles.fieldCard}>
              <div style={styles.fieldCardTop}>
                <div style={styles.fieldIcon}>
                  <span style={styles.iconSmall}>{ICONS[PHONE_FIELD.icon]}</span>
                </div>
                <div style={styles.fieldLabel}>{PHONE_FIELD.label}</div>
              </div>
              <div style={styles.fieldCardBottom}>
                <div style={{ ...styles.fieldValue, ...styles.fieldValueSet }}>
                  +{values.country_code || "91"} {values.number || "Not available"}
                </div>
              </div>
            </div>

            <div style={styles.fieldCard}>
              <div style={styles.fieldCardTop}>
                <div style={styles.fieldIcon}>
                  <span style={styles.iconSmall}>{ICONS[REFERRAL_FIELD.icon]}</span>
                </div>
                <div style={styles.fieldLabel}>{REFERRAL_FIELD.label}</div>
              </div>
              <div style={styles.fieldCardBottom}>
                <div
                  style={{
                    ...styles.fieldValue,
                    ...(values.referral_code ? styles.fieldValueSet : styles.fieldValueEmpty),
                  }}
                >
                  {values.referral_code || "Not set"}
                </div>
              </div>
            </div>

            {FIELD_DEFS.map((f) => {
              const hasValue = Boolean(values[f.key]);
              const isThisEditing = !isBulkEditing && editingKey === f.key;
              return (
                <div
                  key={f.key}
                  className={`pp-field-card${isThisEditing || isBulkEditing ? " pp-field-card-editing" : ""}`}
                  style={styles.fieldCard}
                >
                  <div style={styles.fieldCardTop}>
                    <div className="pp-field-icon" style={styles.fieldIcon}>
                      <span style={styles.iconSmall}>{ICONS[f.icon]}</span>
                    </div>
                    <div style={styles.fieldLabel}>{f.label}</div>
                  </div>

                  {isBulkEditing ? (
                    <div style={styles.fieldEditRow}>
                      {f.prefix && <span style={styles.fieldPrefix}>{f.prefix}</span>}
                      {f.type === "select" ? (
                        <select
                          className="pp-select"
                          style={styles.input}
                          value={bulkDraft[f.key] || ""}
                          onChange={(e) => handleEditChange(f.key, e.target.value)}
                        >
                          <option value="">Select {f.label.toLowerCase()}</option>
                          {f.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="pp-input"
                          style={styles.input}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={bulkDraft[f.key] || ""}
                          onChange={(e) => handleEditChange(f.key, e.target.value)}
                        />
                      )}
                    </div>
                  ) : !isThisEditing ? (
                    <div style={styles.fieldCardBottom}>
                      <div
                        style={{
                          ...styles.fieldValue,
                          ...(hasValue ? styles.fieldValueSet : styles.fieldValueEmpty),
                        }}
                      >
                        {displayValue(f)}
                      </div>
                      <button
                        className="pp-field-edit"
                        style={styles.fieldEdit}
                        type="button"
                        onClick={() => startFieldEdit(f.key)}
                        aria-label={`Edit ${f.label}`}
                      >
                        <span style={styles.iconXs}>{ICONS.pencil}</span>
                      </button>
                    </div>
                  ) : (
                    <div style={styles.fieldEditRow}>
                      {f.prefix && <span style={styles.fieldPrefix}>{f.prefix}</span>}
                      {f.type === "select" ? (
                        <select
                          className="pp-select"
                          style={styles.input}
                          value={fieldDraft}
                          autoFocus
                          onChange={(e) => handleEditChange(f.key, e.target.value)}
                        >
                          <option value="">Select {f.label.toLowerCase()}</option>
                          {f.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          className="pp-input"
                          style={styles.input}
                          type={f.type}
                          placeholder={f.placeholder}
                          value={fieldDraft}
                          autoFocus
                          onChange={(e) => handleEditChange(f.key, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleEditSave();
                            if (e.key === "Escape") cancelFieldEdit();
                          }}
                        />
                      )}
                      <button
                        style={styles.fieldSaveBtn}
                        type="button"
                        onClick={handleEditSave}
                        disabled={isSaving}
                        aria-label={`Save ${f.label}`}
                      >
                        <span style={styles.iconXs}>{ICONS.check}</span>
                      </button>
                      <button
                        style={styles.fieldCancelBtn}
                        type="button"
                        onClick={cancelFieldEdit}
                        disabled={isSaving}
                        aria-label={`Cancel editing ${f.label}`}
                      >
                        <span style={styles.iconXs}>{ICONS.x}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>


          <div style={styles.profileActions}>
            {isBulkEditing ? (
              <>
                <button style={styles.btnEditMain} type="button" onClick={handleEditSave} disabled={isSaving}>
                  <span style={styles.iconSm}>{ICONS.check}</span>
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button style={styles.btnLogout} type="button" onClick={cancelBulkEdit} disabled={isSaving}>
                  <span style={styles.iconSm}>{ICONS.x}</span>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button style={styles.btnEditMain} type="button" onClick={startBulkEdit} disabled={isLoading}>
                  <span style={styles.iconSm}>{ICONS.pencil}</span>
                  Edit Profile
                </button>
                <button style={styles.btnLogout} type="button" onClick={handleLogout}>
                  <span style={styles.iconSm}>{ICONS.logout}</span>
                  Logout
                </button>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}


const SIDEBAR_ITEMS = [
  { title: "My Profile", sub: "Personal Information", icon: "user" },
  { title: "Security", sub: "Password & Login", icon: "om" },
  { title: "Notifications", sub: "Email & Alerts", icon: "mail" },
  { title: "My Bookings", sub: "View your bookings", icon: "calendar" },
  { title: "Payment Methods", sub: "Manage payments", icon: "briefcase" },
  { title: "Address Book", sub: "Saved addresses", icon: "pin" },
  { title: "Preferences", sub: "Your preferences", icon: "globe" },
  { title: "Help & Support", sub: "Get help", icon: "clock" },
];

const colors = {
  maroonDeep: "#2b0f23",
  gold: "#f0a93b",
  goldDeep: "#e08a1e",
  pinkAccent: "#c2185b",
  pinkSoft: "#fdeef0",
  roseBg: "#fdf3ee",
  ink: "#231a1f",
  muted: "#8a7f86",
  line: "#f0e3e6",
  card: "#ffffff",
};

const styles = {
  page: {
    fontFamily: "'Poppins', sans-serif",
    background: colors.roseBg,
    color: colors.ink,
    minHeight: "100%",
  },
  heroBanner: {
    position: "relative",
    backgroundImage: `url(${HERO_BANNER_IMAGE})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    overflow: "hidden",
    padding: "62px 60px 92px",
    textAlign: "center",
  },
  heroContent: { position: "relative", zIndex: 2 },
  heroEyebrow: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontWeight: 600,
    color: colors.gold,
    fontSize: 28,
    marginBottom: 6,
  },
  heroTitle: { fontSize: 48, fontWeight: 700, color: "#ffffff" },
  heroDividerWrap: {
    position: "relative",
    width: 70,
    margin: "16px auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  heroDivider: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    background: colors.gold,
  },
  heroDividerIcon: {
    position: "relative",
    color: colors.gold,
    background: "#3a1330",
    fontSize: 14,
    padding: "0 6px",
  },
  heroSub: { color: "#e9d9e2", fontSize: 15, marginTop: 4 },
  heroWave: { position: "absolute", left: 0, right: 0, bottom: -1, lineHeight: 0 },
  pageWrap: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "24px 20px 50px",
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: 18,
    alignItems: "start",
  },
  sidebar: {
    background: colors.card,
    borderRadius: 18,
    padding: 14,
    boxShadow: "0 6px 24px rgba(60,20,40,0.05)",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "11px 12px",
    borderRadius: 12,
    cursor: "pointer",
    marginBottom: 4,
  },
  navItemActive: {
    background: colors.pinkSoft,
    borderLeft: "3px solid " + colors.pinkAccent,
    paddingLeft: 9,
  },
  navIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#f6eef1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  navIconActive: {
    background: "#f6d9de",
  },
  navTitle: {
    fontSize: 14.5,
    fontWeight: 600,
    color: colors.ink,
    lineHeight: 1.3,
  },
  navSub: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 1,
  },
  helpBox: {
    background: "linear-gradient(135deg,#fdeef0, #fdf3ee)",
    border: "1px solid #f6d9de",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  helpTop: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  helpAvatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#f0a93b,#c2185b)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: 16,
    flexShrink: 0,
  },
  helpTitle: { fontSize: 14, fontWeight: 700, color: colors.pinkAccent },
  helpSub: { fontSize: 11.5, color: colors.muted, marginTop: 1 },
  btnContact: {
    width: "100%",
    border: "none",
    background: colors.pinkAccent,
    color: "#fff",
    fontSize: 13.5,
    fontWeight: 600,
    padding: "10px 14px",
    borderRadius: 24,
    cursor: "pointer",
  },
  profileCard: {
    background: colors.card,
    borderRadius: 16,
    padding: "24px 26px 24px",
    boxShadow: "0 6px 24px rgba(60,20,40,0.05)",
    position: "relative",
  },
  editPill: {
    position: "absolute",
    top: 20,
    right: 24,
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1.5px solid " + colors.gold,
    color: colors.goldDeep,
    background: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    padding: "7px 14px",
    borderRadius: 20,
    cursor: "pointer",
  },
  editPillGroup: {
    position: "absolute",
    top: 20,
    right: 24,
    display: "flex",
    gap: 8,
  },
  cancelPill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "1.5px solid #e9c3cd",
    color: colors.pinkAccent,
    background: "#fff",
    fontSize: 12.5,
    fontWeight: 600,
    padding: "7px 14px",
    borderRadius: 20,
    cursor: "pointer",
  },
  savePill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    border: "none",
    color: "#fff",
    background: "linear-gradient(135deg,#f3b13d,#e08a1e)",
    fontSize: 12.5,
    fontWeight: 600,
    padding: "7px 14px",
    borderRadius: 20,
    cursor: "pointer",
  },
  statusBanner: {
    fontSize: 12.5,
    color: colors.muted,
    background: "#f6f1f3",
    borderRadius: 10,
    padding: "8px 12px",
    margin: "10px 0",
    textAlign: "center",
  },
  errorBanner: {
    fontSize: 12.5,
    color: "#791f1f",
    background: "#fcebeb",
    borderRadius: 10,
    padding: "8px 12px",
    margin: "10px 0",
    textAlign: "center",
  },
  successBanner: {
    fontSize: 12.5,
    color: "#1f6b3a",
    background: "#e6f5ea",
    borderRadius: 10,
    padding: "8px 12px",
    margin: "10px 0",
    textAlign: "center",
  },
  profileHead: { textAlign: "center", paddingBottom: 14 },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    margin: "0 auto 10px",
    background: "linear-gradient(135deg,#f0a93b,#c2185b)",
    color: "#fff",
    fontSize: 26,
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(194,24,91,0.25)",
  },
  profileName: { fontSize: 20, fontWeight: 700, color: colors.ink },
  profileSub: { fontSize: 12.5, color: colors.muted, marginTop: 3 },
  smallDivider: {
    width: 48,
    height: 1.5,
    background: colors.gold,
    margin: "10px auto 0",
  },
  fieldGrid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 10,
  },
  fieldCard: {
    border: "1px solid " + colors.line,
    borderRadius: 12,
    padding: "11px 12px 10px",
    background: "#fffdfc",
  },
  fieldCardTop: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  fieldIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: colors.pinkSoft,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  fieldLabel: { fontSize: 10.5, fontWeight: 600, color: colors.muted, letterSpacing: 0.2, textTransform: "uppercase" },
  fieldCardBottom: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
  },
  statusDot: { width: 6, height: 6, borderRadius: "50%", flexShrink: 0 },
  fieldValue: {
    fontSize: 12.5,
    padding: "4px 10px",
    borderRadius: 16,
    fontWeight: 500,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "100%",
  },
  fieldValueSet: {
    color: "#27500a",
    background: "#eaf3de",
  },
  fieldValueEmpty: {
    color: colors.muted,
    background: "#f6f1f3",
    fontStyle: "italic",
  },
  fieldEdit: {
    width: 24,
    height: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 7,
    border: "1px solid transparent",
    background: "transparent",
    flexShrink: 0,
  },
  fieldEditRow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
  fieldSaveBtn: {
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 7,
    border: "none",
    background: "#eaf3de",
    color: "#27500a",
    flexShrink: 0,
  },
  fieldCancelBtn: {
    width: 26,
    height: 26,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    borderRadius: 7,
    border: "none",
    background: "#fdeef0",
    color: colors.pinkAccent,
    flexShrink: 0,
  },
  fieldPrefix: { fontSize: 12.5, color: colors.muted },
  input: {
    border: "1px solid #e9c3cd",
    borderRadius: 8,
    padding: "6px 9px",
    fontSize: 12.5,
    fontFamily: "'Poppins', sans-serif",
    color: colors.ink,
    background: "#fff",
    width: "100%",
    minWidth: 0,
    outline: "none",
    transition: "border-color 0.18s ease, box-shadow 0.18s ease",
  },
  profileActions: { display: "flex", gap: 16, marginTop: 18 },
  btnEditMain: {
    flex: 1,
    border: "none",
    background: "linear-gradient(135deg,#f3b13d,#e08a1e)",
    color: "#fff",
    fontSize: 14.5,
    fontWeight: 600,
    padding: "13px 14px",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  btnLogout: {
    flex: 1,
    border: "1.5px solid #e9c3cd",
    background: "#fff",
    color: colors.pinkAccent,
    fontSize: 14.5,
    fontWeight: 600,
    padding: "13px 14px",
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
  },
  iconBase: { width: 18, height: 18, display: "inline-flex" },
  iconSm: { width: 16, height: 16, display: "inline-flex" },
  iconSmall: { width: 13, height: 13, display: "inline-flex" },
  iconXs: { width: 13, height: 13, display: "inline-flex", color: "#b8aab1" },
};