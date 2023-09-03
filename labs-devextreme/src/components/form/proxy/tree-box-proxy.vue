<template>
  <ItemContainer
    :label="props.labelText"
    :width="props.labelWidth"
    :get-label-default-width="props.getLabelDefaultWidth"
    :is-required="props.isRequired"
  >
    <DxDropDownBox
      v-bind="props.options"
      :value="dropdownBoxValue[0]"
      :dataSource="dropdownBoxValue[1]"
      :validation-error="box.validationInfo.validationError"
      :validation-status="box.validationInfo.validationStatus"
      :defer-rendering="false"
      :on-value-changed="onDropDownBoxValueChanged"
    >
      <template #content>
        <DxTreeView
          v-bind="noUndefinedProps"
          :on-initialized="onTreeViewInitialized"
          :on-selection-changed="onSelectionChanged"
          :on-content-ready="onContentReady"
        ></DxTreeView>
      </template>
    </DxDropDownBox>
  </ItemContainer>
</template>

<script lang="ts" setup>
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxDropDownBox } from 'devextreme-vue/drop-down-box'
import { DxTreeView } from 'devextreme-vue/tree-view'
import type { InitializedEvent, Properties, ContentReadyEvent, SelectionChangedEvent } from 'devextreme/ui/tree_view'
import type { ValueChangedEvent } from 'devextreme/ui/drop_down_box'
import { useBox, type BoxProperties } from './box'
import ItemContainer from '../basic/item-container.vue'
import dxTreeView from 'devextreme/ui/tree_view'
import { computed, watch } from 'vue'

type Props = { value: any[] } & BoxProperties & Properties

const props = withDefaults(defineProps<Props>(), {
  animationEnabled: undefined,
  expandAllEnabled: undefined,
  expandNodesRecursive: undefined,
  selectByClick: true,
  selectNodesRecursive: undefined,
  virtualModeEnabled: undefined,
  useNativeScrolling: undefined,
  focusStateEnabled: undefined,
  hoverStateEnabled: undefined,
  activeStateEnabled: undefined,
  disabled: undefined,
  visible: undefined,
  rtlEnabled: undefined,
  searchEnabled: true,
  selectionMode: 'single',
  itemsExpr: 'children',
  showCheckBoxesMode: 'normal',
  parentIdExpr: 'parentId',
  keyExpr: 'id'
})

const box = useBox(props)

const noUndefinedProps = removeUndefinedProps(props)

let treeViewComponent: dxTreeView<any> | undefined = undefined

let initializedStatus = false

let timer = 0

watch(
  () => props.value,
  () => {
    let value = props.value ? [...props.value] : []
    if (props.boxActionType === 'default') {
      if (treeViewComponent) {
        treeViewComponent.unselectAll()
        treeViewComponent.collapseAll()
      }
      clearTimeout(timer)
      timer = setTimeout(() => {
        initializedStatus = false
        initializedTreeView(value)
      }, 240)
    }
  }
)

const dropdownBoxValue = computed(() => {
  let displayValues = []
  if (props.value && props.value.length) {
    for (const item of props.value) {
      if (typeof item !== 'object') {
        return ['', []] as const
      }
      displayValues.push(item[props.displayExpr as string])
    }
  }
  const dropdownBoxDisplayStr = displayValues.join(`, `)
  return [dropdownBoxDisplayStr, [dropdownBoxDisplayStr]] as const
})

const initializedTreeView = (value?: any[]) => {
  let values = value ?? props.value
  if (!initializedStatus && treeViewComponent && values.length && props.dataSource) {
    const keys = values.map((item) => {
      if (typeof item === 'object') {
        return item[props.keyExpr as string]
      }
      return item
    })
    keys.forEach((v) => {
      if (treeViewComponent?.selectItem(v)) {
        treeViewComponent?.expandItem(v).then(() => {
          treeViewComponent?.scrollToItem(v)
        })
      }
    })
    initializedStatus = true
  }
}

const onContentReady = (e: ContentReadyEvent) => {
  if (props.onContentReady) {
    props.onContentReady(e)
  }
  initializedTreeView()
}

watch(
  () => props.dataSource,
  () => {
    initializedStatus = false
  }
)

const onTreeViewInitialized = function (e: InitializedEvent) {
  treeViewComponent = e.component
  if (props.onInitialized) {
    props.onInitialized(e)
  }
}

const onSelectionChanged = function (e: SelectionChangedEvent) {
  if (props.onSelectionChanged) {
    props.onSelectionChanged(e)
  }
  if (treeViewComponent && props.onBoxValueChanged) {
    const selectedItems = treeViewComponent.getSelectedNodes().map((node) => {
      const item = { ...node.itemData }
      delete item[props.itemsExpr as 'children']
      delete item['selected']
      delete item['expanded']
      return item
    })

    props.onBoxValueChanged(selectedItems)
  }
}

// for clear button click on dropDownBox，clear all selection
const onDropDownBoxValueChanged = function (e: ValueChangedEvent) {
  if (e.value === null && props.onBoxValueChanged) {
    props.onBoxValueChanged([])
    if (treeViewComponent) {
      treeViewComponent.unselectAll()
    }
  }
}
</script>
