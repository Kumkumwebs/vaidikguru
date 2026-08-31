import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 30000, // Increased timeout for large image uploads
	headers: {
		// axios has no `cache` option (that's a fetch()-only concept) —
		// this header combo is the equivalent for axios: tells browsers,
		// proxies, and CDNs along the way not to serve or store a cached
		// copy of these requests/responses.
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		Pragma: 'no-cache',
	},
});
console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);

api.interceptors.request.use((config) => {
	if (config.method === 'get') {
		config.params = {
			...(config.params || {}),
			_ts: Date.now(),
		};
	}
	return config;
});
api.interceptors.response.use(
	response => response.data,
	error => Promise.reject(error)
);

const apiService = {
	get: (url, params = {}) => api.get(url, { params }),
	post: (url, data) => api.post(url, data),
	put: (url, data) => api.put(url, data),
	putBearer: (url, data) =>
		api.put(url, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}),

	patch: (url, data) => api.patch(url, data),
	patchBearer: (url, data) =>
		api.patch(url, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}),

	postBearer: (url, data) =>
		api.post(url, data, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}),

	deleteBearer: (url, data = {}) =>
		api.delete(url, {
			data,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}),

	// --- NEW: Multipart Form Data Method ---
	postMultipart: (url, formData) =>
		api.post(url, formData, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
				// Note: Do NOT set 'Content-Type': 'multipart/form-data' here.
				// Axios/Browser will set it automatically with the correct boundary.
			},
		}),

	getBearer: (url, params = {}) =>
		api.get(url, {
			params,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}),

	getBearerBlob: (url) =>
		api.get(url, {
			responseType: 'blob',
			headers: {
				Authorization: `Bearer ${localStorage.getItem('token')}`,
			},
		}),

	formatDate: date =>
		new Date(date).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}),
};

export default apiService;
