<template>
  <DxDateBox v-bind="noUndefinedProps" :on-value-changed="onValueChanged" />
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxDateBox } from 'devextreme-vue/date-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/date_box'

interface Props extends Properties {
  onBoxValueChanged?: (value: any) => void
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

const onValueChanged = (e: ValueChangedEvent) => {
  if (props.onValueChanged) {
    props.onValueChanged(e)
  }
  if (props.onBoxValueChanged) {
    props.onBoxValueChanged(e.value)
  }
}
</script>
