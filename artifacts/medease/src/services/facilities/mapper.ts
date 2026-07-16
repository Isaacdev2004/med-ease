import type { BiomedicalDevice, Building, FacilitySite, Room } from '@/services/facilities/types';

export function toFhirDevice(equipment: BiomedicalDevice) {
  return {
    resourceType: 'Device',
    id: equipment.equipmentId,
    status: equipment.status === 'operational' ? 'active' : 'inactive',
    manufacturer: equipment.manufacturer,
    modelNumber: equipment.model,
    serialNumber: equipment.serialNumber,
    type: { text: equipment.category },
  };
}

export function toFhirLocation(room: Room, building?: Building) {
  return {
    resourceType: 'Location',
    id: room.roomId,
    status: room.status === 'available' ? 'active' : 'inactive',
    name: room.name,
    description: `${room.type} room ${room.number}`,
    partOf: building ? { reference: `Location/${building.buildingId}` } : undefined,
  };
}

export function toFhirHealthcareService(facility: FacilitySite) {
  return {
    resourceType: 'HealthcareService',
    id: facility.facilityId,
    name: facility.name,
    active: facility.status === 'active',
    category: [{ text: facility.type }],
  };
}

export function toFhirOrganization(facility: FacilitySite) {
  return {
    resourceType: 'Organization',
    id: facility.facilityId,
    name: facility.name,
    active: facility.status === 'active',
    type: [{ text: facility.type }],
  };
}

export function toFhirEndpoint(facilityId: string) {
  return {
    resourceType: 'Endpoint',
    id: `ep-${facilityId}`,
    status: 'active',
    connectionType: { code: 'hl7-fhir-rest' },
    address: `https://api.example.com/fhir/${facilityId}`,
  };
}
