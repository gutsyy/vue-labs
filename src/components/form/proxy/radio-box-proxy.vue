<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
    :is-required="props.isRequired"
  >
    <DxRadioGroup
      v-bind="noUndefinedProps"
      :on-value-changed="onValueChanged"
      :validation-error="validationError"
      :validation-status="box.validationInfo.validationStatus"
    ></DxRadioGroup>
  </ItemContainer>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxRadioGroup } from 'devextreme-vue/radio-group'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/radio_group'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './box'

type Props = Properties & BoxProperties

const validationError = {
  message: ''
}

const props = withDefaults(defineProps<Props>(), {
  activeStateEnabled: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  isValid: undefined,
  readOnly: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined,
  layout: 'horizontal'
})

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

const noUndefinedProps = removeUndefinedProps(props)
</script>
