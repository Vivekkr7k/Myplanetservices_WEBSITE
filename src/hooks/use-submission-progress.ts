import { useState, useEffect } from 'react';

export interface UseSubmissionProgressOptions {
  steps?: string[];
  intervalMs?: number;
}

const DEFAULT_STEPS = [
  'Submitting details...',
  'Delivering confirmation emails...',
  'Securing inquiry in database...',
];

/**
 * Provides step-by-step progress feedback and an animated percentage during asynchronous form submissions.
 * Prevents visitor anxiety when cloud operations (Resend dispatch + MongoDB persistence) take 1-4 seconds.
 */
export function useSubmissionProgress(
  isLoading: boolean,
  options?: UseSubmissionProgressOptions
) {
  const steps = options?.steps ?? DEFAULT_STEPS;
  const intervalMs = options?.intervalMs ?? 1100;
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setStepIndex(0);
      return;
    }

    setStepIndex(0);
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isLoading, steps.length, intervalMs]);

  // Calculated progress percentage for visual progress bars (clamped before 100% until response returns)
  const progressPercent = isLoading
    ? Math.min(30 + stepIndex * 32, 94)
    : 0;

  return {
    currentStep: steps[stepIndex] ?? steps[0],
    stepIndex,
    progressPercent,
    isFirstStep: stepIndex === 0,
    isLastStep: stepIndex === steps.length - 1,
  };
}
