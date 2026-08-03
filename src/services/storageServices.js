// --- Utility: Sanitize input to prevent XSS ---
const sanitize = value => {
	if (typeof value !== 'string') return value;
	return value
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
};

// --- Utility: Safe JSON parse ---
const safeJsonParse = (value, fallback = null) => {
	if (!value || value === 'undefined') return fallback;
	try {
		return JSON.parse(value);
	} catch (e) {
		console.error('storageService: JSON parse error', e);
		return fallback;
	}
};

const storageService = {
	setToken: token => {
		const sanitized = sanitize(token);
		if (sanitized) {
			sessionStorage.setItem('token', sanitized);
		} else {
			sessionStorage.removeItem('token');
		}
	},
	getToken: () => sessionStorage.getItem('token'),

	setUser: user => {
		if (user) {
			sessionStorage.setItem('user', JSON.stringify(user));
		} else {
			sessionStorage.removeItem('user');
		}
	},
	getUser: () => safeJsonParse(sessionStorage.getItem('user')),

	clear: () => sessionStorage.clear(),
};

export default storageService;
