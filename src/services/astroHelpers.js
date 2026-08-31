export const getAstroPrice = (astro) => {
  if (!astro) return null;
  const p =
    astro.per_min_chat ??
    astro.per_min_voice_call ??
    astro.per_min_video_call ??
    astro.charge ??
    astro.rate ??
    astro.per_minute ??
    astro.price ??
    astro.chat_price ??
    astro.call_price;

  if (p !== undefined && p !== null && p !== '' && p !== 0 && p !== '0') {
    const num = Number(p);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
};

export const getAstroRating = (astro) => {
  if (!astro) return null;
  const r = astro.avg_rate ?? astro.avg_rating ?? astro.rating ?? astro.score;
  if (r !== undefined && r !== null && r !== '') {
    const num = Number(r);
    if (!isNaN(num) && num > 0) return num;
  }
  return null;
};

export const getAstroReviewCount = (astro) => {
  if (!astro) return null;
  const rev = astro.total_review ?? astro.total_reviews ?? astro.total_rating ?? astro.rating_total_person ?? astro.review_count;
  if (rev !== undefined && rev !== null && rev !== '') {
    const num = Number(rev);
    if (!isNaN(num) && num >= 0) return num;
  }
  return null;
};
