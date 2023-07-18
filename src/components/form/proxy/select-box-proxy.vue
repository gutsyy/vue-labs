<template>
  <DxSelectBox v-bind="noUndefinedProps" :value="computedValue"></DxSelectBox>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxSelectBox } from 'devextreme-vue/select-box'
import type { Properties } from 'devextreme/ui/select_box'
import { computed } from 'vue'

interface Props extends Properties {
  onSelectionChanged: (e: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  acceptCustomValue: undefined,
  openOnFieldClick: undefined,
  showDropDownButton: undefined,
  showSelectionControls: undefined,
  grouped: undefined,
  searchEnabled: undefined,
  showDataBeforeSearch: undefined,
  wrapItemText: undefined,
  useItemTextAsTitle: undefined,
  activeStateEnabled: undefined,
  deferRendering: undefined,
  opened: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  showClearButton: undefined,
  spellcheck: undefined,
  useMaskedValue: undefined,
  isValid: undefined,
  readOnly: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined
})

const computedValue = computed(() => {
  if (props.valueExpr && typeof props.value === 'object') {
    return props.value[props.valueExpr as string]
  }
  return props.value
})

const noUndefinedProps = removeUndefinedProps(props)
</script>
