import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '../services/apiServices';

// --- Utility: Sanitize text for display ---
const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// --- Utility: Deep sanitize object ---
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitize(obj);
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[sanitize(key)] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
};

// --- Utility: Safe JSON parse ---
const safeJsonParse = (value, fallback = null) => {
  if (!value || value === 'undefined' || value === 'null') return fallback;
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error('StorageContext: JSON parse error', e);
    return fallback;
  }
};

// --- Context Creation ---
const StorageContext = createContext(null);

// --- Storage Keys ---
const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  DEVOTEE_DETAILS: 'devoteeDetails',
  ACTIVE_CHADHAVA_ID: 'activeChadhavaId',
  ACTIVE_CART: 'activeCart',
};

// --- 6 Months (180 days) Cookie & Storage Persistence Helpers ---
const SIX_MONTHS_DAYS = 180;
const SIX_MONTHS_MS = 180 * 24 * 60 * 60 * 1000; // 15,552,000,000 ms

const setCookie = (name, value, days = SIX_MONTHS_DAYS) => {
  try {
    if (value && value !== 'null' && value !== 'undefined') {
      const expires = new Date(Date.now() + days * 864e5).toUTCString();
      document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; max-age=${days * 86400}; path=/; SameSite=Lax`;
    } else {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  } catch (e) {
    console.error('StorageContext: setCookie error', e);
  }
};

const getCookie = (name) => {
  try {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  } catch (e) {
    return null;
  }
};

// --- Storage Helpers (Dual Sync: localStorage + Cookie + sessionStorage) ---
const getItemDual = (key) => {
  try {
    // Check 6-month expiry if present
    const expVal = localStorage.getItem(`${key}_expiry`);
    if (expVal && Date.now() > Number(expVal)) {
      // Expired after 6 months
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_expiry`);
      sessionStorage.removeItem(key);
      setCookie(key, null);
      return null;
    }

    const localVal = localStorage.getItem(key);
    if (localVal && localVal !== 'null' && localVal !== 'undefined') return localVal;

    const cookieVal = getCookie(key);
    if (cookieVal && cookieVal !== 'null' && cookieVal !== 'undefined') return cookieVal;

    const sessionVal = sessionStorage.getItem(key);
    if (sessionVal && sessionVal !== 'null' && sessionVal !== 'undefined') return sessionVal;
  } catch (e) {
    console.error('StorageContext: getItemDual error', e);
  }
  return null;
};

const setItemDual = (key, value) => {
  try {
    if (value !== null && value !== undefined && value !== 'null' && value !== 'undefined') {
      localStorage.setItem(key, value);
      localStorage.setItem(`${key}_expiry`, String(Date.now() + SIX_MONTHS_MS));
      sessionStorage.setItem(key, value);
      setCookie(key, value, SIX_MONTHS_DAYS);
    } else {
      localStorage.removeItem(key);
      localStorage.removeItem(`${key}_expiry`);
      sessionStorage.removeItem(key);
      setCookie(key, null);
    }
  } catch (e) {
    console.error('StorageContext: setItemDual error', e);
  }
};

