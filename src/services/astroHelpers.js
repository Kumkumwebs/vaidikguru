const unwrapAstro = (astro) => {
  if (!astro) return {};
  let obj = astro;
  if (typeof astro.astrologer_id === 'object' && astro.astrologer_id !== null) {
    obj = { ...astro, ...astro.astrologer_id };
  } else if (typeof astro.astrologerId === 'object' && astro.astrologerId !== null) {
    obj = { ...astro, ...astro.astrologerId };
  }
  return obj;
};

export const getAstroStatus = (astro) => {
  if (!astro) return { status: 'offline', isBusy: false, isOnline: false, label: 'Offline' };
  const a = unwrapAstro(astro);

  // 1. Check Busy status
  const isBusy =
    a.is_busy == 1 ||
    a.is_busy === '1' ||
    a.is_busy === true ||
    a.is_busy === 'on' ||
    a.is_busy === 'ON' ||
    a.busy == 1 ||
    a.busy === '1' ||
    a.busy === true;

  if (isBusy) {
    return { status: 'busy', isBusy: true, isOnline: false, label: 'Busy' };
  }

  const isTrueVal = (v) => v === 1 || v === '1' || v === true || v === 'on' || v === 'ON' || v === 'On';
  const isFalseVal = (v) => v === 0 || v === '0' || v === false || v === 'off' || v === 'OFF' || v === 'Off';

  // 2. Check explicitly online fields
  const hasOnlineFlag =
    isTrueVal(a.is_online) ||
    isTrueVal(a.is_chat_online) ||
    isTrueVal(a.is_voice_online) ||
    isTrueVal(a.is_video_online) ||
    isTrueVal(a.online_status) ||
    isTrueVal(a.is_call_online) ||
    isTrueVal(a.status);

  // 3. Check explicitly offline flags
  const hasOfflineFlag =
    isTrueVal(a.is_offline) ||
    isFalseVal(a.is_online) ||
    isFalseVal(a.online_status);

  const allChannelsOff =
    isFalseVal(a.is_chat_online) &&
    isFalseVal(a.is_voice_online) &&
    isFalseVal(a.is_video_online);

  if (hasOnlineFlag && !hasOfflineFlag && !allChannelsOff) {
    return { status: 'online', isBusy: false, isOnline: true, label: 'Online' };
  }

  if (hasOnlineFlag && !allChannelsOff) {
    return { status: 'online', isBusy: false, isOnline: true, label: 'Online' };
  }

  return { status: 'offline', isBusy: false, isOnline: false, label: 'Offline' };
};

export const getAstroRole = (astro) => {
  if (!astro) return '';
  const a = unwrapAstro(astro);
  if (a.primary_category && typeof a.primary_category === 'string') return a.primary_category;
  if (a.category_name && typeof a.category_name === 'string') return a.category_name;
  if (Array.isArray(a.category) && a.category.length > 0) {
    const firstCat = a.category[0];
    const catName = typeof firstCat === 'object' ? (firstCat.name || firstCat.category_name || firstCat.title) : firstCat;
    if (catName && typeof catName === 'string') return catName;
  }
  if (Array.isArray(a.skill) && a.skill.length > 0) {
    const firstSkill = a.skill[0];
    const skillName = typeof firstSkill === 'object' ? (firstSkill.name || firstSkill.skill_name || firstSkill.title) : firstSkill;
    if (skillName && typeof skillName === 'string') return skillName;
  }
  return '';
};

export const getAstroPrice = (astro) => {
  if (!astro) return null;
  const a = unwrapAstro(astro);
  const p =
    a.per_min_chat ??
    a.per_min_voice_call ??
    a.per_min_video_call ??
    a.per_min_chat_charge ??
    a.per_min_voice_call_charge ??
    a.astrologer_charge ??
    a.charge ??
    a.rate ??
    a.per_minute ??
    a.per_min ??
    a.price ??
    a.chat_price ??
    a.call_price ??
    a.chat_rate ??
    a.call_rate ??
    a.voice_call_rate ??
    a.audio_call_charge ??
    a.consultation_price ??
    a.fee ??
    a.amount;

  if (p !== undefined && p !== null && p !== '') {
    const num = Number(p);
    if (!isNaN(num) && num >= 0) return num;
  }

  return null;
};

