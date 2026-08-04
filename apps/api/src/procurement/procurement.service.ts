import { Injectable } from '@nestjs/common';
import type {
  CreateRfqInput,
  ProcurementFilters,
  ReceiveGoodsInput,
} from '@medease/procurement-contract';
import { ProcurementRepository } from './procurement.repository';

@Injectable()
export class ProcurementService {
  constructor(private readonly repository: ProcurementRepository) {}
  searchRfqs(filters?: ProcurementFilters) {
    return this.repository.searchRfqs(filters);
  }
  createRfq(input: CreateRfqInput) {
    return this.repository.createRfq(input);
  }
  awardRfq(rfqId: string, responseId: string) {
    return this.repository.awardRfq(rfqId, responseId);
  }
  searchGoodsReceipts(filters?: ProcurementFilters) {
    return this.repository.searchGoodsReceipts(filters);
  }
  createGoodsReceipt(input: ReceiveGoodsInput) {
    return this.repository.createGoodsReceipt(input);
  }
}
