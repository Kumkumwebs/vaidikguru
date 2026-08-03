import React from 'react';
import { Check, Sparkles, Star } from 'lucide-react';
import './Modals.css';

export default function ThankYouModal({ rating = 5, onBackToHome }) {
  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--narrow modal-card--center">
        <div className="modal-icon-circle modal-icon-circle--green">
          <Check size={30} className="modal-icon--green" strokeWidth={3} />
          <Sparkles size={14} className="sparkle sparkle--tl" />
          <Sparkles size={10} className="sparkle sparkle--tr" />
          <Sparkles size={10} className="sparkle sparkle--bl" />
          <Sparkles size={14} className="sparkle sparkle--br" />
        </div>

        <h2 className="modal-title">Thank You!</h2>
        <p className="modal-subtitle">
          Your review has been submitted successfully.
        </p>

        <div className="star-row star-row--static">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              size={24}
              fill="currentColor"
              className={i <= rating ? 'star star--filled' : 'star'}
            />
          ))}
        </div>

        <button className="btn btn--primary btn--full" onClick={onBackToHome}>
          Back to Home
        </button>
      </div>
    </div>
  );
}