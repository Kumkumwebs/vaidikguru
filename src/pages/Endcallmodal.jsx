import React from 'react';
import { X, Phone } from 'lucide-react';
import './Modals.css';

export default function EndCallModal({
  duration = '08:24',
  amountUsed = '₹126',
  remainingBalance = '₹210',
  onContinue,
  onEndCall,
  onClose,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-card modal-card--narrow">
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="modal-icon-circle modal-icon-circle--pink">
          <Phone
            size={24}
            className="modal-icon--maroon"
            fill="currentColor"
            style={{ transform: 'rotate(135deg)' }}
          />
        </div>

        <h2 className="modal-title">End Call?</h2>
        <p className="modal-subtitle">
          Are you sure you want to end this consultation?
        </p>

        <div className="summary-box">
          <div className="summary-row">
            <span>Duration</span>
            <span className="summary-value">{duration}</span>
          </div>
          <div className="summary-row">
            <span>Amount Used</span>
            <span className="summary-value">{amountUsed}</span>
          </div>
          <div className="summary-row">
            <span>Remaining Balance</span>
            <span className="summary-value">{remainingBalance}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn--outline" onClick={onContinue}>
            Continue Call
          </button>
          <button className="btn btn--primary" onClick={onEndCall}>
            End Call
          </button>
        </div>
      </div>
    </div>
  );
}