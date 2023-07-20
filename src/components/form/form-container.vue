<template>
  <div class="m-4">
    <form :class="`grid grid-cols-${props.cols} gap-x-6 gap-y-4`">
      <slot></slot>
    </form>
    <div class="flex justify-end mt-4">
      <DxButton width="108" type="default">确认</DxButton>
      <DxButton class="ml-4" width="108">取消</DxButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DxButton } from 'devextreme-vue'

const props = withDefaults(defineProps<{ cols: '2' | '4' | '6' | '12' }>(), {
  cols: '2'
})
</script>
