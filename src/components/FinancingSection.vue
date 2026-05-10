<template>
  <section v-if="financing" class="financing-section" data-testid="financing-section">
    <h3 class="financing-section__title">รายละเอียดการขาย</h3>

    <div class="financing-section__grid">
      <div class="financing-section__row">
        <span class="financing-section__label">ราคาขายสุทธิ</span>
        <span class="financing-section__value">{{ formatAmount(financing.Net_Selling_Price) }}</span>
      </div>
      <div class="financing-section__row">
        <span class="financing-section__label">เงินดาวน์ ({{ formatPercentage(financing.Down_Payment_Percentage) }})</span>
        <span class="financing-section__value">{{ formatAmount(financing.Down_Payment_Amount) }}</span>
      </div>
      <div class="financing-section__row">
        <span class="financing-section__label">ยอดจัดเช่าซื้อ</span>
        <span class="financing-section__value">{{ formatAmount(financing.Hire_Purchase_Amount) }}</span>
      </div>
      <div class="financing-section__row">
        <span class="financing-section__label">ผ่อนชำระ {{ financing.Installment_Plan_Term_Months }} งวด x ดอกเบี้ย {{ formatPercentage(financing.Installment_Plan_Interest_Rate) }}</span>
        <span class="financing-section__value">{{ formatAmount(financing.Installment_Plan_Monthly_Payment) }}</span>
      </div>
      <div class="financing-section__row">
        <span class="financing-section__label">บริษัทประกัน</span>
        <span class="financing-section__value">{{ financing.Insurance_Company ?? '-' }}</span>
      </div>
      <div class="financing-section__row">
        <span class="financing-section__label">ทุนประกัน</span>
        <span class="financing-section__value">
          {{ formatAmount(financing.Insurance_Sum_Assured) }}
        </span>
      </div>
      <div class="financing-section__row">
        <span class="financing-section__label">ค่าเบี้ยประกัน</span>
        <span class="financing-section__value">{{ formatAmount(financing.Insurance_Premium) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'
import { formatCurrency } from '../utils/currency'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const financing = computed(() => props.record.Record.Financing)

function formatAmount(value: number | null | undefined): string {
  if (value == null) {
    return '-'
  }

  return formatCurrency(value)
}

function formatPercentage(value: number | null | undefined): string {
  if (value == null) {
    return '-'
  }

  return `${value.toLocaleString('th-TH', { maximumFractionDigits: 2 })}%`
}
</script>

<style>
.financing-section {
  container-type: inline-size;
  border: 1px solid var(--border-default);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.financing-section__title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.financing-section__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xs) var(--spacing-lg);
}

.financing-section__row {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  border-bottom: 1px dashed var(--border-light);
  padding-bottom: var(--spacing-xs);
}

.financing-section__label {
  color: var(--text-secondary);
}

.financing-section__value {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
  text-align: right;
}

@container (max-width: 500px) {
  .financing-section__grid {
    grid-template-columns: 1fr;
  }
}
</style>
