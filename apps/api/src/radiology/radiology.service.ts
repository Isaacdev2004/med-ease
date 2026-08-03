import { Injectable } from '@nestjs/common';

import type {
  ApproveReportInput,
  CancelRadiologyOrderInput,
  CompleteAcquisitionInput,
  CompleteInterpretationInput,
  CreateRadiologyOrderInput,
  ReportFilters,
  StudyFilters,
} from '@medease/radiology-contract';

import { RadiologyRepository } from './radiology.repository';

@Injectable()
export class RadiologyService {
  constructor(private readonly repository: RadiologyRepository) {}

  searchStudies(filters?: StudyFilters) {
    return this.repository.searchStudies(filters);
  }

  getAllStudies(filters?: StudyFilters) {
    return this.repository.getAllStudies(filters);
  }

  getStudy(id: string) {
    return this.repository.getStudy(id);
  }

  createOrder(input: CreateRadiologyOrderInput) {
    return this.repository.createOrder(input);
  }

  cancelOrder(input: CancelRadiologyOrderInput) {
    return this.repository.cancelOrder(input);
  }

  completeAcquisition(input: CompleteAcquisitionInput) {
    return this.repository.completeAcquisition(input);
  }

  searchReports(filters?: ReportFilters) {
    return this.repository.searchReports(filters);
  }

  getAllReports(filters?: ReportFilters) {
    return this.repository.getAllReports(filters);
  }

  getReport(id: string) {
    return this.repository.getReport(id);
  }

  getReportByStudy(studyId: string) {
    return this.repository.getReportByStudy(studyId);
  }

  getPendingReports(patientId?: string) {
    return this.repository.getPendingReports(patientId);
  }

  getCriticalReports(patientId?: string) {
    return this.repository.getCriticalReports(patientId);
  }

  completeInterpretation(input: CompleteInterpretationInput) {
    return this.repository.completeInterpretation(input);
  }

  approveReport(input: ApproveReportInput) {
    return this.repository.approveReport(input);
  }

  archiveStudy(id: string) {
    return this.repository.archiveStudy(id);
  }

  getDevices(facilityId?: string) {
    return this.repository.getDevices(facilityId);
  }

  getRadiologists() {
    return this.repository.getRadiologists();
  }
}
