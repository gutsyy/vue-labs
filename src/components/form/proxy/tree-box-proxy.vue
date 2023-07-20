<template>
  <DxDropDownBox>
    <template #content>
      <DxTreeView v-bind="noUndefinedProps"></DxTreeView>
    </template>
  </DxDropDownBox>
</template>

<script lang="ts" setup>
import { removeUndefinedProps } from '@/utils/removeUndefinedProps'
import { DxDropDownBox } from 'devextreme-vue/drop-down-box'
import { DxTreeView } from 'devextreme-vue/tree-view'
import type { Properties } from 'devextreme/ui/tree_view'

const props = withDefaults(defineProps<Properties>(), {
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
  searchEnabled: undefined,
  selectionMode: 'single'
})

const noUndefinedProps = removeUndefinedProps(props)
</script>
