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
    ></DxSelectBox>
  </ItemContainer>
</template>

<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxSelectBox } from 'devextreme-vue/select-box'
import type { Properties, SelectionChangedEvent } from 'devextreme/ui/select_box'
import { computed } from 'vue'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './box'

type Props = Properties & BoxProperties

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
  rtlEnabled: undefined,
  placeholder: '请选择...',
  noDataText: '无数据'
})

const computedValue = computed(() => {
  if (props.valueExpr && typeof props.value === 'object' && props.value !== null) {
    return props.value[props.valueExpr as string]
  }
  return props.value
})

const box = useBox(props)

const noUndefinedProps = removeUndefinedProps(props)

const onSelectionChanged = (e: SelectionChangedEvent) => {
  if (props.onBoxValueChanged && e.selectedItem !== null) {
    props.onBoxValueChanged(e.selectedItem)
  }
  if (props.onSelectionChanged) {
    props.onSelectionChanged(e)
  }
  box.validatorExecutor(e.selectedItem)
}
</script>
