<template>
  <DxTagBox
    v-bind="noUndefinedProps"
    :value="computedValue"
    :on-selection-changed="onSelectionChanged"
  ></DxTagBox>
</template>
<script setup lang="ts">
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxTagBox } from 'devextreme-vue/tag-box'
import type { Properties, SelectionChangedEvent } from 'devextreme/ui/tag_box'
import { isProxy, toRaw } from 'vue'
import { computed } from 'vue'

interface Props extends /* @vue-ignore */ Properties {
  onSelectionChanged?: (e: any) => void
  value: any[]
  valueExpr?: string
  onBoxValueChanged?: (value: any) => void
}

const props = withDefaults(defineProps<Props>(), {})

const noUndefinedProps = removeUndefinedProps(props)

const computedValue = computed(() => {
  const rawValue = isProxy(props.value) ? toRaw(props.value) : props.value
  if (rawValue && rawValue.length && props.valueExpr && typeof rawValue[0] === 'object') {
    return props.value.map((ele) => ele[props.valueExpr as string])
  }
  return props.value
})

const onSelectionChanged = (e: SelectionChangedEvent) => {
  if (props.onSelectionChanged) {
    props.onSelectionChanged(e)
  }
  if (props.onBoxValueChanged) {
    const value = Array.isArray(props.value) ? props.value : []
    const rawAddItems = e.addedItems.map((item) => (isProxy(item) ? toRaw(item) : item))
    const rawRemovedItems = e.removedItems.map((item) => (isProxy(item) ? toRaw(item) : item))

    const addItemsKeys = rawAddItems.map((item) => (props.valueExpr ? item[props.valueExpr] : item))
    const removeItemsKeys = rawRemovedItems.map((item) =>
      props.valueExpr ? item[props.valueExpr] : item
    )

    const rawValue = isProxy(value) ? toRaw(value) : value
    const rawRawValue = rawValue.map((item) => (isProxy(item) ? toRaw(item) : item))

    const rawRawValueKeys = rawRawValue.map((item) =>
      props.valueExpr ? item[props.valueExpr] : item
    )

    let allSelectedItems = rawRawValue

    let isChanged: boolean = false

    if (
      rawRawValue.length &&
      rawAddItems.length &&
      typeof rawRawValue[0] !== typeof rawAddItems[0]
    ) {
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
      allSelectedItems = rawRawValue.filter((item, index) => {
        return !removeItemsKeys.includes(rawRawValueKeys[index])
      })
    }

    if (isChanged) {
      props.onBoxValueChanged(allSelectedItems)
    }
  }
}
</script>
