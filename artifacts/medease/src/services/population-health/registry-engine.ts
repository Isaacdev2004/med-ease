import type { DiseaseRegistry, RegistryType } from '@/services/population-health/types';

export function registryCompliance(registry: DiseaseRegistry): number {
  return registry.complianceRate;
}

export function sortRegistriesByGap(registries: DiseaseRegistry[]): DiseaseRegistry[] {
  return [...registries].sort((a, b) => b.openGaps - a.openGaps);
}

export function filterByRegistryType(registries: DiseaseRegistry[], type: RegistryType): DiseaseRegistry[] {
  return registries.filter((r) => r.type === type);
}
