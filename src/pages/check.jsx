import React, { useState } from 'react';
import EndCallModal from './EndCallModal';
import RateConsultationModal from './RateConsultationModal';
import ThankYouModal from './ThankYouModal';
import BlessingsGiftModal from './BlessingsGiftModal';
import CallEndedModal from './CallEndedModal';

// Demo harness: shows each modal one after another, matching the 5-step
// "end consultation" flow from the reference design:
// 1. End Call Confirmation -> 2. Rate Your Consultation ->
// 3. Thank You -> 4. Send Blessings Gift (Optional) -> 5. Call Ended
//
// Each modal can also be imported and used on its own anywhere in the app.

export default function Check() {
  const [step, setStep] = useState('endCall'); // endCall | rate | thankYou | gift | callEnded | done
  const [ratingScore, setRatingScore] = useState(5);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0c' }}>
      {step === 'endCall' && (
        <EndCallModal
          duration="08:24"
          amountUsed="₹126"
          remainingBalance="₹210"
          onClose={() => setStep('done')}
          onContinue={() => setStep('done')}
          onEndCall={() => setStep('rate')}
        />
      )}

      {step === 'rate' && (
        <RateConsultationModal
          onClose={() => setStep('thankYou')}
          onSkip={() => setStep('thankYou')}
          onSubmit={(data) => {
            console.log('Review submitted:', data);
            setRatingScore(data?.rating ?? 5);
            setStep('thankYou');
          }}
        />
      )}

      {step === 'thankYou' && (
        <ThankYouModal rating={ratingScore} onBackToHome={() => setStep('gift')} />
      )}

      {step === 'gift' && (
        <BlessingsGiftModal
          astrologerName="Acharya Rohit Sharma"
          onMaybeLater={() => setStep('callEnded')}
          onSendGift={(giftId) => {
            console.log('Gift sent:', giftId);
            setStep('callEnded');
          }}
        />
      )}

      {step === 'callEnded' && (
        <CallEndedModal
          astrologerName="Acharya Rohit Sharma"
          onViewProfile={() => setStep('done')}
        />
      )}

      {step === 'done' && (
        <div
          style={{
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
          }}
        >
          Flow complete.{' '}
          <button
            style={{ marginLeft: 8, cursor: 'pointer' }}
            onClick={() => setStep('endCall')}
          >
            Restart
          </button>
        </div>
      )}
    </div>
  );
}