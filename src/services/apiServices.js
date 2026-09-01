import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.DEV ? '' : (import.meta.env.VITE_API_BASE_URL || ''),
	timeout: 30000,
	headers: {
		'Cache-Control': 'no-cache, no-store, must-revalidate',
		Pragma: 'no-cache',
	},
});

const getAuthHeaders = () => {
	const token = localStorage.getItem('token');
	if (token && token !== 'null' && token !== 'undefined' && token.trim() !== '') {
		return { Authorization: `Bearer ${token}` };
	}
	return {};
};

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
	putBearer: (url, data) => api.put(url, data, { headers: getAuthHeaders() }),
	patch: (url, data) => api.patch(url, data),
	patchBearer: (url, data) => api.patch(url, data, { headers: getAuthHeaders() }),
	postBearer: (url, data) => api.post(url, data, { headers: getAuthHeaders() }),
	deleteBearer: (url, data = {}) => api.delete(url, { data, headers: getAuthHeaders() }),
	postMultipart: (url, formData) => api.post(url, formData, { headers: getAuthHeaders() }),
	getBearer: (url, params = {}) => api.get(url, { params, headers: getAuthHeaders() }),
	getBearerBlob: (url) => api.get(url, { responseType: 'blob', headers: getAuthHeaders() }),
	formatDate: date =>
		new Date(date).toLocaleDateString('en-IN', {
			day: '2-digit',
			month: 'short',
			year: 'numeric',
		}),
};

export default apiService;
