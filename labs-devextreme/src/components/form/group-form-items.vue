<template>
  <div class="border-gray-300 pt-2 pb-2 rounded-lg col-span-full">
    <div class="mb-4 pb-1 text-gray-800 text-sm border-solid border-0 border-b border-gray-300 px-1">
      {{ props.title }}
    </div>
    <div :class="`grid grid-cols-${cols} gap-x-6 gap-y-4 px-1`">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ title: string; cols?: string }>(), {
  cols: '2'
})
</script>
