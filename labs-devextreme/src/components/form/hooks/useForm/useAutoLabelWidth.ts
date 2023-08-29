/**
 * only use in useForm hook
 * get all label default width, and set all label width to max value
 * gutsyy 2023-07-21 created
 */

import { ref } from 'vue'

export function useAutoLabelWidth(labelNumber: number) {
  let gotLabelWidthNumber = 0
  let maxWidth = 0

  const labelWidth = ref<number>(0)

  const getLabelDefaultWidth = function (width: number) {
    gotLabelWidthNumber++
    if (width > maxWidth) maxWidth = width
    if (gotLabelWidthNumber === labelNumber) {
      labelWidth.value = maxWidth
    }
  }

  return [labelWidth, getLabelDefaultWidth] as const
}
