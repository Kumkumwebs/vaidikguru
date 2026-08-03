import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 30000, // Increased timeout for large image uploads
});
console.log("API base URL:", import.meta.env.VITE_API_BASE_URL);

api.interceptors.response.use(
	response => response.data,
	error => Promise.reject(error)
);

const apiService = {
	post: (url, data) => api.post(url, data),
	put: (url, data) => api.put(url, data),
	putBearer: (url, data) =>
		api.put(url, data, {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
		}),

	postBearer: (url, data) =>
		api.post(url, data, {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
		}),

	// --- NEW: Multipart Form Data Method ---
	postMultipart: (url, formData) =>
		api.post(url, formData, {
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
				// Note: Do NOT set 'Content-Type': 'multipart/form-data' here.
				// Axios/Browser will set it automatically with the correct boundary.
			},
		}),

	getBearer: (url, params = {}) =>
		api.get(url, {
			params,
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
			},
		}),

	getBearerBlob: (url) =>
		api.get(url, {
			responseType: 'blob',
			headers: {
				Authorization: `Bearer ${sessionStorage.getItem('token')}`,
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