<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
    :is-required="props.isRequired"
  >
    <DxSelectBox
      v-bind="noUndefinedProps"
      :value="computedValue"
      :on-selection-changed="onSelectionChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
      :no-data-text="noDataText"
    ></DxSelectBox>
  </ItemContainer>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxSelectBox } from 'devextreme-vue/select-box'
import type { Properties, SelectionChangedEvent } from 'devextreme/ui/select_box'
import { computed } from 'vue'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './useBox'
import { AsyncBoxProperties, useAsyncBox } from './useAsyncBox'

type Props = Properties & BoxProperties & AsyncBoxProperties

const props = withDefaults(defineProps<Props>(), {
  acceptCustomValue: undefined,
  openOnFieldClick: undefined,
  showDropDownButton: undefined,
  showSelectionControls: undefined,
  grouped: undefined,
  searchEnabled: undefined,
  showDataBeforeSearch: undefined,
  wrapItemText: undefined,
  useItemTextAsTitle: undefined,
  activeStateEnabled: undefined,
  deferRendering: undefined,
  opened: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  showClearButton: undefined,
  spellcheck: undefined,
  useMaskedValue: undefined,
  isValid: undefined,
  readOnly: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined
})

const { noDataText } = useAsyncBox(props)

const computedValue = computed(() => {
  if (props.boxActionType === 'default' && (computedValue.value || computedValue.value === 0)) {
    return null
  }
  if (props.valueExpr && typeof props.value === 'object' && props.value !== null) {
    return props.value[props.valueExpr as string]
  }
  return props.value
})

const box = useBox(props)

const noUndefinedProps = removeUndefinedProps(props)

const onSelectionChanged = (e: SelectionChangedEvent) => {
  if (props.onBoxValueChanged) {
    if (e.selectedItem === null) {
      if (props.boxActionType === 'default') {
        props.onBoxValueChanged(props.value)
      } else {
        props.onBoxValueChanged(e.selectedItem)
      }
    } else {
      props.onBoxValueChanged(e.selectedItem)
    }
  }
  if (props.onSelectionChanged) {
    props.onSelectionChanged(e)
  }
  box.validatorExecutor(e.selectedItem)
}
</script>
./useBox
