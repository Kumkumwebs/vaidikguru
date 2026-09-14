import React, { useEffect, useState, useCallback } from "react";

const CountdownTimer = ({ pujaDate }) => {
  const calculateTimeLeft = useCallback(() => {
    const targetDate = new Date(pujaDate);
    const now = new Date();

    // Guard against invalid/missing date
    if (isNaN(targetDate.getTime())) return null;

    const diff = targetDate - now;
    if (diff <= 0) return null;

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }, [pujaDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    // Recalculate immediately when pujaDate changes
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const updated = calculateTimeLeft();
      setTimeLeft(updated);

      // Stop the interval once the countdown reaches zero
      if (!updated) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  if (!timeLeft) {
    return <p className="countdown-ended">Booking Closed</p>;
  }

  function shareOnWhatsAppBtnHandler() {
    const currentUrl = window.location.href;
    let phone = "";
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      phone = user?.number ? `91${user.number}` : "";
    } catch (err) {
      console.warn("Could not parse user from sessionStorage:", err);
    }
    const message = encodeURIComponent(currentUrl);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  }

  return (
    <div className="container mb-25">
      <div className="countdown-card fade-in">
        <h3 className="countdown-title">Booking Ends In</h3>

        <div className="countdown-timer">
          <TimeBox value={timeLeft.days} label="Days" />
          <Separator />
          <TimeBox value={timeLeft.hours} label="Hours" />
          <Separator />
          <TimeBox value={timeLeft.minutes} label="Minutes" />
          <Separator />
          <TimeBox value={timeLeft.seconds} label="Seconds" pulse />
        </div>

        <button className="share-whatsapp" onClick={shareOnWhatsAppBtnHandler}>
          Share on WhatsApp
          <i className="fa-brands fa-whatsapp whatsapp-icon"></i>
        </button>
      </div>
    </div>
  );
};

const TimeBox = ({ value, label, pulse }) => (
  <div className={`time-box ${pulse ? "pulse" : ""}`}>
    <span className="time-value">{String(value).padStart(2, "0")}</span>
    <span className="time-label">{label}</span>
  </div>
);

const Separator = () => <span className="separator">:</span>;

export default CountdownTimer;