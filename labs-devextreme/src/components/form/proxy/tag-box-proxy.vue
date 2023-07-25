<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
    :is-required="props.isRequired"
  >
    <DxTagBox
      v-bind="noUndefinedProps"
      :value="computedValue"
      :on-selection-changed="onSelectionChanged"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
      :search-enabled="props.searchEnabled"
      :search-expr="props.displayExpr"
    ></DxTagBox>
  </ItemContainer>
</template>
<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxTagBox } from 'devextreme-vue/tag-box'
import type { SelectionChangedEvent } from 'devextreme/ui/tag_box'
import { isProxy, toRaw } from 'vue'
import { computed } from 'vue'
import { ItemContainer } from '../basic'
import { useBox, type BoxProperties } from './box'

type Props = BoxProperties & {
  placeholder?: string
  onSelectionChanged?: (e: any) => void
  value: any[]
  valueExpr?: string
  dataSource?: any
  displayExpr?: string
  showSelectionControls?: boolean
  searchEnabled?: boolean
  selectAllText?: string
  maxDisplayedTags?: number
  noDataText?: string
  showClearButton?: boolean
  showDropDownButton?: boolean
}

// interface IgnoreProps extends /* @vue-ignore */ Props {}

const props = withDefaults(defineProps<Props>(), {
  showSelectionControls: true,
  searchEnabled: false,
  maxDisplayedTags: 4,
  showClearButton: false,
  showDropDownButton: true
})

const noUndefinedProps = removeUndefinedProps(props)

const computedValue = computed(() => {
  if (props.boxActionType === 'default' && computedValue.value?.length > 0) {
    return []
  }
  const rawValue = isProxy(props.value) ? toRaw(props.value) : props.value
  if (rawValue && rawValue.length && props.valueExpr && typeof rawValue[0] === 'object') {
    return props.value.map((ele) => ele[props.valueExpr as string])
  }
  return props.value
})

const box = useBox(props)

const onSelectionChanged = (e: SelectionChangedEvent) => {
  if (props.onSelectionChanged) {
    props.onSelectionChanged(e)
  }
  if (props.onBoxValueChanged) {
    const value = Array.isArray(props.value) ? props.value : []
    const rawAddItems = e.addedItems.map((item) => (isProxy(item) ? toRaw(item) : item))
    const rawRemovedItems = e.removedItems.map((item) => (isProxy(item) ? toRaw(item) : item))

    const addItemsKeys = rawAddItems.map((item) => (props.valueExpr ? item[props.valueExpr] : item))
    const removeItemsKeys = rawRemovedItems.map((item) => (props.valueExpr ? item[props.valueExpr] : item))

    const rawValue = isProxy(value) ? toRaw(value) : value
    const rawRawValue = rawValue.map((item) => (isProxy(item) ? toRaw(item) : item))
    const rawRawValueKeys = computedValue.value

    let allSelectedItems = rawRawValue

    let isChanged: boolean = false

    if (rawRawValue.length && rawAddItems.length && typeof rawRawValue[0] !== typeof rawAddItems[0]) {
      allSelectedItems = [...rawAddItems]
      isChanged = true
    } else {
      addItemsKeys.forEach((key, index) => {
        if (!rawRawValueKeys.includes(key)) {
          rawRawValue.push(rawAddItems[index])
          isChanged = true
        }
      })
    }

    if (rawRemovedItems.length) {
      isChanged = true
      allSelectedItems = allSelectedItems.filter((item, index) => {
        return !removeItemsKeys.includes(rawRawValueKeys[index])
      })
    }

    if (isChanged) {
      // validate
      box.validatorExecutor(allSelectedItems)
      props.onBoxValueChanged(allSelectedItems)
    }
  }
}
</script>
