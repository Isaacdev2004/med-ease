export function notifyTrialEnrollment(
  trialTitle: string,
  participantId: string,
) {
  return {
    type: 'research.enrollment',
    title: 'Participant Enrolled',
    message: `${participantId} enrolled in ${trialTitle}`,
  };
}

export function notifyAdverseEvent(trialId: string, serious: boolean) {
  return {
    type: 'research.adverse_event',
    title: serious ? 'Serious Adverse Event' : 'Adverse Event Reported',
    message: `New event reported for trial ${trialId}`,
  };
}

export function notifyConsentSigned(participantId: string) {
  return {
    type: 'research.consent',
    title: 'Consent Recorded',
    message: `eConsent signed for participant ${participantId}`,
  };
}

export function notifyPublicationSubmitted(title: string) {
  return {
    type: 'research.publication',
    title: 'Publication Submitted',
    message: `"${title}" submitted for review`,
  };
}
