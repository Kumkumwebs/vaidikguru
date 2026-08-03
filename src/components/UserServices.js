import axios from 'axios'; // or your existing configured API client

// Adjust BASE_URL / client import to match how PujaService.js is set up
// in your project — this mirrors that same pattern so it's a drop-in.

const UserService = {
  /**
   * GET the logged-in user's saved profile (name, gender, dob, tob,
   * birthPlace). The auth token should already be attached by your
   * existing axios interceptor / API client, the same way it is for
   * PujaService calls.
   */
  getProfile: async () => {
    const res = await axios.get('https://admin.diviniq.in/user_api/get_profile');
    return res.data; // expected shape: { status: true, data: { name, gender, dob, tob, birthPlace, ... } }
  },

  /**
   * PATCH/PUT the logged-in user's profile with new birth details.
   * This is what makes the details persist across refresh and devices
   * — they're saved against the account, not the browser.
   */
  updateProfile: async (details) => {
    const res = await axios.patch('https://admin.diviniq.in/user_api/get_profile', details);
    return res.data; // expected shape: { status: true, data: {...} }
  },
};

export default UserService;