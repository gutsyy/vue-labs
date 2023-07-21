/**
 * only use in useForm hook
 * store all set value action type in form data
 * gutsyy 2023-07-22 created
 */

import { reactive, type ShallowReactive } from 'vue'

export function useActionsType(formData: ShallowReactive<Record<string, any>>) {
  const actionTypeReactive = reactive<Record<string, 'default' | 'box-event'>>(
    Object.keys(formData).reduce((prev, key) => {
      return { ...prev, [key]: 'default' }
    }, {})
  )

  return actionTypeReactive
}
