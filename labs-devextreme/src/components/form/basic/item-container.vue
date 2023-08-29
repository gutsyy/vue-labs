<template>
  <div class="flex justify-between items-center">
    <div v-if="hasLabel" class="text-xs font-sans text-gray-600 mr-4" ref="label" :style="calStyle">
      {{ props.label }}<span v-if="props.isRequired" class="text-red-500 ml-1">*</span>
    </div>
    <div class="flex-1">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'

const props = defineProps<{
  label?: string
  isRequired?: boolean
  width?: number
  getLabelDefaultWidth?: (w: number) => void
}>()

const hasLabel = computed(() => {
  if (props.label === undefined) {
    return false
  }
  return true
})

const label = ref<HTMLDivElement>()

const calStyle = computed(() => {
  if (props.width) {
    // plus 2 to prevent width not enough for isRequired mark
    return { width: props.width + 'px' }
  }
  return undefined
})

onMounted(() => {
  if (props.getLabelDefaultWidth) {
    props.getLabelDefaultWidth(label.value?.clientWidth ?? 0)
  }
})
</script>
