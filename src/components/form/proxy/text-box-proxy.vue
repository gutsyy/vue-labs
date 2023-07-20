<template>
  <DxTextBox v-bind="noUndefinedProps" :on-value-changed="onValueChanged"></DxTextBox>
</template>
<script setup lang="ts">
import { DxTextBox } from 'devextreme-vue/text-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/text_box'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

interface Props extends Properties {
  onBoxValueChanged?: (value: any) => void
}

const props = withDefaults(defineProps<Props>(), {
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
