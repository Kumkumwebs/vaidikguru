import apiService from './apiServices';

/**
 * Chadhava Services
 */
const PujaService = {
 
  getPujaList: async (search = null) => {
    try {
      const data = search ? { search } : {};

      const response = await apiService.postBearer(
        'https://admin.diviniq.in/puja/pujalisting',
        data
      );

      if (response) {
        return response; // map to model in UI if needed
      }

      return null;
    } catch (error) {
      console.error('getPujaList error:', error);
      return null;
    }
  },
  getPujaListById: async (instaId = null) => {
    try {
      const data = instaId ? { instaId } : {};

      const response = await apiService.postBearer(
        'https://admin.diviniq.in/puja/pujabyinstaid',
        data
      );

      if (response) {
        return response; // map to model in UI if needed
      }

      return null;
    } catch (error) {
      console.error('getPujaDetailsById error:', error);
      return null;
    }
  },
};

export default PujaService;
