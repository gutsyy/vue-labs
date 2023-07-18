<template>
  <DxTagBox v-bind="noUndefinedProps" :value="computedValue"></DxTagBox>
</template>
<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxTagBox } from 'devextreme-vue/tag-box'
import type { Properties } from 'devextreme/ui/tag_box'
import { isProxy, toRaw } from 'vue'
import { computed } from 'vue'

interface Props extends /* @vue-ignore */ Properties {
  onSelectionChanged?: (e: any) => void
  value: any[]
  valueExpr?: any
}

const props = withDefaults(defineProps<Props>(), {})

const noUndefinedProps = removeUndefinedProps(props)

const computedValue = computed(() => {
  const rawValue = isProxy(props.value) ? toRaw(props.value) : props.value
  if (rawValue && rawValue.length && props.valueExpr && typeof rawValue[0] === 'object') {
    return props.value.map((ele) => ele[props.valueExpr as string])
  }
  return props.value
})
</script>
