<template>
  <DxNumberBox v-bind="noUndefinedProps" />
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxNumberBox } from 'devextreme-vue/number-box'
import type { Properties } from 'devextreme/ui/number_box'

interface Props extends Properties {
  onValueChanged: (e: any) => void
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
</script>
