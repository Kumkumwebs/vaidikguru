export const NAKSHATRAS = [
  "Ashwini","Bharani","Krittika","Rohini","Mrigashirsha",
  "Ardra","Punarvasu","Pushya","Ashlesha",
  "Magha","Purva Phalguni","Uttara Phalguni","Hasta",
  "Chitra","Swati","Vishakha","Anuradha","Jyeshtha",
  "Mula","Purva Ashadha","Uttara Ashadha","Shravana",
  "Dhanishta","Shatabhisha","Purva Bhadrapada",
  "Uttara Bhadrapada","Revati"
];

export function calculateMoonLongitude(date) {
  const base = new Date("2000-01-01T00:00:00Z");
  const days = (date - base) / (1000 * 60 * 60 * 24);
  let lon = (days * 13.176) % 360;
  return lon < 0 ? lon + 360 : lon;
}

export function getNakshatraFromLongitude(lon) {
  const part = 360 / 27;
  return NAKSHATRAS[Math.floor(lon / part)];
}
