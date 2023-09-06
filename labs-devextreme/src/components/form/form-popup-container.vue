<template>
  <DxPopup v-bind="noUndefinedProps">
    <template v-if="deferRendering" #content>
      <FormContainer v-bind="noUndefinedProps" @cancel="onCancel">
        <slot></slot>
      </FormContainer>
    </template>
    <FormContainer v-if="!deferRendering" v-bind="noUndefinedProps" @cancel="onCancel">
      <slot></slot>
    </FormContainer>
  </DxPopup>
</template>

<script lang="ts" setup>
import { DxPopup } from 'devextreme-vue/popup'
import type { HiddenEvent, Properties } from 'devextreme/ui/popup'
import FormContainer from './form-container.vue'
import { removeUndefinedProps } from '@/utils'
import { FormContainerProps } from './types'
import { computed, provide } from 'vue'

type Props = FormContainerProps & Properties & { refetchOnHidden?: boolean }

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
  deferRendering: false,
  refetchOnHidden: false
})

const popupFormVis = computed(() => props.visible)
const refetchOnHidden = computed(() => props.refetchOnHidden)

// Provide visible state to help form items to refresh datasource when visible
provide('popupFormVis', popupFormVis)
provide('refetchOnHidden', refetchOnHidden)

const noUndefinedProps = removeUndefinedProps(props)

const onCancel = function (e: HiddenEvent) {
  if (props.onCancel) {
    props.onCancel()
  }
  if (props.onHidden) {
    props.onHidden(e)
  }
}
</script>
