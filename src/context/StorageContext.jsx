import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- Utility: Sanitize input to prevent XSS ---
const sanitize = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
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
  if (!value || value === 'undefined') return fallback;
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

// --- Provider Component ---
export const StorageProvider = ({ children }) => {
  // Initialize state from sessionStorage
  const [token, setTokenState] = useState(() => sessionStorage.getItem(STORAGE_KEYS.TOKEN) || null);
  const [user, setUserState] = useState(() => safeJsonParse(sessionStorage.getItem(STORAGE_KEYS.USER)));
  const [devoteeDetails, setDevoteeDetailsState] = useState(() => 
    safeJsonParse(sessionStorage.getItem(STORAGE_KEYS.DEVOTEE_DETAILS), { name: '', whatsapp: '' })
  );
  const [activeChadhavaId, setActiveChadhavaIdState] = useState(() => 
    sessionStorage.getItem(STORAGE_KEYS.ACTIVE_CHADHAVA_ID) || null
  );
  const [activeCart, setActiveCartState] = useState(() => 
    safeJsonParse(sessionStorage.getItem(STORAGE_KEYS.ACTIVE_CART))
  );

  // --- Setters with sessionStorage sync ---
  const setToken = useCallback((newToken) => {
    const sanitized = sanitize(newToken);
    setTokenState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.TOKEN, sanitized);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  }, []);

  const setUser = useCallback((newUser) => {
    const sanitized = sanitizeObject(newUser);
    setUserState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sanitized));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, []);

  const setDevoteeDetails = useCallback((newDetails) => {
    const sanitized = sanitizeObject(newDetails);
    setDevoteeDetailsState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.DEVOTEE_DETAILS, JSON.stringify(sanitized));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.DEVOTEE_DETAILS);
    }
  }, []);

  const setActiveChadhavaId = useCallback((newId) => {
    const sanitized = sanitize(newId);
    setActiveChadhavaIdState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.ACTIVE_CHADHAVA_ID, sanitized);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_CHADHAVA_ID);
    }
  }, []);

  const setActiveCart = useCallback((newCart) => {
    const sanitized = sanitizeObject(newCart);
    setActiveCartState(sanitized);
    if (sanitized) {
      sessionStorage.setItem(STORAGE_KEYS.ACTIVE_CART, JSON.stringify(sanitized));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ACTIVE_CART);
    }
  }, []);

  // --- Clear all storage ---
  const clearStorage = useCallback(() => {
    setTokenState(null);
    setUserState(null);
    setDevoteeDetailsState({ name: '', whatsapp: '' });
    setActiveChadhavaIdState(null);
    setActiveCartState(null);
    sessionStorage.clear();
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
		clearStorage,
		logout: clearStorage, // Alias for semantic usage
		// Helpers
		isLoggedIn: !!token,
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
