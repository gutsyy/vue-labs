<template>
  <DxPopup v-bind="noUndefinedProps">
    <FormContainer v-bind="noUndefinedProps">
      <slot></slot>
    </FormContainer>
  </DxPopup>
</template>

<script lang="ts" setup>
import { DxPopup } from 'devextreme-vue/popup'
import type { Properties } from 'devextreme/ui/popup'
import FormContainer from './form-container.vue'
import { removeUndefinedProps } from '@/utils'
import { FormContainerProps } from './types'

type Props = FormContainerProps & Properties

const props = withDefaults(defineProps<Props>(), {
  showCancelButton: undefined,
  showConfirmButton: undefined,
  dragEnabled: undefined,
  dragOutsideBoundary: undefined,
  focusStateEnabled: undefined,
  fullScreen: undefined,
  enableBodyScroll: undefined,
  resizeEnabled: undefined,
  restorePosition: undefined,
  showCloseButton: undefined,
  showTitle: undefined,
  closeOnOutsideClick: undefined,
  copyRootClassesToWrapper: undefined,
  hideOnOutsideClick: undefined,
  hideOnParentScroll: undefined,
  shading: undefined,
  visible: undefined,
  activeStateEnabled: undefined,
  disabled: undefined,
  hoverStateEnabled: undefined,
  rtlEnabled: undefined,
  maxHeight: '80vh',
  height: 'auto',
  deferRendering: true
})

const noUndefinedProps = removeUndefinedProps(props)
</script>
