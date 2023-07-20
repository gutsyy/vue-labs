<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
  >
    <DxRadioGroup v-bind="noUndefinedProps" :on-value-changed="onValueChanged"></DxRadioGroup>
  </ItemContainer>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxRadioGroup } from 'devextreme-vue/radio-group'
import type { Properties, ValueChangedEvent } from 'devextreme/ui/radio_group'
import { ItemContainer } from '../basic'

interface Props extends Properties {
  onBoxValueChanged?: (e: any) => void
  labelText?: string
  labelWidth?: number
  getLabelDefaultWidth?: (w: number) => void
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

const onValueChanged = (e: ValueChangedEvent) => {
  console.log(e.value)
  if (props.onValueChanged) {
    props.onValueChanged(e)
  }
  if (props.onBoxValueChanged) {
    props.onBoxValueChanged(e.value)
  }
}

const noUndefinedProps = removeUndefinedProps(props)
</script>
