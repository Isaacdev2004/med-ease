import type { LabCategory, LabTestDefinition, ResultFlag } from '@/services/laboratory/types';

export const LAB_TEST_CATALOG: LabTestDefinition[] = [
  { id: 't-hgb', loincCode: '718-7', name: 'Hemoglobin', category: 'hematology', description: 'Measures oxygen-carrying protein in red blood cells.', specimenType: 'Whole blood', tubeType: 'EDTA Lavender', collectionInstructions: 'No fasting required.', normalRange: '12.0–16.0', criticalRange: '<7 or >20', referenceRange: '12.0–16.0 g/dL', units: 'g/dL', turnaroundHours: 4, costPlaceholder: 12 },
  { id: 't-wbc', loincCode: '6690-2', name: 'White Blood Cells', category: 'hematology', description: 'Total leukocyte count.', specimenType: 'Whole blood', tubeType: 'EDTA Lavender', collectionInstructions: 'Mix gently after collection.', normalRange: '4.5–11.0', criticalRange: '<2 or >30', referenceRange: '4.5–11.0 ×10³/µL', units: '×10³/µL', turnaroundHours: 4, costPlaceholder: 10 },
  { id: 't-plt', loincCode: '777-3', name: 'Platelets', category: 'hematology', description: 'Platelet count for clotting assessment.', specimenType: 'Whole blood', tubeType: 'EDTA Lavender', collectionInstructions: 'Avoid clots.', normalRange: '150–400', referenceRange: '150–400 ×10³/µL', units: '×10³/µL', turnaroundHours: 4, costPlaceholder: 10 },
  { id: 't-glucose', loincCode: '2345-7', name: 'Fasting Glucose', category: 'biochemistry', description: 'Fasting blood sugar level.', preparation: 'Fast 8–12 hours.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Fasting required.', normalRange: '70–100', criticalRange: '<40 or >400', referenceRange: '70–100 mg/dL', units: 'mg/dL', turnaroundHours: 2, costPlaceholder: 8 },
  { id: 't-hba1c', loincCode: '4548-4', name: 'HbA1c', category: 'biochemistry', description: '3-month average blood glucose.', specimenType: 'Whole blood', tubeType: 'EDTA Lavender', collectionInstructions: 'No fasting required.', normalRange: '<5.7', criticalRange: '>14', referenceRange: '<5.7 %', units: '%', turnaroundHours: 24, costPlaceholder: 25 },
  { id: 't-creat', loincCode: '2160-0', name: 'Creatinine', category: 'biochemistry', description: 'Kidney function marker.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'No special prep.', normalRange: '0.7–1.3', criticalRange: '>5', referenceRange: '0.7–1.3 mg/dL', units: 'mg/dL', turnaroundHours: 4, costPlaceholder: 10 },
  { id: 't-egfr', loincCode: '33914-3', name: 'eGFR', category: 'biochemistry', description: 'Estimated glomerular filtration rate.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Calculated from creatinine.', normalRange: '>60', criticalRange: '<15', referenceRange: '>60 mL/min', units: 'mL/min', turnaroundHours: 4, costPlaceholder: 0 },
  { id: 't-alt', loincCode: '1742-6', name: 'ALT', category: 'biochemistry', description: 'Liver enzyme.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Avoid hemolysis.', normalRange: '7–56', criticalRange: '>1000', referenceRange: '7–56 U/L', units: 'U/L', turnaroundHours: 4, costPlaceholder: 12 },
  { id: 't-ast', loincCode: '1920-8', name: 'AST', category: 'biochemistry', description: 'Liver/cardiac enzyme.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Avoid hemolysis.', normalRange: '10–40', referenceRange: '10–40 U/L', units: 'U/L', turnaroundHours: 4, costPlaceholder: 12 },
  { id: 't-ldl', loincCode: '13457-7', name: 'LDL Cholesterol', category: 'biochemistry', description: 'Low-density lipoprotein cholesterol.', preparation: 'Fast 9–12 hours preferred.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Fasting preferred.', normalRange: '<100', referenceRange: '<100 mg/dL', units: 'mg/dL', turnaroundHours: 8, costPlaceholder: 18 },
  { id: 't-hdl', loincCode: '2085-9', name: 'HDL Cholesterol', category: 'biochemistry', description: 'High-density lipoprotein cholesterol.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Fasting preferred.', normalRange: '>40', referenceRange: '>40 mg/dL', units: 'mg/dL', turnaroundHours: 8, costPlaceholder: 18 },
  { id: 't-tsh', loincCode: '3016-3', name: 'TSH', category: 'endocrinology', description: 'Thyroid stimulating hormone.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Morning sample preferred.', normalRange: '0.4–4.0', referenceRange: '0.4–4.0 mIU/L', units: 'mIU/L', turnaroundHours: 24, costPlaceholder: 22 },
  { id: 't-na', loincCode: '2951-2', name: 'Sodium', category: 'biochemistry', description: 'Serum sodium level.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Avoid hemolysis.', normalRange: '136–145', criticalRange: '<120 or >160', referenceRange: '136–145 mEq/L', units: 'mEq/L', turnaroundHours: 2, costPlaceholder: 8 },
  { id: 't-k', loincCode: '2823-3', name: 'Potassium', category: 'biochemistry', description: 'Serum potassium level.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Process promptly.', normalRange: '3.5–5.0', criticalRange: '<2.5 or >6.5', referenceRange: '3.5–5.0 mEq/L', units: 'mEq/L', turnaroundHours: 2, costPlaceholder: 8 },
  { id: 't-pt', loincCode: '5902-2', name: 'Prothrombin Time', category: 'coagulation', description: 'Coagulation screening test.', specimenType: 'Plasma', tubeType: 'Blue Citrate', collectionInstructions: 'Fill tube completely.', normalRange: '11–13.5', referenceRange: '11–13.5 sec', units: 'sec', turnaroundHours: 2, costPlaceholder: 15 },
  { id: 't-inr', loincCode: '6301-6', name: 'INR', category: 'coagulation', description: 'International normalized ratio.', specimenType: 'Plasma', tubeType: 'Blue Citrate', collectionInstructions: 'Fill tube completely.', normalRange: '0.8–1.2', criticalRange: '>5', referenceRange: '0.8–1.2', units: 'ratio', turnaroundHours: 2, costPlaceholder: 15 },
  { id: 't-ua', loincCode: '5767-9', name: 'Urinalysis', category: 'urinalysis', description: 'Complete urinalysis panel.', specimenType: 'Urine', tubeType: 'Sterile cup', collectionInstructions: 'Clean-catch midstream.', normalRange: 'Normal', referenceRange: 'See report', units: '', turnaroundHours: 2, costPlaceholder: 10 },
  { id: 't-covid', loincCode: '94500-6', name: 'COVID-19 PCR', category: 'covid', description: 'SARS-CoV-2 nucleic acid detection.', specimenType: 'Nasopharyngeal swab', tubeType: 'VTM', collectionInstructions: 'Collect per protocol.', normalRange: 'Not detected', referenceRange: 'Not detected', units: '', turnaroundHours: 12, costPlaceholder: 45 },
  { id: 't-hcg', loincCode: '2106-3', name: 'Beta hCG', category: 'pregnancy', description: 'Pregnancy hormone quantification.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'No fasting required.', normalRange: 'Context dependent', referenceRange: 'See report', units: 'mIU/mL', turnaroundHours: 4, costPlaceholder: 20 },
  { id: 't-culture', loincCode: '630-4', name: 'Blood Culture', category: 'microbiology', description: 'Aerobic/anaerobic blood culture.', specimenType: 'Whole blood', tubeType: 'Culture bottles', collectionInstructions: 'Sterile technique required.', normalRange: 'No growth', referenceRange: 'No growth', units: '', turnaroundHours: 72, costPlaceholder: 55 },
  { id: 't-hiv', loincCode: '75622-1', name: 'HIV Antibody/Antigen', category: 'immunology', description: 'HIV screening test.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Pre-test counseling documented.', normalRange: 'Non-reactive', referenceRange: 'Non-reactive', units: '', turnaroundHours: 24, costPlaceholder: 35 },
  { id: 't-hep', loincCode: '22322-2', name: 'Hepatitis B Surface Antigen', category: 'virology', description: 'HBV infection screening.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'No special prep.', normalRange: 'Non-reactive', referenceRange: 'Non-reactive', units: '', turnaroundHours: 24, costPlaceholder: 30 },
  { id: 't-bnp', loincCode: '33762-6', name: 'BNP', category: 'biochemistry', description: 'Heart failure biomarker.', specimenType: 'Plasma EDTA', tubeType: 'EDTA Lavender', collectionInstructions: 'Process within 4 hours.', normalRange: '<100', criticalRange: '>900', referenceRange: '<100 pg/mL', units: 'pg/mL', turnaroundHours: 4, costPlaceholder: 40 },
  { id: 't-trop', loincCode: '10839-9', name: 'Troponin I', category: 'biochemistry', description: 'Cardiac injury marker.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'STAT for chest pain.', normalRange: '<0.04', criticalRange: '>0.4', referenceRange: '<0.04 ng/mL', units: 'ng/mL', turnaroundHours: 1, costPlaceholder: 45 },
  { id: 't-vitd', loincCode: '1989-3', name: 'Vitamin D 25-OH', category: 'endocrinology', description: 'Vitamin D status assessment.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Protect from light.', normalRange: '30–100', referenceRange: '30–100 ng/mL', units: 'ng/mL', turnaroundHours: 48, costPlaceholder: 35 },
  { id: 't-ferr', loincCode: '2276-4', name: 'Ferritin', category: 'hematology', description: 'Iron storage protein.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'Morning sample preferred.', normalRange: '20–250', referenceRange: '20–250 ng/mL', units: 'ng/mL', turnaroundHours: 8, costPlaceholder: 22 },
  { id: 't-cr', loincCode: '2161-8', name: 'C-Reactive Protein', category: 'immunology', description: 'Inflammation marker.', specimenType: 'Serum', tubeType: 'Gold SST', collectionInstructions: 'No special prep.', normalRange: '<3', referenceRange: '<3 mg/L', units: 'mg/L', turnaroundHours: 4, costPlaceholder: 15 },
  { id: 't-path', loincCode: '60567-5', name: 'Tissue Pathology', category: 'pathology', description: 'Histopathology examination.', specimenType: 'Tissue biopsy', tubeType: 'Formalin container', collectionInstructions: 'Label per specimen site.', normalRange: 'N/A', referenceRange: 'See report', units: '', turnaroundHours: 168, costPlaceholder: 120 },
  { id: 't-gen', loincCode: '48018-6', name: 'BRCA1/BRCA2 Panel', category: 'genetics', description: 'Hereditary cancer gene panel.', specimenType: 'Whole blood', tubeType: 'EDTA Lavender', collectionInstructions: 'Genetic counseling required.', normalRange: 'N/A', referenceRange: 'See report', units: '', turnaroundHours: 336, costPlaceholder: 350 },
  { id: 't-tox', loincCode: '19295-2', name: 'Drug Screen Panel', category: 'toxicology', description: 'Comprehensive toxicology screen.', specimenType: 'Urine', tubeType: 'Sterile cup', collectionInstructions: 'Chain of custody if forensic.', normalRange: 'Negative', referenceRange: 'Negative', units: '', turnaroundHours: 24, costPlaceholder: 65 },
  { id: 't-abo', loincCode: '882-1', name: 'ABO/Rh Typing', category: 'blood_bank', description: 'Blood type determination.', specimenType: 'Whole blood', tubeType: 'EDTA Lavender', collectionInstructions: 'Two samples if transfusion.', normalRange: 'N/A', referenceRange: 'See report', units: '', turnaroundHours: 2, costPlaceholder: 20 },
];

export function getTestById(id: string): LabTestDefinition | undefined {
  return LAB_TEST_CATALOG.find((t) => t.id === id);
}

export function getTestsByCategory(category: LabCategory): LabTestDefinition[] {
  return LAB_TEST_CATALOG.filter((t) => t.category === category);
}

export function computeResultFlag(test: LabTestDefinition, numericValue: number): ResultFlag {
  const [lowStr, highStr] = test.normalRange.split('–').map((s) => s.replace(/[<>]/g, '').trim());
  const low = parseFloat(lowStr ?? '');
  const high = parseFloat(highStr ?? '');
  if (test.criticalRange) {
    const critParts = test.criticalRange.split(' or ');
    for (const part of critParts) {
      if (part.startsWith('<') && numericValue < parseFloat(part.slice(1))) return 'critical_low';
      if (part.startsWith('>') && numericValue > parseFloat(part.slice(1))) return 'critical_high';
    }
  }
  if (!Number.isNaN(low) && numericValue < low) return numericValue < low * 0.7 ? 'critical_low' : 'low';
  if (!Number.isNaN(high) && numericValue > high) return numericValue > high * 1.5 ? 'critical_high' : 'high';
  return 'normal';
}

export function getReferenceRange(testId: string): string {
  return getTestById(testId)?.referenceRange ?? 'See report';
}