const removeItemDual = (key) => {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_expiry`);
    sessionStorage.removeItem(key);
    setCookie(key, null);
  } catch (e) {
    console.error('StorageContext: removeItemDual error', e);
  }
};

// --- Provider Component ---
export const StorageProvider = ({ children }) => {
  // Initialize state from dual storage (localStorage fallback to sessionStorage)
  const [token, setTokenState] = useState(() => getItemDual(STORAGE_KEYS.TOKEN));
  const [user, setUserState] = useState(() => safeJsonParse(getItemDual(STORAGE_KEYS.USER)));
  const [devoteeDetails, setDevoteeDetailsState] = useState(() => 
    safeJsonParse(getItemDual(STORAGE_KEYS.DEVOTEE_DETAILS), { name: '', whatsapp: '' })
  );
  const [activeChadhavaId, setActiveChadhavaIdState] = useState(() => 
    getItemDual(STORAGE_KEYS.ACTIVE_CHADHAVA_ID)
  );
  const [activeCart, setActiveCartState] = useState(() => 
    safeJsonParse(getItemDual(STORAGE_KEYS.ACTIVE_CART))
  );

  // --- Setters with dual storage sync ---
  const setToken = useCallback((newToken) => {
    if (newToken && newToken !== 'null' && newToken !== 'undefined') {
      const cleanToken = String(newToken).trim();
      setTokenState(cleanToken);
      setItemDual(STORAGE_KEYS.TOKEN, cleanToken);
    } else {
      setTokenState(null);
      setItemDual(STORAGE_KEYS.TOKEN, null);
    }
  }, []);

  const setUser = useCallback((newUser) => {
    if (newUser) {
      setUserState(newUser);
      setItemDual(STORAGE_KEYS.USER, JSON.stringify(newUser));
      const userId = newUser.id || newUser._id || '';
      const userName = newUser.name || '';
      if (userId) localStorage.setItem('id', userId);
      if (userName) localStorage.setItem('name', userName);
    } else {
      setUserState(null);
      removeItemDual(STORAGE_KEYS.USER);
      localStorage.removeItem('id');
      localStorage.removeItem('name');
    }
  }, []);

  const setDevoteeDetails = useCallback((newDetails) => {
    const sanitized = sanitizeObject(newDetails);
    setDevoteeDetailsState(sanitized);
    if (sanitized) {
      setItemDual(STORAGE_KEYS.DEVOTEE_DETAILS, JSON.stringify(sanitized));
    } else {
      removeItemDual(STORAGE_KEYS.DEVOTEE_DETAILS);
    }
  }, []);

  const setActiveChadhavaId = useCallback((newId) => {
    const sanitized = sanitize(newId);
    setActiveChadhavaIdState(sanitized);
    setItemDual(STORAGE_KEYS.ACTIVE_CHADHAVA_ID, sanitized);
  }, []);

  const setActiveCart = useCallback((newCart) => {
    const sanitized = sanitizeObject(newCart);
    setActiveCartState(sanitized);
    if (sanitized) {
      setItemDual(STORAGE_KEYS.ACTIVE_CART, JSON.stringify(sanitized));
    } else {
      removeItemDual(STORAGE_KEYS.ACTIVE_CART);
    }
  }, []);

  // --- Re-fetch & synchronize profile on mount / token change ---
  useEffect(() => {
    if (!token || token === 'null' || token === 'undefined') return;

    let isMounted = true;
    apiService.getBearer('/user_api/get_profile')
      .then((res) => {
        if (!isMounted) return;
        if (res && res.status === true) {
          const profileData = res.results || res.results_web || {};
          setUserState((prev) => {
            const updated = {
              ...prev,
              ...profileData,
              id: profileData.id || profileData._id || prev?.id || prev?._id,
              name: profileData.name || prev?.name,
              number: profileData.number || profileData.phone || prev?.number || prev?.phone,
              email: profileData.email || prev?.email,
              profile_img: profileData.profile_img || prev?.profile_img,
            };
            setItemDual(STORAGE_KEYS.USER, JSON.stringify(updated));
            if (updated.id || updated._id) localStorage.setItem('id', updated.id || updated._id);
            if (updated.name) localStorage.setItem('name', updated.name);
            return updated;
          });
        }
      })
      .catch((err) => {
        console.warn('StorageProvider: profile sync notice', err);
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  // --- Explicit profile & wallet refresh helper ---
  const refreshProfile = useCallback(async () => {
    if (!token || token === 'null' || token === 'undefined') return null;
    try {
      const res = await apiService.getBearer('/user_api/get_profile');
      if (res && res.status === true) {
        const profileData = res.results || res.results_web || {};
        setUserState((prev) => {
          const updated = {
            ...prev,
            ...profileData,
            id: profileData.id || profileData._id || prev?.id || prev?._id,
            name: profileData.name || prev?.name,
            number: profileData.number || profileData.phone || prev?.number || prev?.phone,
            email: profileData.email || prev?.email,
            wallet: profileData.wallet,
            profile_img: profileData.profile_img || prev?.profile_img,
          };
          setItemDual(STORAGE_KEYS.USER, JSON.stringify(updated));
          if (updated.id || updated._id) localStorage.setItem('id', updated.id || updated._id);
          if (updated.name) localStorage.setItem('name', updated.name);
          return updated;
        });
        return profileData;
      }
    } catch (err) {
      console.warn('StorageProvider: profile refresh error', err);
    }
    return null;
  }, [token]);

  // --- Clear all storage ---
  const clearStorage = useCallback(() => {
    // 1. Reset React context state
    setTokenState(null);
    setUserState(null);
    setDevoteeDetailsState({ name: '', whatsapp: '' });
    setActiveChadhavaIdState(null);
    setActiveCartState(null);

    // 2. Clear localStorage & sessionStorage
    try {
      localStorage.clear();
    } catch (e) {
      console.error('StorageContext: localStorage clear error', e);
    }
    try {
      sessionStorage.clear();
    } catch (e) {
      console.error('StorageContext: sessionStorage clear error', e);
    }

    // 3. Clear all dual cookies explicitly so getItemDual does not revive token/user
    const keysToClear = [
      STORAGE_KEYS.TOKEN,
      STORAGE_KEYS.USER,
      STORAGE_KEYS.DEVOTEE_DETAILS,
      STORAGE_KEYS.ACTIVE_CHADHAVA_ID,
      STORAGE_KEYS.ACTIVE_CART,
      'token',
      'token_expiry',
      'user',
      'user_expiry',
      'id',
      'id_expiry',
      'name',
      'name_expiry',
      'devoteeDetails',
      'activeChadhavaId',
      'activeCart',
    ];

    keysToClear.forEach((k) => {
      setCookie(k, null);
      removeItemDual(k);
    });

    // 4. Force wipe all document cookies across root path
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
        }
      }
    } catch (e) {
      console.error('StorageContext: cookie wipe error', e);
    }
  }, []);

  // --- Context Value ---
  const value = {
    // State
    token,
    user,
    devoteeDetails,
    activeChadhavaId,
    activeCart,
    // Setters
    setToken,
    setUser,
    setDevoteeDetails,
    setActiveChadhavaId,
    setActiveCart,
    refreshProfile,
    clearStorage,
    logout: clearStorage, // Alias for semantic usage
    // Helpers
    isLoggedIn: !!(token && token !== 'null' && token !== 'undefined'),
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

// --- Custom Hook ---
export const useStorage = () => {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error('useStorage must be used within a StorageProvider');
  }
  return context;
};

export default StorageContext;
