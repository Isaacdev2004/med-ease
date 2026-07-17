import type {
  Bed,
  BiomedicalDevice,
  Building,
  CalibrationRecord,
  EnvironmentalReading,
  FacilitiesDashboard,
  FacilitySite,
  Floor,
  Incident,
  Inspection,
  IoTSensor,
  MedicalEquipment,
  PreventiveMaintenance,
  Room,
  ServiceContract,
  UtilitySystem,
  Vehicle,
  Vendor,
  WorkOrder,
} from '@/services/facilities/types';

const HOSPITALS = Array.from({ length: 25 }, (_, i) => ({
  id: `fac-${String(i + 1).padStart(3, '0')}`,
  name:
    [
      'Pitié-Salpêtrière',
      'Hôpital Européen',
      'Centre Hospitalier Lyon',
      'CHU Bordeaux',
      'Hôpital Saint-Louis',
    ][i % 5] ?? `Hospital ${i + 1}`,
}));
const CLINICS = Array.from({ length: 60 }, (_, i) => ({
  id: `cln-${String(i + 1).padStart(3, '0')}`,
  name: `Clinic ${i + 1}`,
  parent: HOSPITALS[i % 25]!.id,
}));

const EQUIP_CATEGORIES = [
  'Imaging',
  'Ventilator',
  'Monitor',
  'Infusion Pump',
  'Defibrillator',
  'Analyzer',
  'Sterilizer',
  'Ultrasound',
];
const MANUFACTURERS = [
  'GE Healthcare',
  'Siemens Healthineers',
  'Philips',
  'Medtronic',
  'Dräger',
  'BD',
  'Stryker',
];
const UTILITY_TYPES = [
  'electrical',
  'hvac',
  'water',
  'medical_gas',
  'generator',
  'ups',
  'fire_safety',
  'security',
] as const;

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function daysFromNow(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export const MOCK_FACILITY_SITES: FacilitySite[] = [
  ...HOSPITALS.map((h, i) => ({
    facilityId: h.id,
    name: h.name,
    code: `FAC-${String(i + 1).padStart(3, '0')}`,
    type: 'hospital' as const,
    address: `${100 + i} Avenue de la Santé`,
    city: ['Paris', 'Lyon', 'Bordeaux', 'Marseille', 'Lille'][i % 5]!,
    country: 'France',
    bedCapacity: 200 + (i % 10) * 50,
    buildingCount: 5 + (i % 8),
    equipmentCount: 300 + (i % 20) * 20,
    status: i % 30 === 0 ? ('maintenance' as const) : ('active' as const),
  })),
  ...CLINICS.map((c, i) => ({
    facilityId: c.id,
    name: c.name,
    code: `CLN-${String(i + 1).padStart(3, '0')}`,
    type: 'clinic' as const,
    campusId: c.parent,
    address: `${50 + i} Rue Clinique`,
    city: 'Paris',
    country: 'France',
    bedCapacity: 10 + (i % 20),
    buildingCount: 1 + (i % 3),
    equipmentCount: 20 + (i % 30),
    status: 'active' as const,
  })),
];

export const MOCK_BUILDINGS: Building[] = Array.from(
  { length: 350 },
  (_, i) => {
    const fac = HOSPITALS[i % 25]!;
    return {
      buildingId: `bld-${String(i + 1).padStart(4, '0')}`,
      name: `Building ${String.fromCharCode(65 + (i % 26))}${Math.floor(i / 26) || ''}`,
      code: `BLD-${String(i + 1).padStart(4, '0')}`,
      facilityId: fac.id,
      facilityName: fac.name,
      floors: 3 + (i % 12),
      yearBuilt: 1970 + (i % 50),
      status: i % 40 === 0 ? ('renovation' as const) : ('active' as const),
    };
  },
);

export const MOCK_FLOORS: Floor[] = Array.from({ length: 2000 }, (_, i) => {
  const bld = MOCK_BUILDINGS[i % MOCK_BUILDINGS.length]!;
  const level = (i % bld.floors) + 1;
  return {
    floorId: `flr-${String(i + 1).padStart(5, '0')}`,
    buildingId: bld.buildingId,
    buildingName: bld.name,
    facilityId: bld.facilityId,
    level,
    name: level === 0 ? 'Ground' : `Floor ${level}`,
    roomCount: 8 + (i % 20),
  };
});

export const MOCK_ROOMS: Room[] = Array.from({ length: 8000 }, (_, i) => {
  const flr = MOCK_FLOORS[i % MOCK_FLOORS.length]!;
  const types = [
    'patient',
    'operating',
    'icu',
    'isolation',
    'consultation',
    'utility',
    'storage',
    'office',
  ] as const;
  return {
    roomId: `rm-${String(i + 1).padStart(5, '0')}`,
    number: `${flr.level}${String((i % 50) + 1).padStart(2, '0')}`,
    name: `Room ${flr.level}${String((i % 50) + 1).padStart(2, '0')}`,
    floorId: flr.floorId,
    buildingId: flr.buildingId,
    facilityId: flr.facilityId,
    type: types[i % types.length]!,
    capacity: 1 + (i % 4),
    status: (['available', 'occupied', 'maintenance', 'cleaning'] as const)[
      i % 4
    ]!,
    departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
  };
});

export const MOCK_BEDS: Bed[] = Array.from({ length: 12000 }, (_, i) => {
  const room =
    MOCK_ROOMS.filter((r) => r.type === 'patient' || r.type === 'icu')[
      i % 4000
    ] ?? MOCK_ROOMS[i % MOCK_ROOMS.length]!;
  const wards = [
    'ICU',
    'General',
    'Maternity',
    'Pediatric',
    'Surgical',
    'Emergency',
  ];
  const statuses = [
    'available',
    'occupied',
    'reserved',
    'maintenance',
    'blocked',
  ] as const;
  return {
    bedId: `bed-${String(i + 1).padStart(5, '0')}`,
    label: `${room.number}-${String((i % 4) + 1).padStart(2, '0')}`,
    roomId: room.roomId,
    ward: wards[i % wards.length]!,
    facilityId: room.facilityId,
    status: statuses[i % statuses.length]!,
    patientId:
      i % 3 === 0 ? `phr-${String((i % 500) + 1).padStart(3, '0')}` : undefined,
  };
});

export const MOCK_EQUIPMENT: MedicalEquipment[] = Array.from(
  { length: 10000 },
  (_, i) => {
    const fac = HOSPITALS[i % 25]!;
    const bld = MOCK_BUILDINGS[i % MOCK_BUILDINGS.length]!;
    const room = MOCK_ROOMS[i % MOCK_ROOMS.length]!;
    const statuses = [
      'operational',
      'maintenance',
      'calibration_due',
      'out_of_service',
      'decommissioned',
    ] as const;
    const status = statuses[i % statuses.length]!;
    return {
      equipmentId: `eqp-${String(i + 1).padStart(5, '0')}`,
      assetTag: `AST-${String(i + 1).padStart(5, '0')}`,
      name: `${EQUIP_CATEGORIES[i % EQUIP_CATEGORIES.length]!} ${(i % 100) + 1}`,
      category: EQUIP_CATEGORIES[i % EQUIP_CATEGORIES.length]!,
      manufacturer: MANUFACTURERS[i % MANUFACTURERS.length]!,
      model: `Model-${1000 + (i % 500)}`,
      serialNumber: `SN-${String(100000 + i)}`,
      facilityId: fac.id,
      facilityName: fac.name,
      buildingId: bld.buildingId,
      roomId: room.roomId,
      departmentId: `dept-${String((i % 300) + 1).padStart(4, '0')}`,
      inventoryAssetId: `ast-${String((i % 1200) + 1).padStart(4, '0')}`,
      status,
      purchaseDate: daysAgo(365 * (1 + (i % 8))),
      warrantyExpiry: daysFromNow(30 + (i % 365)),
      lastMaintenance: daysAgo(i % 90),
      nextMaintenance: daysFromNow(10 + (i % 60)),
      utilizationPercent: 40 + (i % 55),
    };
  },
);

export const MOCK_BIOMEDICAL_DEVICES: BiomedicalDevice[] = MOCK_EQUIPMENT.slice(
  0,
  6000,
).map((eq, i) => ({
  ...eq,
  deviceClass: (['class_i', 'class_ii', 'class_iii'] as const)[i % 3]!,
  calibrationDue: daysFromNow(5 + (i % 90)),
  lastCalibration: daysAgo(i % 180),
  fhirDeviceId: `Device/${eq.equipmentId}`,
}));

export const MOCK_WORK_ORDERS: WorkOrder[] = Array.from(
  { length: 15000 },
  (_, i) => {
    const fac = HOSPITALS[i % 25]!;
    const eq = MOCK_EQUIPMENT[i % MOCK_EQUIPMENT.length]!;
    const statuses = [
      'draft',
      'open',
      'assigned',
      'in_progress',
      'on_hold',
      'completed',
      'cancelled',
    ] as const;
    const priorities = [
      'low',
      'medium',
      'high',
      'critical',
      'emergency',
    ] as const;
    const types = [
      'preventive',
      'corrective',
      'predictive',
      'emergency',
    ] as const;
    const status = statuses[i % statuses.length]!;
    const slaHours = [4, 8, 24, 48, 72][i % 5]!;
    const created = daysAgo(i % 30);
    return {
      workOrderId: `wo-${String(i + 1).padStart(5, '0')}`,
      requestId:
        i % 3 === 0 ? `mr-${String(i + 1).padStart(5, '0')}` : undefined,
      title: `${types[i % types.length]!.replace('_', ' ')} — ${eq.name}`,
      description: `Maintenance work order for ${eq.name} at ${fac.name}`,
      facilityId: fac.id,
      facilityName: fac.name,
      equipmentId: eq.equipmentId,
      equipmentName: eq.name,
      type: types[i % types.length]!,
      priority: priorities[i % priorities.length]!,
      status,
      assignedTechnicianId:
        status !== 'open' && status !== 'draft'
          ? `emp-${String((i % 500) + 1).padStart(5, '0')}`
          : undefined,
      assignedTechnicianName:
        status !== 'open' && status !== 'draft'
          ? `Technician ${(i % 50) + 1}`
          : undefined,
      scheduledDate: daysFromNow(i % 14),
      completedDate: status === 'completed' ? daysAgo(i % 7) : undefined,
      slaHours,
      slaBreached: i % 17 === 0,
      downtimeHours: status === 'completed' ? 1 + (i % 12) : undefined,
      createdAt: created,
      updatedAt: daysAgo(i % 5),
    };
  },
);

export const MOCK_PREVENTIVE: PreventiveMaintenance[] = Array.from(
  { length: 6000 },
  (_, i) => {
    const eq = MOCK_EQUIPMENT[i % MOCK_EQUIPMENT.length]!;
    const dueDays = (i % 90) - 15;
    return {
      scheduleId: `pm-${String(i + 1).padStart(5, '0')}`,
      equipmentId: eq.equipmentId,
      equipmentName: eq.name,
      facilityId: eq.facilityId,
      frequencyDays: [30, 60, 90, 180, 365][i % 5]!,
      lastPerformed: daysAgo(30 + (i % 60)),
      nextDue: daysFromNow(dueDays),
      status:
        dueDays < 0
          ? ('overdue' as const)
          : dueDays <= 7
            ? ('due' as const)
            : ('compliant' as const),
      assignedTeamId: `team-${String((i % 700) + 1).padStart(4, '0')}`,
    };
  },
);

export const MOCK_CALIBRATION: CalibrationRecord[] = Array.from(
  { length: 4000 },
  (_, i) => {
    const dev = MOCK_BIOMEDICAL_DEVICES[i % MOCK_BIOMEDICAL_DEVICES.length]!;
    const dueDays = (i % 60) - 10;
    const statuses = ['valid', 'due', 'overdue', 'failed', 'pending'] as const;
    return {
      calibrationId: `cal-${String(i + 1).padStart(5, '0')}`,
      equipmentId: dev.equipmentId,
      equipmentName: dev.name,
      facilityId: dev.facilityId,
      performedDate: daysAgo(30 + (i % 180)),
      nextDue: daysFromNow(dueDays),
      status:
        dueDays < 0
          ? ('overdue' as const)
          : dueDays <= 14
            ? ('due' as const)
            : statuses[i % statuses.length]!,
      technicianId: `emp-${String((i % 200) + 1).padStart(5, '0')}`,
      certificateNumber: `CAL-CERT-${String(10000 + i)}`,
    };
  },
);

export const MOCK_INSPECTIONS: Inspection[] = Array.from(
  { length: 2000 },
  (_, i) => {
    const fac = HOSPITALS[i % 25]!;
    const bld = MOCK_BUILDINGS[i % MOCK_BUILDINGS.length]!;
    const types = [
      'safety',
      'fire',
      'electrical',
      'hygiene',
      'regulatory',
    ] as const;
    const statuses = [
      'scheduled',
      'in_progress',
      'passed',
      'failed',
      'overdue',
    ] as const;
    return {
      inspectionId: `insp-${String(i + 1).padStart(5, '0')}`,
      title: `${types[i % types.length]!} Inspection — ${bld.name}`,
      facilityId: fac.id,
      buildingId: bld.buildingId,
      type: types[i % types.length]!,
      scheduledDate: daysFromNow(i % 30),
      completedDate: i % 3 === 0 ? daysAgo(i % 14) : undefined,
      status: statuses[i % statuses.length]!,
      inspectorId: `emp-${String((i % 100) + 1).padStart(5, '0')}`,
    };
  },
);

export const MOCK_VENDORS: Vendor[] = Array.from({ length: 800 }, (_, i) => ({
  vendorId: `vnd-${String(i + 1).padStart(4, '0')}`,
  name: `Vendor ${['MedTech', 'BioService', 'FacilityPro', 'EngineerCo'][i % 4]!} ${i + 1}`,
  contactEmail: `vendor${i + 1}@example.com`,
  contactPhone: `+33 1 ${String(20000000 + i).slice(0, 8)}`,
  category: [
    'Biomedical',
    'HVAC',
    'Electrical',
    'General Maintenance',
    'Calibration',
  ][i % 5]!,
  rating: 3 + (i % 20) / 10,
  contractCount: 1 + (i % 10),
  status: i % 50 === 0 ? ('inactive' as const) : ('active' as const),
}));

export const MOCK_CONTRACTS: ServiceContract[] = Array.from(
  { length: 500 },
  (_, i) => {
    const vnd = MOCK_VENDORS[i % MOCK_VENDORS.length]!;
    const fac = HOSPITALS[i % 25]!;
    const endDays = 30 + (i % 365);
    return {
      contractId: `ctr-${String(i + 1).padStart(4, '0')}`,
      vendorId: vnd.vendorId,
      vendorName: vnd.name,
      title: `${vnd.category} Service Contract — ${fac.name}`,
      facilityId: fac.id,
      startDate: daysAgo(365),
      endDate: daysFromNow(endDays),
      value: 10000 + (i % 100) * 5000,
      status: endDays <= 30 ? ('expiring' as const) : ('active' as const),
      coverageType: vnd.category,
    };
  },
);

export const MOCK_UTILITIES: UtilitySystem[] = Array.from(
  { length: 200 },
  (_, i) => {
    const fac = HOSPITALS[i % 25]!;
    const type = UTILITY_TYPES[i % UTILITY_TYPES.length]!;
    const statuses = ['normal', 'warning', 'critical', 'offline'] as const;
    return {
      utilityId: `utl-${String(i + 1).padStart(4, '0')}`,
      name: `${type.replace('_', ' ').toUpperCase()} System`,
      type,
      facilityId: fac.id,
      facilityName: fac.name,
      status: statuses[i % statuses.length]!,
      lastReading: 50 + (i % 100),
      unit: type === 'hvac' ? '°C' : type === 'water' ? 'L/min' : 'kW',
      threshold: 80 + (i % 20),
    };
  },
);

export const MOCK_IOT_SENSORS: IoTSensor[] = Array.from(
  { length: 1500 },
  (_, i) => {
    const room = MOCK_ROOMS[i % MOCK_ROOMS.length]!;
    return {
      sensorId: `sns-${String(i + 1).padStart(5, '0')}`,
      name: `Sensor ${i + 1}`,
      type: ['temperature', 'humidity', 'pressure', 'motion', 'air_quality'][
        i % 5
      ]!,
      facilityId: room.facilityId,
      buildingId: room.buildingId,
      roomId: room.roomId,
      status: (['online', 'offline', 'maintenance'] as const)[i % 3]!,
      lastReading: daysAgo(i % 24),
    };
  },
);

export const MOCK_ENVIRONMENTAL: EnvironmentalReading[] = Array.from(
  { length: 5000 },
  (_, i) => {
    const sns = MOCK_IOT_SENSORS[i % MOCK_IOT_SENSORS.length]!;
    const metrics = [
      'temperature',
      'humidity',
      'pressure',
      'co2',
      'air_quality',
    ] as const;
    const metric = metrics[i % metrics.length]!;
    const value =
      metric === 'temperature'
        ? 18 + (i % 10)
        : metric === 'humidity'
          ? 40 + (i % 30)
          : 50 + (i % 50);
    return {
      readingId: `rdg-${String(i + 1).padStart(5, '0')}`,
      sensorId: sns.sensorId,
      facilityId: sns.facilityId,
      location: sns.roomId ?? sns.buildingId ?? sns.facilityId,
      metric,
      value,
      unit:
        metric === 'temperature'
          ? '°C'
          : metric === 'humidity'
            ? '%'
            : metric === 'pressure'
              ? 'Pa'
              : 'ppm',
      timestamp: daysAgo(i % 48),
      status:
        value > 90
          ? ('critical' as const)
          : value > 75
            ? ('warning' as const)
            : ('normal' as const),
    };
  },
);

export const MOCK_INCIDENTS: Incident[] = Array.from(
  { length: 3000 },
  (_, i) => {
    const fac = HOSPITALS[i % 25]!;
    const severities = ['low', 'medium', 'high', 'critical'] as const;
    const statuses = ['open', 'investigating', 'resolved', 'closed'] as const;
    return {
      incidentId: `inc-${String(i + 1).padStart(5, '0')}`,
      title: `Incident ${i + 1} — ${['Power outage', 'Water leak', 'Equipment failure', 'Fire alarm', 'Gas leak'][i % 5]!}`,
      description: `Reported incident at ${fac.name}`,
      facilityId: fac.id,
      severity: severities[i % severities.length]!,
      status: statuses[i % statuses.length]!,
      reportedBy: `emp-${String((i % 500) + 1).padStart(5, '0')}`,
      reportedAt: daysAgo(i % 60),
      resolvedAt: i % 3 === 0 ? daysAgo(i % 10) : undefined,
    };
  },
);

export const MOCK_VEHICLES: Vehicle[] = Array.from({ length: 500 }, (_, i) => {
  const fac = HOSPITALS[i % 25]!;
  const types = ['ambulance', 'van', 'car', 'utility'] as const;
  const statuses = ['available', 'in_use', 'maintenance', 'retired'] as const;
  return {
    vehicleId: `veh-${String(i + 1).padStart(4, '0')}`,
    registration: `FR-${String(1000 + i)}-AB`,
    make: ['Mercedes', 'Ford', 'Renault', 'Toyota'][i % 4]!,
    model: `Model ${(i % 20) + 1}`,
    facilityId: fac.id,
    type: types[i % types.length]!,
    status: statuses[i % statuses.length]!,
    mileage: 10000 + i * 500,
  };
});

export function buildFacilitiesDashboard(
  facilityId?: string,
): FacilitiesDashboard {
  const buildings = facilityId
    ? MOCK_BUILDINGS.filter((b) => b.facilityId === facilityId)
    : MOCK_BUILDINGS;
  const rooms = facilityId
    ? MOCK_ROOMS.filter((r) => r.facilityId === facilityId)
    : MOCK_ROOMS;
  const beds = facilityId
    ? MOCK_BEDS.filter((b) => b.facilityId === facilityId)
    : MOCK_BEDS;
  const equipment = facilityId
    ? MOCK_EQUIPMENT.filter((e) => e.facilityId === facilityId)
    : MOCK_EQUIPMENT;
  const workOrders = facilityId
    ? MOCK_WORK_ORDERS.filter((w) => w.facilityId === facilityId)
    : MOCK_WORK_ORDERS;
  const pm = facilityId
    ? MOCK_PREVENTIVE.filter((p) => p.facilityId === facilityId)
    : MOCK_PREVENTIVE;
  const cal = facilityId
    ? MOCK_CALIBRATION.filter((c) => c.facilityId === facilityId)
    : MOCK_CALIBRATION;
  const utilities = facilityId
    ? MOCK_UTILITIES.filter((u) => u.facilityId === facilityId)
    : MOCK_UTILITIES;

  return {
    facilityId,
    totalBuildings: buildings.length,
    totalRooms: rooms.length,
    totalBeds: beds.length,
    availableBeds: beds.filter((b) => b.status === 'available').length,
    totalEquipment: equipment.length,
    operationalEquipment: equipment.filter((e) => e.status === 'operational')
      .length,
    openWorkOrders: workOrders.filter(
      (w) => !['completed', 'cancelled'].includes(w.status),
    ).length,
    overdueMaintenance: pm.filter((p) => p.status === 'overdue').length,
    calibrationDue: cal.filter(
      (c) => c.status === 'due' || c.status === 'overdue',
    ).length,
    utilityAlerts: utilities.filter((u) => u.status !== 'normal').length,
    recentWorkOrders: workOrders
      .filter((w) => w.status !== 'completed')
      .slice(0, 8),
    utilitySystems: utilities.slice(0, 6),
  };
}
