import React, { useState } from 'react';
import RateConsultationModal from './RateConsultationModal';

export default function EndCallFlow({
  onSubmitRating,
  onFinish,
}) {
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (payload) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await onSubmitRating?.(payload);
    } finally {
      setSubmitting(false);
      onFinish?.();
    }
  };

  const handleSkip = () => {
    onFinish?.();
  };

  return (
    <RateConsultationModal
      onClose={handleSkip}
      onSkip={handleSkip}
      onSubmit={handleSubmit}
    />
  );
}