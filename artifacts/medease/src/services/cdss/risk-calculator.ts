import type { CalculatorResult, CalculatorType } from '@/services/cdss/types';

export function calculateRisk(
  type: CalculatorType,
  inputs: Record<string, number | boolean | string>,
): { score: number; interpretation: string } {
  switch (type) {
    case 'chads_vasc': {
      const age = Number(inputs.age ?? 0);
      const chf = inputs.chf ? 1 : 0;
      const htn = inputs.htn ? 1 : 0;
      const diabetes = inputs.diabetes ? 1 : 0;
      const stroke = inputs.stroke ? 2 : 0;
      const vascular = inputs.vascular ? 1 : 0;
      const sex = inputs.sex === 'female' ? 1 : 0;
      const ageScore = age >= 75 ? 2 : age >= 65 ? 1 : 0;
      const score = chf + htn + ageScore + diabetes + stroke + vascular + sex;
      return { score, interpretation: score >= 2 ? 'Anticoagulation recommended' : 'Low stroke risk' };
    }
    case 'has_bled': {
      const score =
        (inputs.htn ? 1 : 0) +
        (inputs.renal ? 1 : 0) +
        (inputs.liver ? 1 : 0) +
        (inputs.stroke ? 1 : 0) +
        (inputs.bleeding ? 1 : 0) +
        (inputs.labile ? 1 : 0) +
        (inputs.elderly ? 1 : 0) +
        (inputs.drugs ? 1 : 0);
      return { score, interpretation: score >= 3 ? 'High bleeding risk' : 'Moderate/low bleeding risk' };
    }
    case 'wells': {
      const score =
        (inputs.cancer ? 1 : 0) +
        (inputs.paralysis ? 1 : 0) +
        (inputs.immobilization ? 1 : 0) +
        (inputs.tenderness ? 1 : 0) +
        (inputs.legSwelling ? 1 : 0) +
        (inputs.differential ? 1 : 0) +
        (inputs.pitting ? 1 : 0) +
        (inputs.collateral ? 1 : 0) +
        (inputs.previousDvt ? 1 : 0) +
        (inputs.alternative ? -2 : 0);
      return { score, interpretation: score >= 3 ? 'PE likely — consider imaging' : 'PE unlikely' };
    }
    case 'curb65': {
      const score =
        (inputs.confusion ? 1 : 0) +
        (inputs.urea ? 1 : 0) +
        (inputs.respiratory ? 1 : 0) +
        (inputs.bp ? 1 : 0) +
        (inputs.age65 ? 1 : 0);
      return { score, interpretation: score >= 3 ? 'Severe pneumonia — consider ICU' : 'Outpatient/moderate care' };
    }
    case 'news2':
    case 'mews': {
      const score = Number(inputs.respRate ?? 0) + Number(inputs.spo2 ?? 0) + Number(inputs.temp ?? 0) + Number(inputs.sbp ?? 0) + Number(inputs.hr ?? 0);
      return { score, interpretation: score >= 7 ? 'High clinical risk' : score >= 5 ? 'Medium risk' : 'Low risk' };
    }
    case 'bmi': {
      const weight = Number(inputs.weight ?? 70);
      const height = Number(inputs.height ?? 170) / 100;
      const score = Math.round((weight / (height * height)) * 10) / 10;
      return { score, interpretation: score >= 30 ? 'Obese' : score >= 25 ? 'Overweight' : 'Normal weight' };
    }
    case 'bsa': {
      const weight = Number(inputs.weight ?? 70);
      const height = Number(inputs.height ?? 170);
      const score = Math.round(Math.sqrt((height * weight) / 3600) * 100) / 100;
      return { score, interpretation: `BSA ${score} m²` };
    }
    case 'creatinine_clearance': {
      const age = Number(inputs.age ?? 65);
      const weight = Number(inputs.weight ?? 70);
      const creatinine = Number(inputs.creatinine ?? 1);
      const sexFactor = inputs.sex === 'female' ? 0.85 : 1;
      const score = Math.round(((140 - age) * weight * sexFactor) / (72 * creatinine));
      return { score, interpretation: score < 60 ? 'Dose adjustment may be required' : 'Normal renal function' };
    }
    case 'egfr': {
      const creatinine = Number(inputs.creatinine ?? 1);
      const age = Number(inputs.age ?? 65);
      const sexFactor = inputs.sex === 'female' ? 0.993 : 1;
      const score = Math.round(175 * Math.pow(creatinine, -1.154) * Math.pow(age, -0.203) * sexFactor);
      return { score, interpretation: score < 60 ? 'CKD stage concern' : 'Normal eGFR' };
    }
    case 'ascvd':
    case 'framingham': {
      const score = Number(inputs.age ?? 50) + (inputs.smoker ? 5 : 0) + (inputs.diabetes ? 3 : 0) + (inputs.htn ? 2 : 0);
      return { score, interpretation: score >= 20 ? 'High cardiovascular risk' : 'Moderate cardiovascular risk' };
    }
    default:
      return { score: 0, interpretation: 'Unable to calculate' };
  }
}

export function buildCalculatorResult(
  calculatorId: string,
  type: CalculatorType,
  inputs: Record<string, number | boolean | string>,
  patientId?: string,
): CalculatorResult {
  const { score, interpretation } = calculateRisk(type, inputs);
  return {
    resultId: `calc-${Date.now()}`,
    calculatorId,
    calculatorType: type,
    patientId,
    score,
    interpretation,
    inputs,
    calculatedAt: new Date().toISOString(),
  };
}
