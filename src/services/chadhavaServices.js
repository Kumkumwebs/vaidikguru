import apiService from './apiServices';

/**
 * Chadhava Services
 */
const ChadhavaService = {
 
  getChadhavaList: async (search = null) => {
    try {
      const data = search ? { search } : {};

      const response = await apiService.postBearer(
        'https://admin.diviniq.in/puja/chadhavalisting',
        data
      );

      if (response) {
        return response; // map to model in UI if needed
      }

      return null;
    } catch (error) {
      console.error('getChadhavaList error:', error);
      return null;
    }
  },
  getChadhavaListById: async (chadhavaId = null) => {
    try {
      const data = chadhavaId ? { chadhavaId } : {};

      const response = await apiService.postBearer(
        'https://admin.diviniq.in/puja/chadhavabyid',
        data
      );

      if (response) {
        return response; // map to model in UI if needed
      }

      return null;
    } catch (error) {
      console.error('getChadhavaDetailsById error:', error);
      return null;
    }
  },
};

export default ChadhavaService;
