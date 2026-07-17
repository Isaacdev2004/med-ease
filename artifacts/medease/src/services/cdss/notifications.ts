export function notifyAlertTriggered(patientName: string, title: string) {
  return {
    type: 'cdss_alert' as const,
    title: `CDSS Alert: ${title}`,
    body: `Clinical alert for ${patientName}`,
  };
}

export function notifyRecommendationApplied(title: string) {
  return {
    type: 'cdss_recommendation' as const,
    title: 'Recommendation applied',
    body: title,
  };
}
