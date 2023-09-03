<template>
  <div>
    <form :class="`grid grid-cols-${props.cols} gap-x-6 gap-y-4 ${props.className}`">
      <slot></slot>
    </form>
    <div class="mt-4">
      <div class="flex justify-end">
        <DxButton width="80" v-if="props.showConfirmButton" @click="props.onConfirm" type="default">{{
          confirmButtonName
        }}</DxButton>
        <DxButton class="ml-4" width="80" v-if="props.showCancelButton" @click="props.onCancel">{{
          cancelButtonName
        }}</DxButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormContainerProps } from './types'
import { DxButton } from 'devextreme-vue/button'

const props = withDefaults(defineProps<FormContainerProps>(), {
  className: '',
  cols: '2',
  showConfirmButton: true,
  showCancelButton: true,
  onConfirm: () => null,
  onCancel: () => null,
  confirmButtonName: '确认',
  cancelButtonName: '取消'
})
</script>
