<template>
  <section v-if="vehicle" class="vehicle-info" data-testid="vehicle-info">
    <h3 class="vehicle-info__title">ข้อมูลรถ</h3>
    <div class="vehicle-info__content">
      <div class="vehicle-info__name">{{ vehicle.Make }} {{ vehicle.Model }} ({{ vehicle.Year }})</div>
      <div class="vehicle-info__details">
        <div v-if="vehicle.Color" class="vehicle-info__color">สี: {{ vehicle.Color }}</div>
        <div v-if="vehicle.VIN" class="vehicle-info__vin">เลขตัวถัง: {{ vehicle.VIN }}</div>
        <div v-if="vehicle.Engine_Number" class="vehicle-info__engine-number">
          เลขเครื่องยนต์: {{ vehicle.Engine_Number }}
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
  font-size: var(--font-size-sm);
  line-height: var(--line-height-base);
  color: var(--text-secondary);
}
</style>
