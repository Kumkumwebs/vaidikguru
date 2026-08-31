import apiService from '../services/apiServices';

const UserService = {
  /**
   * GET the logged-in user's saved profile (name, gender, dob, tob,
   * birthPlace).
   */
  getProfile: async () => {
    const res = await apiService.getBearer('/user_api/get_profile');
    return res;
  },

  /**
   * PATCH/PUT the logged-in user's profile with new birth details.
   */
  updateProfile: async (details) => {
    const res = await apiService.patchBearer('/user_api/get_profile', details);
    return res;
  },
};

export default UserService;