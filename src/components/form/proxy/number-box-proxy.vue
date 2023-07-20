<template>
  <DxNumberBox v-bind="noUndefinedProps" :on-value-changed="onValueChanged" />
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxNumberBox } from 'devextreme-vue/number-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/number_box'

interface Props extends Properties {
  onBoxValueChanged?: (value: any) => void
}

const props = withDefaults(defineProps<Props>(), {
  showSpinButtons: undefined,
  useLargeSpinButtons: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  showClearButton: undefined,
  spellcheck: undefined,
  useMaskedValue: undefined,
  isValid: undefined,
  readOnly: undefined,
  activeStateEnabled: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined
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
