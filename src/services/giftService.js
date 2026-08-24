// Helper service to record and merge gift transactions locally and with the API

const LOCAL_GIFTS_KEY = 'vaidikguru_local_gifts';

export const getLocalGiftTransactions = () => {
  try {
    const raw = localStorage.getItem(LOCAL_GIFTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
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

  // Filter out any local gifts that already match an API order_id or id
  const apiIds = new Set(
    apiList.map((item) => String(item.id || item.order_id || ''))
  );

  const newLocalGifts = localGifts.filter(
    (g) => !apiIds.has(String(g.id)) && !apiIds.has(String(g.order_id))
  );

  return [...newLocalGifts, ...apiList];
};
