import type { SeedModule } from '../types';

const DEMO_TENANT_ID = '01930000-0000-7000-8000-000000000001';
const DEMO_ADMIN_ID = '01930000-0000-7000-8000-000000000101';
const DEMO_PHYSICIAN_ID = '01930000-0000-7000-8000-000000000103';
const DEMO_PATIENT_ID = '01930000-0000-7000-8000-000000000301';
const DEMO_FACILITY_PARIS = '01930000-0000-7000-8000-000000000201';

const POLICY_ID = '01930000-0000-7000-8000-000000001301';
const INVOICE_PAID = '01930000-0000-7000-8000-000000001311';
const INVOICE_OPEN = '01930000-0000-7000-8000-000000001312';
const LINE_PAID_1 = '01930000-0000-7000-8000-000000001321';
const LINE_PAID_2 = '01930000-0000-7000-8000-000000001322';
const LINE_OPEN_1 = '01930000-0000-7000-8000-000000001323';
const LINE_OPEN_2 = '01930000-0000-7000-8000-000000001324';
const PAYMENT_ID = '01930000-0000-7000-8000-000000001331';
const RECEIPT_ID = '01930000-0000-7000-8000-000000001341';
const CLAIM_ID = '01930000-0000-7000-8000-000000001351';

export const billingSeed: SeedModule = {
  name: 'billing',
  async run(ctx) {
    if (ctx.dryRun) return;

    const { PrismaClient, runInSystemTransaction } =
      await import('@medease/prisma');
    type TransactionClient = Parameters<
      Parameters<typeof runInSystemTransaction>[1]
    >[0];
    const prisma = new PrismaClient();
    const now = new Date();
    const issuedPaid = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const duePaid = new Date(issuedPaid.getTime() + 30 * 24 * 60 * 60 * 1000);
    const issuedOpen = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const dueOpen = new Date(issuedOpen.getTime() + 30 * 24 * 60 * 60 * 1000);
    const coverageStart = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    const coverageEnd = new Date(now.getTime() + 185 * 24 * 60 * 60 * 1000);

    try {
      await runInSystemTransaction(prisma, async (tx: TransactionClient) => {
        await tx.insurancePolicy.upsert({
          where: { id: POLICY_ID },
          create: {
            id: POLICY_ID,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            payer: 'AXA Santé',
            policyNumber: 'AXA-SJ-88421',
            groupNumber: 'GRP-PARIS-01',
            planType: 'Complementaire Sante',
            coverageStart,
            coverageEnd,
            deductibleCents: 15000n,
            copayCents: 2500n,
            coinsurancePercent: 20,
            status: 'active',
            eligibilityVerified: true,
            lastVerifiedAt: now,
          },
          update: {
            status: 'active',
            eligibilityVerified: true,
            lastVerifiedAt: now,
            coverageEnd,
          },
        });

        await tx.patientInvoice.upsert({
          where: { id: INVOICE_PAID },
          create: {
            id: INVOICE_PAID,
            tenantId: DEMO_TENANT_ID,
            invoiceNumber: 'INV-2026-SJ-001',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            providerId: DEMO_PHYSICIAN_ID,
            providerName: 'Dr. Emily Chen',
            insurancePolicyId: POLICY_ID,
            status: 'paid',
            currencyCode: 'EUR',
            subtotalCents: 18500n,
            discountCents: 0n,
            taxCents: 0n,
            totalCents: 18500n,
            paidCents: 18500n,
            balanceCents: 0n,
            paymentMethod: 'card',
            notes: 'Cardiology follow-up + labs',
            issuedAt: issuedPaid,
            dueAt: duePaid,
            createdBy: DEMO_ADMIN_ID,
            lineItems: {
              create: [
                {
                  id: LINE_PAID_1,
                  tenantId: DEMO_TENANT_ID,
                  category: 'consultation',
                  description: 'Cardiology consultation',
                  code: 'CONS-CARD',
                  quantity: 1,
                  unitPriceCents: 12000n,
                  amountCents: 12000n,
                  sortOrder: 0,
                },
                {
                  id: LINE_PAID_2,
                  tenantId: DEMO_TENANT_ID,
                  category: 'laboratory',
                  description: 'Comprehensive metabolic panel',
                  code: 'LAB-CMP',
                  quantity: 1,
                  unitPriceCents: 6500n,
                  amountCents: 6500n,
                  sortOrder: 1,
                },
              ],
            },
          },
          update: {
            status: 'paid',
            paidCents: 18500n,
            balanceCents: 0n,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.patientInvoice.upsert({
          where: { id: INVOICE_OPEN },
          create: {
            id: INVOICE_OPEN,
            tenantId: DEMO_TENANT_ID,
            invoiceNumber: 'INV-2026-SJ-002',
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            facilityId: DEMO_FACILITY_PARIS,
            facilityName: 'Pitié-Salpêtrière',
            providerId: DEMO_PHYSICIAN_ID,
            providerName: 'Dr. Emily Chen',
            insurancePolicyId: POLICY_ID,
            status: 'issued',
            currencyCode: 'EUR',
            subtotalCents: 24000n,
            discountCents: 0n,
            taxCents: 0n,
            totalCents: 24000n,
            paidCents: 0n,
            balanceCents: 24000n,
            notes: 'Telemedicine visit + radiology',
            issuedAt: issuedOpen,
            dueAt: dueOpen,
            createdBy: DEMO_ADMIN_ID,
            lineItems: {
              create: [
                {
                  id: LINE_OPEN_1,
                  tenantId: DEMO_TENANT_ID,
                  category: 'telemedicine',
                  description: 'Telemedicine follow-up',
                  code: 'TM-FU',
                  quantity: 1,
                  unitPriceCents: 9000n,
                  amountCents: 9000n,
                  sortOrder: 0,
                },
                {
                  id: LINE_OPEN_2,
                  tenantId: DEMO_TENANT_ID,
                  category: 'radiology',
                  description: 'Chest X-Ray',
                  code: 'RAD-CXR',
                  quantity: 1,
                  unitPriceCents: 15000n,
                  amountCents: 15000n,
                  sortOrder: 1,
                },
              ],
            },
          },
          update: {
            status: 'issued',
            balanceCents: 24000n,
            paidCents: 0n,
            updatedBy: DEMO_ADMIN_ID,
          },
        });

        await tx.payment.upsert({
          where: { id: PAYMENT_ID },
          create: {
            id: PAYMENT_ID,
            tenantId: DEMO_TENANT_ID,
            invoiceId: INVOICE_PAID,
            patientId: DEMO_PATIENT_ID,
            facilityId: DEMO_FACILITY_PARIS,
            providerId: DEMO_PHYSICIAN_ID,
            amountCents: 18500n,
            currencyCode: 'EUR',
            method: 'card',
            status: 'completed',
            reference: 'PAY-SJ001',
            paidAt: new Date(issuedPaid.getTime() + 2 * 24 * 60 * 60 * 1000),
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'completed',
            amountCents: 18500n,
          },
        });

        await tx.receipt.upsert({
          where: { id: RECEIPT_ID },
          create: {
            id: RECEIPT_ID,
            tenantId: DEMO_TENANT_ID,
            paymentId: PAYMENT_ID,
            invoiceId: INVOICE_PAID,
            patientId: DEMO_PATIENT_ID,
            receiptNumber: 'RCP-SJ001',
            amountCents: 18500n,
            currencyCode: 'EUR',
            paymentMethod: 'card',
            issuedAt: new Date(issuedPaid.getTime() + 2 * 24 * 60 * 60 * 1000),
            downloadUrl: '/api/billing/receipts/PAY-SJ001/download',
          },
          update: {
            amountCents: 18500n,
          },
        });

        await tx.insuranceClaim.upsert({
          where: { id: CLAIM_ID },
          create: {
            id: CLAIM_ID,
            tenantId: DEMO_TENANT_ID,
            patientId: DEMO_PATIENT_ID,
            patientName: 'Sarah Jenkins',
            invoiceId: INVOICE_OPEN,
            insurancePolicyId: POLICY_ID,
            facilityId: DEMO_FACILITY_PARIS,
            providerId: DEMO_PHYSICIAN_ID,
            payer: 'AXA Santé',
            policyNumber: 'AXA-SJ-88421',
            diagnosisCodes: ['E11.9', 'I10'],
            procedureCodes: ['99213', '71046'],
            medications: [],
            laboratoryOrders: [],
            radiologyOrders: ['Chest X-Ray'],
            totalClaimCents: 24000n,
            approvedCents: 0n,
            deniedCents: 0n,
            deductibleCents: 15000n,
            copayCents: 2500n,
            coinsuranceCents: 0n,
            currencyCode: 'EUR',
            status: 'submitted',
            submissionDate: issuedOpen,
            createdBy: DEMO_ADMIN_ID,
          },
          update: {
            status: 'submitted',
            totalClaimCents: 24000n,
            updatedBy: DEMO_ADMIN_ID,
          },
        });
      });

      console.log(
        JSON.stringify({
          level: 'info',
          msg: 'Billing seed complete',
          patientId: DEMO_PATIENT_ID,
          invoices: [INVOICE_PAID, INVOICE_OPEN],
        }),
      );
    } finally {
      await prisma.$disconnect();
    }
  },
};
