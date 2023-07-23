<template>
  <ItemContainer
    :label="props.labelText"
    :is-required="props.isRequired"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
  >
    <DxCheckBox
      v-bind="noUndefinedProps"
      :on-value-changed="onValueChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
    ></DxCheckBox>
  </ItemContainer>
</template>

<script setup lang="ts">
import { DxCheckBox } from 'devextreme-vue/check-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/check_box'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './box'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

type Props = Properties & BoxProperties

const props = withDefaults(defineProps<Props>(), {
  activeStateEnabled: undefined,
  enableThreeStateBehavior: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  value: undefined,
  isValid: undefined,
  readOnly: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined,
  isRequired: undefined
})

const noUndefinedProps = removeUndefinedProps(props)

const box = useBox(props)

const onValueChanged = function (e: ValueChangedEvent) {
  if (props.onValueChanged) {
    props.onValueChanged(e)
  }
  if (props.onBoxValueChanged) {
    box.validatorExecutor(e.value)
    props.onBoxValueChanged(e.value)
  }
}
</script>
