// Helper service to record and merge gift transactions locally and with the API

const LOCAL_GIFTS_KEY = 'vaidikguru_local_gifts';

export const getLocalGiftTransactions = () => {
  try {
    const keys = [
      LOCAL_GIFTS_KEY,
      'gift_transactions',
      'gifts_history',
      'user_gifts',
      'gifts',
      'gift_list',
      'sent_gifts',
      'gifts_sent',
      'gift_orders',
      'user_gift_transactions',
      'astroguru_gifts',
      'astrogurujii_gifts',
      'local_gifts',
      'astrologer_gifts',
    ];
    let allGifts = [];
    for (const key of keys) {
      const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            allGifts = [...allGifts, ...parsed];
          } else if (parsed && typeof parsed === 'object') {
            allGifts.push(parsed);
          }
        } catch (e) {}
      }
    }
    const seen = new Set();
    return allGifts.filter((item, idx) => {
      if (!item || typeof item !== 'object') return false;
      const key = String(
        item.id ||
        item.order_id ||
        item.transaction_id ||
        item._id ||
        `${item.gift_title || item.title || item.gift || 'gift'}_${item.transaction_date || item.created_at || item.date || idx}`
      );
      if (seen.has(key)) return false;
      seen.add(key);
      if (!item.id && !item.order_id) {
        item.id = key;
      }
      return true;
    });
  } catch (e) {
    console.error('giftService: failed to parse local gifts', e);
    return [];
  }
};

