<template>
  <section v-if="vehicle" class="vehicle-info" data-testid="vehicle-info">
    <h3 class="vehicle-info__title">ข้อมูลรถ</h3>
    <div class="vehicle-info__content">
      <div class="vehicle-info__name">{{ vehicle.Make }} {{ vehicle.Model }} - {{ vehicle.Color }} ({{ vehicle.Year }})</div>
      <div class="vehicle-info__details">
        <div v-if="vehicle.VIN" class="vehicle-info__detail-item">
          <span class="vehicle-info__label">เลขตัวถัง</span>
          <span class="vehicle-info__value">{{ vehicle.VIN }}</span>
        </div>
        <div v-if="vehicle.Purchase_Order_Number" class="vehicle-info__detail-item">
          <span class="vehicle-info__label">รหัสซื้อ</span>
          <span class="vehicle-info__value">{{ vehicle.Purchase_Order_Number }}</span>
        </div>
        <div v-if="vehicle.Engine_Number" class="vehicle-info__detail-item">
          <span class="vehicle-info__label">เลขเครื่อง</span>
          <span class="vehicle-info__value">{{ vehicle.Engine_Number }}</span>
        </div>
        <div v-if="vehicle.Sales_Order_Number" class="vehicle-info__detail-item">
          <span class="vehicle-info__label">รหัสขาย</span>
          <span class="vehicle-info__value">{{ vehicle.Sales_Order_Number }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { GristRecord } from '../types/document-schema'

interface Props {
  record: GristRecord
}

const props = defineProps<Props>()

const vehicle = computed(() => props.record.Record.Vehicle)
</script>

<style>
.vehicle-info {
  margin-bottom: var(--spacing-lg);
}

.vehicle-info__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.vehicle-info__name {
  font-weight: var(--font-weight-semibold);
}

.vehicle-info__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xs) var(--spacing-md);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
  color: var(--text-secondary);
}

.vehicle-info__detail-item {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-xs);
}

.vehicle-info__label {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  white-space: nowrap;
}

.vehicle-info__label::after {
  content: ':';
}

.vehicle-info__value {
  color: var(--text-secondary);
}
</style>
