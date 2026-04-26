<template>
  <section v-if="payments.length" class="payment-records" data-testid="payment-records">
    <h3 class="payment-records__title">รายการชำระเงิน</h3>

    <table class="payment-records__table">
      <thead class="payment-records__head">
        <tr class="payment-records__row">
          <th class="payment-records__header payment-records__header--number">ลำดับ</th>
          <th class="payment-records__header payment-records__header--type">ประเภท</th>
          <th class="payment-records__header payment-records__header--datetime">วันที่/เวลา</th>
          <th class="payment-records__header payment-records__header--details">รายละเอียด</th>
          <th class="payment-records__header payment-records__header--amount">จำนวนเงิน</th>
        </tr>
      </thead>
      <tbody class="payment-records__body">
        <tr
          v-for="(payment, index) in payments"
          :key="index"
          class="payment-records__row"
          data-testid="payment-record-row"
        >
          <td class="payment-records__cell payment-records__cell--number">{{ index + 1 }}</td>
          <td class="payment-records__cell payment-records__cell--type">{{ payment.Type }}</td>
          <td class="payment-records__cell payment-records__cell--datetime">
            {{ formatDatetime(payment.Datetime) }}
          </td>
          <td class="payment-records__cell payment-records__cell--details">
            <template v-if="payment.Type === 'Cheque'">
              ธนาคาร{{ payment.Bank }} สาขา{{ payment.Branch }} เลขที่เช็ค {{ payment.Transaction_Number }}
            </template>
            <template v-else-if="payment.Type === 'Credit Card'">
              {{ payment.Card_Type }}
            </template>
            <template v-else-if="payment.Type === 'Bank Transfer'">
              ธนาคาร{{ payment.Bank }} สาขา{{ payment.Branch }} บัญชี {{ payment.Account_Number }}
            </template>
          </td>
          <td class="payment-records__cell payment-records__cell--amount">
            {{ formatCurrency(payment.Amount) }}
          </td>
        </tr>
      </tbody>
    </table>

    <div class="payment-records__summary">
      <div class="payment-records__summary-table">
        <div class="payment-records__summary-row">
          <div class="payment-records__summary-label">รวมชำระแล้ว</div>
          <div class="payment-records__summary-amount" data-testid="total-paid">
            {{ formatCurrency(totalPaid) }}
          </div>
        </div>
        <div class="payment-records__summary-row payment-records__summary-row--balance">
          <div class="payment-records__summary-label">คงเหลือ</div>
          <div class="payment-records__summary-amount" data-testid="balance">
            {{ formatCurrency(balance) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { formatCurrency } from '../utils/currency'
import { getViewModel } from '../utils/view-model'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const payments = computed(() => props.record.Record.Payments ?? [])

const totalPaid = computed(() => payments.value.reduce((sum, p) => sum + p.Amount, 0))

const documentTotal = computed(() => getViewModel(props.record).total)

const balance = computed(() => documentTotal.value - totalPaid.value)

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

.payment-records__table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-base);
  margin-bottom: var(--spacing-sm);
}

.payment-records__header {
  background-color: var(--bg-gray-50);
  border: 1px solid var(--border-default);
  padding: var(--table-cell-padding);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  font-size: var(--font-size-base);
}

.payment-records__cell {
  border: 1px solid var(--border-default);
  padding: var(--table-cell-padding);
  color: var(--text-primary);
  vertical-align: top;
  font-size: var(--font-size-base);
}

.payment-records__header--number,
.payment-records__cell--number {
  width: 1cm;
  text-align: center;
}

.payment-records__header--type,
.payment-records__cell--type {
  width: 2.5cm;
}

.payment-records__header--datetime,
.payment-records__cell--datetime {
  width: 3.5cm;
}

.payment-records__header--details,
.payment-records__cell--details {
  width: auto;
  color: var(--text-secondary);
}

.payment-records__header--amount,
.payment-records__cell--amount {
  width: 2.5cm;
  text-align: right;
}

.payment-records__summary {
  display: flex;
  justify-content: flex-end;
}

.payment-records__summary-table {
  width: 50%;
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

