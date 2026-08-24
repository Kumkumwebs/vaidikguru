import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.DEV ? "" : (import.meta.env.VITE_API_BASE_URL || ""),
	timeout: 30000, // Increased timeout for large image uploads
});

api.interceptors.request.use((config) => {
	if (import.meta.env.DEV && config.url && config.url.includes("admin.vaidikguru.com")) {
		config.url = config.url.replace(/^https?:\/\/admin\.vaidikguru\.com/, "");
	}
	return config;
});
console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);

const getCookie = (name) => {
	try {
		const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
		return matches ? decodeURIComponent(matches[1]) : null;
	} catch (e) {
		return null;
	}
};

api.interceptors.response.use(
	response => response.data,
	async error => {
		const originalRequest = error.config;
		// If 401 Unauthorized occurs on a request that included Authorization header, retry once without Authorization header
		if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
			originalRequest._retry = true;

			if (originalRequest.headers) {
				delete originalRequest.headers.Authorization;
				delete originalRequest.headers.authorization;
			}
			try {
				const res = await axios(originalRequest);
				return res.data;
			} catch (retryErr) {
				return Promise.reject(retryErr);
			}
		}
		return Promise.reject(error);
	}
);

const getToken = () => {
	try {
		const expVal = localStorage.getItem('token_expiry');
		if (expVal && Date.now() > Number(expVal)) {
			// Expired after 6 months
			localStorage.removeItem('token');
			localStorage.removeItem('token_expiry');
			sessionStorage.removeItem('token');
			document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
			return '';
		}

		const localVal = localStorage.getItem('token');
		if (localVal && localVal !== 'null' && localVal !== 'undefined') return localVal;

		const cookieVal = getCookie('token');
		if (cookieVal && cookieVal !== 'null' && cookieVal !== 'undefined') return cookieVal;

		const sessionVal = sessionStorage.getItem('token');
		if (sessionVal && sessionVal !== 'null' && sessionVal !== 'undefined') return sessionVal;
	} catch (e) {
		console.error('apiServices: getToken error', e);
	}
	return '';
};

const getAuthHeaders = () => {
	const t = getToken();
	return t ? { Authorization: `Bearer ${t}` } : {};
};

const apiService = {
	post: (url, data) => api.post(url, data),
	put: (url, data) => api.put(url, data),
	putBearer: (url, data) =>
		api.put(url, data, {
			headers: getAuthHeaders(),
		}),

	postBearer: (url, data) =>
		api.post(url, data, {
			headers: getAuthHeaders(),
		}),

	// --- NEW: Multipart Form Data Method ---
	postMultipart: (url, formData) =>
		api.post(url, formData, {
			headers: getAuthHeaders(),
		}),

	getBearer: (url, params = {}) =>
		api.get(url, {
			params,
			headers: getAuthHeaders(),
		}),

	getBearerBlob: (url) =>
		api.get(url, {
			responseType: 'blob',
			headers: getAuthHeaders(),
		}),

	formatDate: date =>
		new Date(date).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}),
};

export default apiService;