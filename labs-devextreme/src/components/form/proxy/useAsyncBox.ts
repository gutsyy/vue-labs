/** select-box tag-box radio-box tree-box */

import { onMounted, ref, inject, watch, ComputedRef } from 'vue'

export type AsyncBoxProperties = {
  getAsyncDataSource?: () => Promise<boolean>
}

export const useAsyncBox = (props: AsyncBoxProperties) => {
  const noDataText = ref<string>('没有要显示的数据')

  onMounted(() => {
    if (props.getAsyncDataSource) {
      noDataText.value = '请求获取数据中...'
      props.getAsyncDataSource().then(() => {
        noDataText.value = '没有要显示的数据'
      })
    }
  })

  const popupFormVis = inject<ComputedRef<boolean> | undefined>('popupFormVis', undefined)
  const refetchOnHidden = inject<ComputedRef<false> | { value: false }>('refetchOnHidden', { value: false })

  if (refetchOnHidden.value && popupFormVis) {
    watch(
      () => popupFormVis.value,
      () => {
        if (!popupFormVis.value && props.getAsyncDataSource) {
          props.getAsyncDataSource()
        }
      }
    )
  }

  return { noDataText } as const
}
