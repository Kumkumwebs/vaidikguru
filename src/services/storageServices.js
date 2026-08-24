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
		console.error('storageServices: setCookie error', e);
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

// --- Utility: Safe JSON parse ---
const safeJsonParse = (value, fallback = null) => {
	if (!value || value === 'undefined' || value === 'null') return fallback;
	try {
		return JSON.parse(value);
	} catch (e) {
		console.error('storageService: JSON parse error', e);
		return fallback;
	}
};

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
		console.error('storageService getItemDual error', e);
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
		console.error('storageService setItemDual error', e);
	}
};

const storageService = {
	setToken: token => {
		if (token && token !== 'null' && token !== 'undefined') {
			setItemDual('token', String(token).trim());
		} else {
			setItemDual('token', null);
		}
	},
	getToken: () => {
		const t = getItemDual('token');
		if (!t || t === 'null' || t === 'undefined') return '';
		return t;
	},

	setUser: user => {
		if (user) {
			const str = JSON.stringify(user);
			setItemDual('user', str);
			if (user.id || user._id) {
				localStorage.setItem('id', user.id || user._id);
				localStorage.setItem('id_expiry', String(Date.now() + SIX_MONTHS_MS));
			}
			if (user.name) {
				localStorage.setItem('name', user.name);
				localStorage.setItem('name_expiry', String(Date.now() + SIX_MONTHS_MS));
			}
		} else {
			setItemDual('user', null);
			localStorage.removeItem('id');
			localStorage.removeItem('id_expiry');
			localStorage.removeItem('name');
			localStorage.removeItem('name_expiry');
		}
	},
	getUser: () => safeJsonParse(getItemDual('user')),

	clear: () => {
		localStorage.clear();
		sessionStorage.clear();
		setCookie('token', null);
		setCookie('user', null);
	},
};

export default storageService;
