<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
    :is-required="props.isRequired"
  >
    <DxDateBox
      v-bind="noUndefinedProps"
      :on-value-changed="onValueChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
    />
  </ItemContainer>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxDateBox } from 'devextreme-vue/date-box'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/date_box'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './useBox'

type Props = Properties & BoxProperties

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
./useBox
