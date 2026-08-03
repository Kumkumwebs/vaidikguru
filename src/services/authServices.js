import apiService from "./apiServices";
import storageService from "./storageServices";

const AuthService = {
	checkNumber: async ({ phone, otp }) => {
		const body = {
			number: phone,
			otp,
			type: '',
			country: '',
			country_code: 'INR',
			deviceType: 'APP',
			deviceID: 'hbj',
			deviceToken: 'gvh',
		};

		try {
			const response = await apiService.post('https://admin.diviniq.in/user_api/user_login_new', body);

			if (response?.status === true) {
				return {
					success: true,
					type: response.type,
					message: response.message,
				};
			}

			return {
				success: false,
				message: response?.message || 'OTP send failed',
			};
		} catch (error) {
			console.error('checkNumber error:', error);
			return {
				success: false,
				message: 'Network error',
			};
		}
	},

	verifyOtp: async ({ phone, otp }) => {
		const body = {
			number: phone,
			otp,
			country: 'INR',
			country_code: '91',
		};

		try {
			const response = await apiService.post('https://admin.diviniq.in/user_api/user_login_new', body);

			if (response?.status === true && response.results) {
				storageService.setToken(response.token);
				storageService.setUser({
					id: response.results.id,
					name: response.results.name,
					email: response.results.email,
					phone: response.results.number,
				});

				return {
					success: true,
					user: response.results,
					token: response.token,
				};
			}

			return {
				success: false,
				message: response?.message || 'OTP verification failed',
			};
		} catch (error) {
			console.error('verifyOtp error:', error);
			return {
				success: false,
				message: 'Network error',
			};
		}
	},
	getHomeData: async () => {
		try {
			const response = await apiService.getBearer('https://admin.diviniq.in/web/home_data');

			if (response) {
				return response; // map to model in UI if needed
			}

			return null;
		} catch (error) {
			console.error('get Home error:', error);
			return null;
		}
	},
	getProfile: async () => {
		try {
			const response = await apiService.getBearer('https://admin.diviniq.in/user_api/get_profile');
			debugger;

			if (response?.status === true) {
				const results = response.results || {};
				return {
					success: true,
					message: response.message,
					profile: {
						country: results.country || '',
						country_code: results.country_code || '91',
						name: results.name || '',
						number: results.number || '',
						email: results.email || '',
						gender: results.gender || '',
						dob: results.dob || '',
						tob: results.tob || '',
						pob: results.pob || '',
						gotra: results.gotra || '',
						marital_status: results.marital_status || '',
						profession: results.profession || '',
						profile_for: results.profile_for || '',
						refer_code_user: results.referral_code || '',
						profile_img: results.profile_img || '',
						_id: results._id || '',
					},
				};
			}

			return {
				success: false,
				message: response?.message || 'Failed to fetch profile',
			};
		} catch (error) {
			console.error('getProfile error:', error);
			return {
				success: false,
				message: 'Network error',
			};
		}
	},
	updateProfile: async ({ number, country_code }, profileData) => {
		const body = {
			country: profileData.country || '',
			country_code: country_code || '91',
			name: profileData.name || '',
			number: number || '',
			email: profileData.email || '',
			gender: profileData.gender || '',
			deviceType: 'APP',
			deviceID: '',
			deviceToken: '',
			refer_code_user: profileData.refer_code_user || '',
			dob: profileData.dob || '',
			tob: profileData.tob || '',
			pob: profileData.pob || '',
			profile_for: profileData.profile_for || '',
			profession: profileData.profession || '',
			marital_status: profileData.marital_status || '',
			gotra: profileData.gotra || '',
		};

		try {
			const response = await apiService.putBearer(
				'https://admin.diviniq.in/user_api/profile_update',
				body
			);

			if (response?.status === true) {
				return {
					success: true,
					message: response.message || 'Profile updated successfully!',
				};
			}

			return {
				success: false,
				message: response?.message || 'Failed to update profile',
			};
		} catch (error) {
			console.error('updateProfile error:', error);
			return {
				success: false,
				message: 'Network error',
			};
		}
	},
};

export default AuthService;
