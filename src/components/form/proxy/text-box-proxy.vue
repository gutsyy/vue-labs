<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
  >
    <DxTextBox
      v-bind="noUndefinedProps"
      :on-value-changed="onValueChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
    ></DxTextBox>
  </ItemContainer>
</template>
<script setup lang="ts">
import { DxTextBox } from 'devextreme-vue/text-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/text_box'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './box'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

type Props = Properties & BoxProperties

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
