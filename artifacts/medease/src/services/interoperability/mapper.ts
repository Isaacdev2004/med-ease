import type {
  FhirBundle,
  Hl7Message,
  IntegrationEndpoint,
} from '@/services/interoperability/types';

export function toFhirBundleResource(bundle: FhirBundle) {
  return {
    resourceType: 'Bundle',
    id: bundle.bundleId,
    type: bundle.type,
    total: bundle.entryCount,
  };
}

export function toDetectedIssueFromHl7(message: Hl7Message) {
  return {
    resourceType: 'DetectedIssue',
    detail: `HL7 ${message.type} processing`,
    status: message.status,
  };
}

export function toEndpointCapabilityStatement(endpoint: IntegrationEndpoint) {
  return {
    resourceType: 'CapabilityStatement',
    id: endpoint.endpointId,
    status: endpoint.status,
    url: endpoint.baseUrl,
  };
}
