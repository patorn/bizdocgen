<template>
  <section v-if="payments.length" class="payment-records" data-testid="payment-records">
    <h3 class="payment-records__title">รายการชำระเงิน</h3>

    <div class="payment-records__list">
      <div
        v-for="(payment, index) in payments"
        :key="index"
        class="payment-records__row"
        data-testid="payment-record-row"
      >
        <span class="payment-records__row-number">{{ index + 1 }}.</span>
        <span class="payment-records__row-type">{{ getPaymentMethodTypeLabel(payment) }}</span>
        <span class="payment-records__row-details">
          <template v-if="isPaymentMethodType(payment, 'Cheque')">
            {{ formatBankBranch(payment) }}
            {{ formatLabelValue('เลขที่เช็ค', payment.Transaction_Number) }}
            {{ formatLabelValue('ผจ.', payment.Name) }}
          </template>
          <template v-else-if="isPaymentMethodType(payment, 'Credit Card')">
            {{ getPaymentMethod(payment)?.Name }}
            {{ formatLabelValue('ผจ.', payment.Name) }}
          </template>
          <template v-else-if="isPaymentMethodType(payment, 'Bank Transfer')">
            {{ formatBankBranch(payment) }}
            {{ formatLabelValue('บัญชี', getPaymentMethod(payment)?.Account_Number) }}
            {{ formatLabelValue('ผจ.', payment.Name) }}
          </template>
          <template v-else>
            {{ formatLabelValue('ผจ.', payment.Name) }}
          </template>
        </span>
        <span class="payment-records__row-datetime">{{ formatDatetime(payment.Datetime) }}</span>
        <span class="payment-records__row-amount">{{ formatNumber(payment.Amount) }}</span>
      </div>
    </div>

    <div class="payment-records__summary">
      <div class="payment-records__summary-table">
        <div class="payment-records__summary-row">
          <div class="payment-records__summary-label">รวมชำระแล้ว</div>
          <div class="payment-records__summary-amount" data-testid="total-paid">
            {{ formatNumber(totalPaid) }}
          </div>
        </div>
        <div class="payment-records__summary-row payment-records__summary-row--balance">
          <div class="payment-records__summary-label">คงเหลือ</div>
          <div class="payment-records__summary-amount" data-testid="balance">
            {{ formatNumber(balance) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord, PaymentMethod, PaymentRecord } from '../types/document-schema'
import { formatNumber } from '../utils/currency'
import { getViewModel } from '../utils/view-model'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const payments = computed(() => props.record.Record.Payments ?? [])

const totalPaid = computed(() => payments.value.reduce((sum, p) => sum + p.Amount, 0))

const documentTotal = computed(() => getViewModel(props.record).total)

const balance = computed(() => documentTotal.value - totalPaid.value)

function getPaymentMethod(payment: PaymentRecord): PaymentMethod | null | undefined {
  // Fallback to document-level method for older records without per-payment link.
  return payment.Payment_Method ?? props.record.Record.Payment_Method
}

function getPaymentMethodTypeLabel(payment: PaymentRecord): string {
  const method = getPaymentMethod(payment)
  return method?.Type?.Thai_Name ?? method?.Type?.Name ?? method?.Name ?? ''
}

function isPaymentMethodType(payment: PaymentRecord, typeName: string): boolean {
  return getPaymentMethod(payment)?.Type?.Name === typeName
}

function formatBankBranch(payment: PaymentRecord): string {
  const method = getPaymentMethod(payment)
  if (!method?.Bank) return ''
  return method.Branch ? `ธ. ${method.Bank} สาขา ${method.Branch}` : `ธ. ${method.Bank}`
}

function formatLabelValue(label: string, value: string | null | undefined): string {
  return value ? `${label} ${value}` : ''
}

function formatDatetime(datetime: string): string {
  return new Date(datetime).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style>
.payment-records {
  margin-bottom: var(--spacing-xl);
}

/* ── List ─────────────────────────────────────────────────────── */
.payment-records__list {
  width: 100%;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.payment-records__row {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm) var(--spacing-xs) 0;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-primary);
}

.payment-records__row-number {
  flex: 0 0 auto;
  width: 1em;
  color: var(--text-muted);
  text-align: right;
}

.payment-records__row-type {
  flex: 0 0 2.5cm;
  font-weight: var(--font-weight-medium);
}

.payment-records__row-details {
  flex: 1 1 auto;
  color: var(--text-secondary);
}

.payment-records__row-datetime {
  flex: 0 0 auto;
  color: var(--text-muted);
  white-space: nowrap;
}

.payment-records__row-amount {
  flex: 0 0 2.5cm;
  text-align: right;
  font-weight: var(--font-weight-medium);
}

/* ── Summary ──────────────────────────────────────────────────── */
.payment-records__summary {
  display: flex;
  justify-content: flex-end;
}

.payment-records__summary-table {
  width: 50%;
  font-size: var(--font-size-sm);
}

.payment-records__summary-row {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-bottom: 1px solid var(--border-light);
}

.payment-records__summary-row--balance {
  border-bottom: 2px solid var(--border-dark);
  font-weight: var(--font-weight-bold);
}

.payment-records__summary-label {
  color: var(--text-primary);
}

.payment-records__summary-amount {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  text-align: right;
}
</style>

