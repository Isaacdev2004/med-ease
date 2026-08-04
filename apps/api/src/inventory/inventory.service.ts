import { Injectable } from '@nestjs/common';

import type {
  AdjustStockInput,
  CreateInventoryInput,
  CreatePurchaseOrderInput,
  InventoryDepartment,
  InventoryFilters,
  IssueStockInput,
  ReceiveStockInput,
  UpdateInventoryInput,
} from '@medease/inventory-contract';

import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly repository: InventoryRepository) {}

  searchItems(filters?: InventoryFilters) {
    return this.repository.searchItems(filters);
  }

  getItem(inventoryId: string) {
    return this.repository.getItem(inventoryId);
  }

  createItem(input: CreateInventoryInput) {
    return this.repository.createItem(input);
  }

  updateItem(input: UpdateInventoryInput) {
    return this.repository.updateItem(input);
  }

  receiveStock(input: ReceiveStockInput) {
    return this.repository.receiveStock(input);
  }

  issueStock(input: IssueStockInput) {
    return this.repository.issueStock(input);
  }

  adjustStock(input: AdjustStockInput) {
    return this.repository.adjustStock(input);
  }

  getMovements(inventoryId?: string, filters?: InventoryFilters) {
    return this.repository.getMovements(inventoryId, filters);
  }

  getWarehouses(facilityId?: string) {
    return this.repository.getWarehouses(facilityId);
  }

  getDashboard(
    facilityId?: string,
    warehouseId?: string,
    department?: InventoryDepartment,
  ) {
    return this.repository.getDashboard(facilityId, warehouseId, department);
  }

  getSuppliers() {
    return this.repository.getSuppliers();
  }

  getPurchaseOrders(filters?: InventoryFilters) {
    return this.repository.getPurchaseOrders(filters);
  }

  createPurchaseOrder(input: CreatePurchaseOrderInput) {
    return this.repository.createPurchaseOrder(input);
  }

  approvePurchaseOrder(purchaseOrderId: string) {
    return this.repository.approvePurchaseOrder(purchaseOrderId);
  }

  receivePurchaseOrder(purchaseOrderId: string) {
    return this.repository.receivePurchaseOrder(purchaseOrderId);
  }
}
