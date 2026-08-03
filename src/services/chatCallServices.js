import apiService from './apiServices';

const BASE = 'https://admin.diviniq.in';

const ChatCallService = {
  initiateChat: async ({ astrologerId, callType, intake }) => {
    try {
      const res = await apiService.postBearer(`${BASE}/user_api/call_initiate`, {
        astrologer_id: astrologerId,
        call_type: callType, // 'chat' | 'audio'
        name: intake?.name || '',
        gender: intake?.gender || '',
        dob: intake?.dob || '',
        tob: intake?.tob || '',
        place: intake?.place || '',
      });
      return res; // expect { status, channel_id, message }
    } catch (e) {
      console.error('initiateChat error:', e);
      return { status: false, message: 'Network error' };
    }
  },

  checkStatus: async (channelId) => {
    try {
      const res = await apiService.postBearer(`${BASE}/user_api/call_initiate_status`, {
        channel_id: channelId,
      });
      return res; // expect { status, results: { status: 'accept_astro' | 'reject_astro', user_id, ... } }
    } catch (e) {
      console.error('checkStatus error:', e);
      return null;
    }
  },

  endChat: async (channelId, status = 'disconnect_user') => {
    try {
      await apiService.postBearer(`${BASE}/api/call/status-update`, {
        channel_id: channelId,
        status,
      });
    } catch (e) {
      console.error('endChat error:', e);
    }
  },
};

export default ChatCallService;