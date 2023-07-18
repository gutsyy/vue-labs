<template>
  <DxTextBox v-bind="noUndefinedProps"></DxTextBox>
</template>
<script setup lang="ts">
import { DxTextBox } from 'devextreme-vue/text-box'
import type { Properties } from 'devextreme/ui/text_box'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

interface Props extends Properties {
  onValueChanged: (e: any) => void
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
</script>
