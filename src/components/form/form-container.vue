<template>
  <form :class="`grid grid-cols-${props.cols} gap-x-6 gap-y-4 m-4`">
    <slot></slot>
  </form>
</template>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ cols: '2' | '4' | '6' | '12' }>(), {
  cols: '2'
})
</script>