export const getAstroChatPrice = (astro) => {
  if (!astro) return null;
  const a = unwrapAstro(astro);
  const p =
    a.per_min_chat ??
    a.per_min_chat_charge ??
    a.chat_price ??
    a.chat_rate ??
    a.per_minute ??
    a.per_min ??
    a.price ??
    a.charge ??
    a.rate;

  if (p !== undefined && p !== null && p !== '') {
    const num = Number(p);
    if (!isNaN(num) && num >= 0) return num;
  }
  return getAstroPrice(astro);
};

export const getAstroCallPrice = (astro) => {
  if (!astro) return null;
  const a = unwrapAstro(astro);
  const p =
    a.per_min_voice_call ??
    a.per_min_call ??
    a.per_min_voice_call_charge ??
    a.call_price ??
    a.call_rate ??
    a.voice_call_rate ??
    a.audio_call_charge;

  if (p !== undefined && p !== null && p !== '') {
    const num = Number(p);
    if (!isNaN(num) && num >= 0) return num;
  }
  return getAstroPrice(astro);
};

export const getAstroRating = (astro) => {
  if (!astro) return 0;
  const a = unwrapAstro(astro);
  
  // 1. Explicit average rate fields from backend API
  const r = a.avg_rate ?? a.avg_rating ?? a.astrologer_rating ?? a.star_rating ?? a.rating_val ?? a.score;
  if (r !== undefined && r !== null && r !== '') {
    const num = Number(r);
    if (!isNaN(num) && num > 0) return Math.min(5, Math.max(1, num));
  }

  // 2. If a.rating is numeric and <= 5 (e.g. 4.8, 4.9, 5)
  if (typeof a.rating === 'number' || (typeof a.rating === 'string' && !isNaN(Number(a.rating)))) {
    const num = Number(a.rating);
    if (!isNaN(num) && num > 0 && num <= 5) return Math.min(5, Math.max(1, num));
  }

  // 3. If a.rating is an array of review objects [{ rating: 5 }, ...]
  if (Array.isArray(a.rating) && a.rating.length > 0) {
    const validRatings = a.rating.map(item => Number(item.rating || item.stars || item.rate)).filter(val => !isNaN(val) && val > 0);
    if (validRatings.length > 0) {
      const avg = validRatings.reduce((sum, val) => sum + val, 0) / validRatings.length;
      return parseFloat(avg.toFixed(1));
    }
  }

  return 0;
};

export const getAstroReviewCount = (astro) => {
  if (!astro) return 0;
  const a = unwrapAstro(astro);
  
  // 1. Direct review / rating count fields from backend API
  const rev = a.total_review ?? a.total_reviews ?? a.total_rating ?? a.rating_total_person ?? a.review_count ?? a.reviews_count ?? a.total_ratings;
  if (rev !== undefined && rev !== null && rev !== '') {
    const num = Number(rev);
    if (!isNaN(num) && num >= 0) return num;
  }

  // 2. If a.rating is numeric and > 5 (e.g. 111, 442, 26 -> total reviews)
  if (typeof a.rating === 'number' || (typeof a.rating === 'string' && !isNaN(Number(a.rating)))) {
    const num = Number(a.rating);
    if (!isNaN(num) && num > 5) return num;
  }

  // 3. If a.consult is provided and valid (e.g. "2997", "6748")
  if (a.consult !== undefined && a.consult !== null && a.consult !== '' && !isNaN(Number(a.consult))) {
    return Number(a.consult);
  }

  // 4. If a.rating is an array of reviews
  if (Array.isArray(a.rating) && a.rating.length > 0) {
    return a.rating.length;
  }

  return 0;
};
