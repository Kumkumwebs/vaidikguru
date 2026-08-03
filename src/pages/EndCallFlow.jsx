import React, { useState } from 'react';
import EndCallModal from './EndCallModal';
import RateConsultationModal from './RateConsultationModal';
import ThankYouModal from './ThankYouModal';
import BlessingsGiftModal from './BlessingsGiftModal';
import CallEndedModal from './CallEndedModal';

/**
 * Drives the full "end consultation" sequence shown in the reference design:
 *   1. End Call Confirmation
 *   2. Rate Your Consultation
 *   3. Thank You
 *   4. Send Blessings Gift (optional)
 *   5. Call Ended
 *
 * This component owns none of your call/networking logic — it only owns
 * which step is visible. You still supply the real actions (actually hang
 * up, actually submit the rating, actually send the gift, actually
 * navigate away) via props.
 *
 * USAGE (inside AudioCall.jsx / Chatconsultation.jsx):
 *
 *   const [endFlowOpen, setEndFlowOpen] = useState(false);
 *
 *   // wherever your "End Call" / "End Consultation" button is:
 *   <button onClick={() => setEndFlowOpen(true)}>End Call</button>
 *
 *   {endFlowOpen && (
 *     <EndCallFlow
 *       duration={fmt(secs)}
 *       amountUsed={`₹${Math.round((secs / 60) * price)}`}
 *       remainingBalance={`₹${wallet}`}
 *       astrologerName={name}
 *       onCancel={() => setEndFlowOpen(false)}              // "Continue Call"
 *       onConfirmEnd={async () => { await handleEnd(); }}    // your real hang-up logic
 *       onSubmitRating={async (payload) => {
 *         // payload = { rating, category, review, tags, anonymous }
 *         await addRating(channelId, payload.rating, payload.review);
 *       }}
 *       onSendGift={async (giftId) => {
 *         // optional: call your gift-sending API here
 *       }}
 *       onFinish={() => navigate('/', { replace: true })}    // called after "View Profile"
 *     />
 *   )}
 */
export default function EndCallFlow({
  duration,
  amountUsed,
  remainingBalance,
  astrologerName = 'Astrologer',
  gifts,           // real API gift list, forwarded to BlessingsGiftModal
  onCancel,
  onConfirmEnd,
  onSubmitRating,
  onSendGift,
  onFinish,
  initialStep = 'confirm',
}) {
  const [step, setStep] = useState(initialStep); // confirm | rate | thankYou | gift | ended
  const [ratingScore, setRatingScore] = useState(5);
  const [ending, setEnding] = useState(false);

  const handleConfirmEnd = async () => {
    if (ending) return;
    setEnding(true);
    try {
      await onConfirmEnd?.();
    } finally {
      setEnding(false);
      setStep('rate');
    }
  };

  return (
    <>
      {step === 'confirm' && (
        <EndCallModal
          duration={duration}
          amountUsed={amountUsed}
          remainingBalance={remainingBalance}
          onClose={onCancel}
          onContinue={onCancel}
          onEndCall={handleConfirmEnd}
        />
      )}

      {step === 'rate' && (
        <RateConsultationModal
          onClose={() => setStep('thankYou')}
          onSkip={() => setStep('thankYou')}
          onSubmit={async (payload) => {
            setRatingScore(payload?.rating ?? 5);
            await onSubmitRating?.(payload);
            setStep('thankYou');
          }}
        />
      )}

      {step === 'thankYou' && (
        <ThankYouModal rating={ratingScore} onBackToHome={() => setStep('gift')} />
      )}

      {step === 'gift' && (
        <BlessingsGiftModal
          astrologerName={astrologerName}
          gifts={gifts}
          onMaybeLater={() => setStep('ended')}
          onSendGift={async (giftId) => {
            await onSendGift?.(giftId);
            setStep('ended');
          }}
        />
      )}

      {step === 'ended' && (
        <CallEndedModal
          astrologerName={astrologerName}
          onViewProfile={onFinish}
        />
      )}
    </>
  );
}