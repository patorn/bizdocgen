<template>
  <section
    v-if="sortedAccessories.length"
    class="accessories-section"
    data-testid="accessories-section"
    role="region"
    aria-label="รายการอุปกรณ์ตกแต่งเพิ่มเติม"
  >
    <h3 class="accessories-section__title">อุปกรณ์ตกแต่งเพิ่มเติม</h3>

    <div class="accessories-section__columns">
      <ol
        v-for="(column, columnIndex) in accessoryColumns"
        :key="`column-${columnIndex}`"
        class="accessories-section__column"
        :start="columnIndex * chunkSize + 1"
      >
        <li
          v-for="accessory in column"
          :key="accessory.id"
          class="accessories-section__item"
          data-testid="accessory-item"
        >
          <span class="accessories-section__description">{{ accessory.Description }}</span>
          <template v-if="accessory.Catalog?.Code">
            <span v-if="accessory.Catalog?.Code" class="accessories-section__tag">
              รหัสสินค้า: {{ accessory.Catalog.Code }}
            </span>
          </template>
        </li>
      </ol>
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

const sortedAccessories = computed(() => {
  const accessories = props.record.Record.Financing?.Accessories ?? []

  return [...accessories].sort((a, b) => {
    const sortA = a.Manual_Sort ?? a.id
    const sortB = b.Manual_Sort ?? b.id
    return sortA - sortB
  })
})

const chunkSize = computed(() => {
  if (!sortedAccessories.value.length) {
    return 1
  }

  return Math.ceil(sortedAccessories.value.length / 4)
})

const accessoryColumns = computed(() => {
  return [0, 1, 2, 3].map((columnIndex) => {
    const start = columnIndex * chunkSize.value
    const end = start + chunkSize.value
    return sortedAccessories.value.slice(start, end)
  })
})
</script>

<style>
.accessories-section {
  border: 1px solid var(--border-default);
  padding: var(--spacing-sm) var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.accessories-section__title {
  margin: 0 0 var(--spacing-sm) 0;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
}

.accessories-section__columns {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--spacing-md);
}

.accessories-section__column {
  margin: 0;
  padding-left: 5mm;
}

.accessories-section__item {
  margin-bottom: var(--spacing-xs);
  line-height: var(--line-height-base);
}

.accessories-section__description {
  color: var(--text-primary);
}

.accessories-section__tag {
  margin-left: 4px;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
}

@media screen and (max-width: 900px) {
  .accessories-section__columns {
    grid-template-columns: 1fr;
  }
}
</style>
