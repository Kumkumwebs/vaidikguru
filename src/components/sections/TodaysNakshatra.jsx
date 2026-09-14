import { motion } from "framer-motion";
import { calculateMoonLongitude, getNakshatraFromLongitude } from "../utils/NakshatraUtils";

const TodayNakshatra = () => {
  const today = new Date();
  const nak = getNakshatraFromLongitude(calculateMoonLongitude(today));

  return (
    <motion.div
      className="diviniq-card today-nakshatra"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <span className="tag">🌙 Today’s Nakshatra</span>
      <h3>{nak}</h3>
      <p>Based on current lunar position (Vedic Astrology)</p>
    </motion.div>
  );
};

export default TodayNakshatra;
