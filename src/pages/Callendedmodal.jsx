import React from 'react';
import { Phone, Sparkles } from 'lucide-react';
import './Modals.css';

export default function CallEndedModal({
  astrologerName = 'Acharya Rohit Sharma',
  onViewProfile,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--narrow modal-card--center">
        <div className="modal-icon-circle modal-icon-circle--purple">
          <Phone size={26} className="modal-icon--purple" fill="currentColor" />
          <Sparkles size={14} className="sparkle sparkle--tl" />
          <Sparkles size={10} className="sparkle sparkle--tr" />
          <Sparkles size={10} className="sparkle sparkle--bl" />
          <Sparkles size={14} className="sparkle sparkle--br" />
        </div>

        <h2 className="modal-title">Call Ended</h2>
        <p className="modal-subtitle">
          Thank you for consulting with {astrologerName}.
        </p>
        <p className="modal-subtitle">
          We hope this guidance brings positivity in your life.
        </p>

        <button
          className="btn btn--primary btn--full btn--spaced"
          onClick={onViewProfile}
        >
          View Profile
        </button>
      </div>
    </div>
  );
}