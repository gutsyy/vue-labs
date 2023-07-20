<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :got-default-label-width="props.getLabelDefaultWidth"
  >
    <DxNumberBox
      v-bind="noUndefinedProps"
      :on-value-changed="onValueChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
    />
  </ItemContainer>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxNumberBox } from 'devextreme-vue/number-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/number_box'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './box'

type Props = Properties & BoxProperties

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

const box = useBox(props)

const onValueChanged = (e: ValueChangedEvent) => {
  if (props.onValueChanged) {
    props.onValueChanged(e)
  }
  if (props.onBoxValueChanged) {
    props.onBoxValueChanged(e.value)
  }
  box.validatorExecutor(e.value)
}
</script>
