import type { CarePlanType, PathwayId } from '@/services/care-plans/types';

export interface CarePlanTemplate {
  id: string;
  name: string;
  type: CarePlanType;
  pathwayId?: PathwayId;
  description: string;
  defaultGoals: string[];
  defaultTasks: string[];
}

export const CARE_PLAN_TEMPLATES: CarePlanTemplate[] = [
  {
    id: 'tpl-diabetes',
    name: 'Diabetes Management Template',
    type: 'chronic_disease',
    pathwayId: 'diabetes',
    description:
      'Standard diabetes care plan with HbA1c monitoring and medication adherence.',
    defaultGoals: [
      'HbA1c < 7%',
      'Daily glucose monitoring',
      'Weight management',
    ],
    defaultTasks: ['Quarterly HbA1c', 'Annual eye exam', 'Foot examination'],
  },
  {
    id: 'tpl-hypertension',
    name: 'Hypertension Control Template',
    type: 'chronic_disease',
    pathwayId: 'hypertension',
    description: 'Blood pressure management with lifestyle modifications.',
    defaultGoals: ['BP < 130/80', 'Reduce sodium intake', 'Regular exercise'],
    defaultTasks: [
      'Home BP monitoring',
      'Medication review',
      'Follow-up visit',
    ],
  },
  {
    id: 'tpl-post-op',
    name: 'Post-Operative Recovery Template',
    type: 'post_operative',
    pathwayId: 'post_surgery',
    description: 'Structured post-surgical recovery plan.',
    defaultGoals: ['Pain control', 'Wound healing', 'Restore mobility'],
    defaultTasks: [
      'Wound care',
      'Physical therapy sessions',
      'Pain assessment',
    ],
  },
];

export function getTemplate(id: string) {
  return CARE_PLAN_TEMPLATES.find((t) => t.id === id) ?? null;
}
