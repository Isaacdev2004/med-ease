import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { PatientsRepositoryContract } from '@medease/patients-contract';
import {
  expectPagination,
  expectRejectsWithErrorName,
  expectSearchMatch,
  type RepositoryContractCapabilities,
} from '@medease/repository-contract-test';
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from '@workspace/repository-transport';

import { patientsContractFixtures } from './fixtures/patients.fixtures';

export interface PatientsRepositoryContractContext {
  name: string;
  repository: PatientsRepositoryContract;
  fixtures?: typeof patientsContractFixtures;
  capabilities?: RepositoryContractCapabilities;
}

export function patientsRepositoryContract(
  ctx: PatientsRepositoryContractContext,
): void {
  const fixtures = ctx.fixtures ?? patientsContractFixtures;
  const capabilities = ctx.capabilities ?? {
    mutations: true,
    search: true,
    export: true,
  };

  describe(`${ctx.name} Patients repository contract`, () => {
    it('returns paginated patients', async () => {
      const result = await ctx.repository.listPatients({
        page: fixtures.page,
        pageSize: fixtures.pageSize,
      });

      expectPagination(result, {
        page: fixtures.page,
        pageSize: fixtures.pageSize,
      });
      assert.ok(result.items.length > 0);
      assert.ok(result.items[0]?.patientId);
      assert.ok(result.items[0]?.mrn);
      assert.ok(result.items[0]?.fullName);
    });

    it('filters patients by status', async () => {
      const result = await ctx.repository.listPatients({
        status: 'active',
        page: 1,
        pageSize: 25,
      });

      assert.ok(result.items.every((patient) => patient.status === 'active'));
    });

    it('supports search', async () => {
      if (!capabilities.search) return;

      const result = await ctx.repository.searchPatients({
        q: fixtures.searchQuery,
        page: 1,
        pageSize: 25,
      });

      expectPagination(result, { page: 1, pageSize: 25 });
      assert.ok(result.items.length > 0);
      assert.ok(
        result.items.every((patient) =>
          expectSearchMatch(patient.fullName, fixtures.searchQuery, [
            patient.fullName,
            patient.mrn,
          ]),
        ),
      );
    });

    it('rejects empty search queries', async () => {
      if (!capabilities.search) return;

      await expectRejectsWithErrorName(
        ctx.repository.searchPatients({ q: '   ', page: 1, pageSize: 10 }),
        ValidationError.name,
      );
    });

    it('gets an existing patient by id', async () => {
      const patient = await ctx.repository.getPatient(
        fixtures.existingPatientId,
      );
      assert.equal(patient.patientId, fixtures.existingPatientId);
      assert.equal(patient.mrn, fixtures.existingMrn);
      assert.ok(patient.fullName);
    });

    it('throws NotFoundError for missing patients', async () => {
      await expectRejectsWithErrorName(
        ctx.repository.getPatient(fixtures.missingPatientId),
        NotFoundError.name,
      );
    });

    it('lists patient child entities', async () => {
      const [identifiers, contacts, addresses, emergencyContacts, allergies] =
        await Promise.all([
          ctx.repository.getIdentifiers(fixtures.existingPatientId),
          ctx.repository.getContacts(fixtures.existingPatientId),
          ctx.repository.getAddresses(fixtures.existingPatientId),
          ctx.repository.getEmergencyContacts(fixtures.existingPatientId),
          ctx.repository.getAllergies(fixtures.existingPatientId),
        ]);

      for (const collection of [
        identifiers,
        contacts,
        addresses,
        emergencyContacts,
        allergies,
      ]) {
        assert.ok(Array.isArray(collection));
        if (collection.length > 0) {
          assert.ok(collection[0]?.patientId);
        }
      }

      const preferences = await ctx.repository.getPreferences(
        fixtures.existingPatientId,
      );
      assert.ok(
        preferences === null || typeof preferences.preferenceId === 'string',
      );
    });

    if (capabilities.export) {
      it('exports patients', async () => {
        const result = await ctx.repository.exportPatients({ format: 'csv' });
        assert.equal(result.format, 'csv');
        assert.ok(result.exportedAt);
        assert.ok(typeof result.recordCount === 'number');
      });
    }

    if (capabilities.mutations) {
      it('throws ConflictError for duplicate MRN registration', async () => {
        await expectRejectsWithErrorName(
          ctx.repository.createPatient({
            mrn: fixtures.existingMrn,
            fullName: 'Duplicate MRN Contract Test',
            dateOfBirth: '1990-01-01',
            createdBy: fixtures.actorId,
          }),
          ConflictError.name,
        );
      });

      it('creates, updates, archives, and restores a patient', async () => {
        const mrn = `MRN-CT-${Date.now()}`;
        const created = await ctx.repository.createPatient({
          mrn,
          fullName: 'Contract Test Patient',
          dateOfBirth: '1990-06-15',
          gender: 'other',
          status: 'active',
          createdBy: fixtures.actorId,
        });

        assert.ok(created.patientId);
        assert.equal(created.mrn, mrn);

        const updated = await ctx.repository.updatePatient(created.patientId, {
          fullName: 'Contract Test Patient Updated',
          updatedBy: fixtures.actorId,
        });
        assert.equal(updated.fullName, 'Contract Test Patient Updated');

        const archived = await ctx.repository.archivePatient(
          created.patientId,
          fixtures.actorId,
        );
        assert.ok(archived.deletedAt);

        await expectRejectsWithErrorName(
          ctx.repository.archivePatient(created.patientId, fixtures.actorId),
          ValidationError.name,
        );

        const restored = await ctx.repository.restorePatient(
          created.patientId,
          fixtures.actorId,
        );
        assert.equal(restored.deletedAt, undefined);
        assert.equal(restored.status, 'active');
      });
    }
  });
}
