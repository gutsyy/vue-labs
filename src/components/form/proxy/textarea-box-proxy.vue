<template>
  <ItemContainer :label="props.labelText" :get-label-default-width="props.getLabelDefaultWidth" :width="props.labelWidth">
    <DxTextArea
      v-bind="noUndefinedProps"
      :on-value-changed="onValueChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
    ></DxTextArea>
  </ItemContainer>
</template>

<script lang="ts" setup>
import { DxTextArea } from 'devextreme-vue/text-area'
import { ItemContainer } from '../basic'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/text_area'
import { useBox, type BoxProperties } from './box'
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'

type Props = Properties & BoxProperties

const props = withDefaults(defineProps<Props>(), {
  autoResizeEnabled: undefined,
  spellcheck: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  showClearButton: undefined,
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
