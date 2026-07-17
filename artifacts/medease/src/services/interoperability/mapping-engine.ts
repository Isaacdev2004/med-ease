import type {
  MappingDirection,
  MappingProfile,
} from '@/services/interoperability/types';

export function validateMappingProfile(profile: MappingProfile): boolean {
  return (
    profile.fieldCount > 0 &&
    Boolean(profile.sourceEntity && profile.targetFormat)
  );
}

export function mapInternalToFhir(
  entity: string,
  fields: Record<string, string>,
): Record<string, unknown> {
  return {
    resourceType: entity,
    ...Object.fromEntries(
      Object.entries(fields).map(([k, v]) => [
        k.replace(/([A-Z])/g, '-$1').toLowerCase(),
        v,
      ]),
    ),
  };
}

export function getMappingDirectionLabel(direction: MappingDirection): string {
  return direction.replace(/_/g, ' ').replace('internal to', 'Internal →');
}