export const recordGiftTransaction = ({ gift, astroName, astroId, amount }) => {
  try {
    const giftTitle = gift?.title || gift?.name || 'Gift';
    const giftPrice = Number(amount ?? gift?.price ?? 0);
    const targetAstroName = astroName || 'Astrologer';

    const newTxn = {
      id: `gift_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      order_id: `GFT${Math.floor(100000 + Math.random() * 900000)}`,
      type: 'gift',
      transaction_type: 'gift',
      amount: giftPrice,
      amount_type: 'debit',
      description: `Gift: ${giftTitle} sent to ${targetAstroName}`,
      astro_name: targetAstroName,
      astrologer_id: astroId,
      gift_title: giftTitle,
      transaction_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      created_at: new Date().toISOString(),
    };

    const existing = getLocalGiftTransactions();
    const updated = [newTxn, ...existing].slice(0, 100); // keep last 100
    localStorage.setItem(LOCAL_GIFTS_KEY, JSON.stringify(updated));

    // Dispatch global event for instant UI response
    window.dispatchEvent(new CustomEvent('giftTransactionAdded', { detail: newTxn }));
    return newTxn;
  } catch (e) {
    console.error('giftService: failed to record gift transaction', e);
    return null;
  }
};

export const mergeGiftTransactions = (apiList = []) => {
  const localGifts = getLocalGiftTransactions();
  if (!localGifts.length) return apiList;

  const apiIds = new Set(
    apiList.map((item) => String(item.id || item.order_id || item.transaction_id || item._id || ''))
  );

  const newLocalGifts = localGifts.filter((g) => {
    const gid = String(g.id || g.order_id || g.transaction_id || g._id || '');
    return !gid || !apiIds.has(gid);
  });

  return [...newLocalGifts, ...apiList];
};

import { ref, push, set, update } from 'firebase/database';
import { db } from './liveFirebase';
import { getUserId, getUserName } from './Liveconfig';

export async function notifyAstrologerGiftInFirebase({ gift, astroId, astroName, channelId }) {
  try {
    const currentUserId = String(getUserId() || '');
    const currentUserName = getUserName() || 'User';

    // 1. Resolve channel ID from parameter or sessionStorage
    let activeChannelId = channelId || '';
    if (!activeChannelId) {
      try {
        const savedAudio = JSON.parse(sessionStorage.getItem('activeAudioCall') || '{}');
        if (savedAudio?.channelId) activeChannelId = savedAudio.channelId;
      } catch (_) {}
    }
    if (!activeChannelId) {
      try {
        const savedChat = JSON.parse(sessionStorage.getItem('activeChatCall') || '{}');
        if (savedChat?.gid || savedChat?.channelId) activeChannelId = savedChat.gid || savedChat.channelId;
      } catch (_) {}
    }

    if (!activeChannelId || !astroId) {
      console.log('[notifyAstrologerGiftInFirebase] missing channelId or astroId, skipping Firebase publish');
      return;
    }

    const timestamp = Date.now();
    const giftTitle = gift?.title || gift?.name || gift?.label || 'Gift';
    const giftPrice = Number(gift?.price || gift?.amount || 0);
    const giftImg = gift?.image || gift?.img || '';
    const giftEmoji = gift?.emoji || '🎁';
    const giftId = String(gift?._id || gift?.id || '');

    const giftPayload = {
      gift_id: giftId,
      gift_title: giftTitle,
      gift_name: giftTitle,
      gift_price: giftPrice,
      amount: giftPrice,
      gift_image: giftImg,
      gift_emoji: giftEmoji,
      sender_name: currentUserName,
      sender_id: currentUserId,
      to: String(astroId),
      from: currentUserId,
      timestamp: timestamp,
      created_at: new Date().toISOString(),
    };

    // 1) Update CallSession node so astrologer calling screen gets real-time gift alert
    const sessionRef = ref(db, `CallSession/${activeChannelId}`);
    await update(sessionRef, {
      gift_sent: true,
      last_gift: giftPayload,
      last_gift_time: timestamp,
    });

    const sessionGiftsRef = push(ref(db, `CallSession/${activeChannelId}/gifts`));
    await set(sessionGiftsRef, giftPayload);
    console.log('[notifyAstrologerGiftInFirebase] CallSession updated:', `CallSession/${activeChannelId}`);

    // 2) Update Group nodes so chat & calling screen message feeds receive real-time gift bubble
    if (currentUserId) {
      const senderPath = `Group/${activeChannelId}/${currentUserId}/${astroId}`;
      const receiverPath = `Group/${activeChannelId}/${astroId}/${currentUserId}`;
      const msgId = push(ref(db, senderPath)).key;

      if (msgId) {
        const giftMsg = {
          name: currentUserName,
          user_name: currentUserName,
          to: String(astroId),
          from: String(currentUserId),
          message: `Sent a gift: ${giftTitle} 🎁`,
          type: 'gift',
          message_id: msgId,
          date_time: timestamp,
          seen: false,
          isGift: true,
          gift_id: giftId,
          gift_title: giftTitle,
          gift_name: giftTitle,
          gift_price: giftPrice,
          gift_emoji: giftEmoji,
          gift_image: giftImg,
          giftImg: giftImg,
          amount: giftPrice,
        };

        await set(ref(db, `${senderPath}/${msgId}`), giftMsg);
        await set(ref(db, `${receiverPath}/${msgId}`), giftMsg);
        console.log('[notifyAstrologerGiftInFirebase] Group updated:', senderPath, receiverPath);
      }
    }

    // 3) Update LiveSession & LiveGifts nodes so astrologer live stream receives real-time gift alert
    try {
      const liveSessionRef = ref(db, `LiveSession/${activeChannelId}`);
      await update(liveSessionRef, {
        gift_sent: true,
        last_gift: giftPayload,
        last_gift_time: timestamp,
      });

      const liveGiftsChannelRef = push(ref(db, `LiveGifts/${activeChannelId}`));
      await set(liveGiftsChannelRef, giftPayload);

      if (astroId) {
        const liveGiftsAstroRef = push(ref(db, `LiveGifts/${astroId}`));
        await set(liveGiftsAstroRef, giftPayload);
      }
      console.log('[notifyAstrologerGiftInFirebase] LiveGifts updated for channel:', activeChannelId);
    } catch (e) {
      console.warn('[notifyAstrologerGiftInFirebase] LiveGifts update warning:', e);
    }

    // 4) Update GroupLive node so astrologer live stream chat feed receives the gift message
    try {
      const groupLiveRef = push(ref(db, `GroupLive/${activeChannelId}`));
      const liveMsg = {
        name: currentUserName,
        user_name: currentUserName,
        userName: currentUserName,
        sender_name: currentUserName,
        message: `Sent a gift: ${giftTitle}`,
        text: `Sent a gift: ${giftTitle}`,
        from: String(currentUserId),
        from_id: String(currentUserId),
        to: String(astroId),
        astrologer_id: String(astroId),
        date_time: timestamp,
        timestamp: timestamp,
        is_system: false,
        isGift: true,
        is_gift: true,
        type: 'gift',
        gift_id: giftId,
        gift_name: giftTitle,
        giftName: giftTitle,
        gift_title: giftTitle,
        giftEmoji: giftEmoji,
        gift_emoji: giftEmoji,
        giftImg: giftImg,
        gift_image: giftImg,
        price: giftPrice,
        amount: giftPrice,
        message_id: groupLiveRef.key,
      };
      await set(groupLiveRef, liveMsg);
      console.log('[notifyAstrologerGiftInFirebase] GroupLive updated for channel:', activeChannelId);
    } catch (e) {
      console.warn('[notifyAstrologerGiftInFirebase] GroupLive update warning:', e);
    }
  } catch (err) {
    console.error('[notifyAstrologerGiftInFirebase] Error sending Firebase gift notification:', err);
  }
}

