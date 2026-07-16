export type WorkforceNotificationType =
  | 'shift_reminder'
  | 'certification_expiry'
  | 'training_due'
  | 'leave_approval'
  | 'schedule_change'
  | 'emergency_staffing'
  | 'clock_reminder';

export function buildWorkforceNotification(type: WorkforceNotificationType, context: Record<string, string>) {
  const templates: Record<WorkforceNotificationType, { title: string; body: string }> = {
    shift_reminder: { title: 'Shift reminder', body: `Your ${context.shiftType ?? 'shift'} starts at ${context.time ?? 'soon'}.` },
    certification_expiry: { title: 'Certification expiring', body: `${context.certName ?? 'Certification'} expires ${context.expiryDate ?? 'soon'}.` },
    training_due: { title: 'Training due', body: `Complete ${context.course ?? 'training'} by ${context.dueDate ?? 'deadline'}.` },
    leave_approval: { title: 'Leave request', body: `Leave request ${context.status ?? 'updated'} for ${context.employee ?? 'employee'}.` },
    schedule_change: { title: 'Schedule updated', body: `Your schedule for ${context.date ?? 'upcoming week'} has changed.` },
    emergency_staffing: { title: 'Emergency staffing', body: `Additional staff needed in ${context.department ?? 'department'}.` },
    clock_reminder: { title: 'Clock reminder', body: 'Remember to clock in for your shift.' },
  };
  return { id: `wf-notif-${Date.now()}`, type, ...templates[type], context, createdAt: new Date().toISOString() };
}
