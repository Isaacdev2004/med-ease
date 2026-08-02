#!/usr/bin/env node
/**
 * Production demo smoke test — auth, patients, appointments against live API.
 * Usage: node scripts/ci/smoke-production-demo.mjs
 */
const API = process.env.SMOKE_API_URL ?? 'https://medease-api.onrender.com/api';
const SARAH_ID = '01930000-0000-7000-8000-000000000301';

async function req(path, opts = {}) {
  const response = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
    signal: AbortSignal.timeout(45_000),
  });
  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { status: response.status, json, text };
}

function assert(name, ok, detail) {
  if (ok) {
    console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`);
    return;
  }
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  throw new Error(name);
}

async function main() {
  console.log(`\nProduction demo smoke test\nAPI: ${API}\n`);

  const health = await req('/healthz');
  assert('API health', health.status === 200 && health.json?.status === 'ok');

  const login = await req('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: process.env.SMOKE_DEMO_EMAIL ?? 'admin@medease.health',
      password: process.env.SMOKE_DEMO_PASSWORD ?? 'demo',
    }),
  });
  const token = login.json?.session?.accessToken;
  assert('Admin login', Boolean(token), login.json?.user?.email);
  const auth = { Authorization: `Bearer ${token}` };

  const patients = await req('/patients?page=1&pageSize=100', { headers: auth });
  assert(
    'Patients list',
    patients.status === 200 && patients.json.total >= 8,
    `${patients.json?.total ?? 0} patients`,
  );

  const sarah = patients.json.items.find((p) => p.patientId === SARAH_ID);
  assert('Sarah Jenkins', Boolean(sarah), sarah?.mrn);

  const allergies = await req(`/patients/${SARAH_ID}/allergies`, { headers: auth });
  const hasPenicillin = (allergies.json ?? []).some((a) =>
    /penicillin/i.test(a.allergen ?? ''),
  );
  assert('Sarah penicillin allergy', allergies.status === 200 && hasPenicillin);

  const appointments = await req('/appointments?page=1&pageSize=100', {
    headers: auth,
  });
  assert(
    'Appointments list',
    appointments.status === 200 && appointments.json.total >= 12,
    `${appointments.json?.total ?? 0} appointments`,
  );

  const today = new Date().toISOString().slice(0, 10);
  const todayEndpoint = await req('/appointments/today', { headers: auth });
  assert(
    'Today appointments',
    todayEndpoint.status === 200 && todayEndpoint.json.length >= 4,
    `${todayEndpoint.json?.length ?? 0} on ${today}`,
  );

  const sarahAppointments = (appointments.json.items ?? []).filter(
    (a) => a.patient?.id === SARAH_ID,
  );
  assert('Sarah appointments', sarahAppointments.length > 0, `${sarahAppointments.length} in page`);

  console.log('\nAll production demo smoke checks passed.\n');
}

main().catch((error) => {
  console.error(`\nSmoke test failed: ${error.message}\n`);
  process.exit(1);
});
