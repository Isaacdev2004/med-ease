import { Injectable } from '@nestjs/common';

import type {
  ApproveResultInput,
  CancelLabOrderInput,
  CollectSpecimenInput,
  CreateLabOrderInput,
  LabOrderFilters,
  LabResultFilters,
  ReleaseResultInput,
  UploadResultInput,
  VerifyResultInput,
} from '@medease/laboratory-contract';

import { LaboratoryRepository } from './laboratory.repository';

@Injectable()
export class LaboratoryService {
  constructor(private readonly repository: LaboratoryRepository) {}

  searchOrders(filters?: LabOrderFilters) {
    return this.repository.searchOrders(filters);
  }

  getAllOrders(filters?: LabOrderFilters) {
    return this.repository.getAllOrders(filters);
  }

  getOrder(id: string) {
    return this.repository.getOrder(id);
  }

  createOrder(input: CreateLabOrderInput) {
    return this.repository.createOrder(input);
  }

  cancelOrder(input: CancelLabOrderInput) {
    return this.repository.cancelOrder(input);
  }

  collectSpecimen(input: CollectSpecimenInput) {
    return this.repository.collectSpecimen(input);
  }

  searchResults(filters?: LabResultFilters) {
    return this.repository.searchResults(filters);
  }

  getAllResults(filters?: LabResultFilters) {
    return this.repository.getAllResults(filters);
  }

  getResult(id: string) {
    return this.repository.getResult(id);
  }

  getPendingResults(patientId?: string) {
    return this.repository.getPendingResults(patientId);
  }

  uploadResult(input: UploadResultInput) {
    return this.repository.uploadResult(input);
  }

  verifyResult(input: VerifyResultInput) {
    return this.repository.verifyResult(input);
  }

  approveResult(input: ApproveResultInput) {
    return this.repository.approveResult(input);
  }

  releaseResult(input: ReleaseResultInput) {
    return this.repository.releaseResult(input);
  }

  getSpecimens(orderId?: string, patientId?: string) {
    return this.repository.getSpecimens(orderId, patientId);
  }

  getCatalog() {
    return this.repository.getCatalog();
  }
}
