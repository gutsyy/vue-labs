<template>
  <div>
    <form :class="`grid grid-cols-${props.cols} gap-x-6 gap-y-4`">
      <slot></slot>
    </form>
    <div class="mt-4">
      <div class="flex justify-end">
        <DxButton width="108" type="default" @click="props.onConfirm">确认</DxButton>
        <DxButton class="ml-4" width="108" @click="props.onCancel">取消</DxButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { DxButton } from 'devextreme-vue'
import type { FormContainerProps } from './types'

const props = withDefaults(defineProps<FormContainerProps>(), {
  cols: '2',
  showConfirmButton: true,
  showCancelButton: true,
  onConfirm: () => null,
  onCancel: () => null,
  selfClassPrefix: true
})
</script>
