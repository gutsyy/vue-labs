<template>
  <DxDateBox v-bind="noUndefinedProps" />
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxDateBox } from 'devextreme-vue/date-box'
import type { Properties } from 'devextreme/ui/date_box'

interface Props extends Properties {
  onValueChanged: (e: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  adaptivityEnabled: undefined,
  showAnalogClock: undefined,
  useMaskBehavior: undefined,
  acceptCustomValue: undefined,
  activeStateEnabled: undefined,
  deferRendering: undefined,
  openOnFieldClick: undefined,
  opened: undefined,
  showDropDownButton: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  showClearButton: undefined,
  spellcheck: undefined,
  useMaskedValue: undefined,
  isValid: undefined,
  readOnly: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined,
  dateSerializationFormat: 'yyyy-MM-dd'
})

const noUndefinedProps = removeUndefinedProps(props)
</script>
