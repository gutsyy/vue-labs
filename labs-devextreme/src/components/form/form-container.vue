<template>
  <div>
    <form :class="`grid grid-cols-${props.cols} gap-x-6 gap-y-4`">
      <slot></slot>
    </form>
    <div class="mt-4">
      <div class="flex justify-end">
        <div :class="confirmButtonClassName" v-if="showConfirmButton" @click="onConfirm">确认</div>
        <div :class="cancelButtonClassName" v-if="showCancelButton" @click="onCancel">取消</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormContainerProps } from './types'
import { onBeforeMount } from 'vue'
import zhMessages from 'devextreme/esm/localization/messages/zh.json'
import { loadMessages, locale } from 'devextreme/localization'
import classnames from 'classnames'

onBeforeMount(() => {
  locale(props.locale)
  loadMessages(zhMessages)
})

const props = withDefaults(defineProps<FormContainerProps>(), {
  cols: '2',
  showConfirmButton: true,
  showCancelButton: true,
  onConfirm: () => null,
  onCancel: () => null,
  locale: 'zh'
})

const confirmButtonClassName = classnames(
  'px-6 flex items-center py-[.375rem] bg-blue-500 text-white rounded-md hover:bg-blue-400 select-none',
  props.confirmButtonClassName ?? ''
)
const cancelButtonClassName = classnames(
  'px-6 flex items-center py-[.375rem] border-gray-200 border-solid text-gray-700 rounded-md ml-4 hover:bg-gray-100 select-none',
  props.cancelButtonClassName ?? ''
)
</script>
