/**
 * ${type}-box-proxy common type & logic
 */

import { reactive, ref, watch } from 'vue'

export type BoxProperties = {
  onBoxValueChanged?: (value: any) => void
  labelText?: string
  labelWidth?: number
  getLabelDefaultWidth?: (w: number) => void
  validationMessage?: string | null
  validator?: (value: any) => string | null
  boxActionType?: 'default' | 'box-event'
  isRequired?: boolean
}

export function useBox(props: BoxProperties & Record<string, any>) {
  const validationResult = ref<string | null>(null)

  watch(
    () => props.validationMessage,
    () => {
      validationResult.value = props.validationMessage ?? null
    }
  )

  const validationInfo = reactive({
    validationStatus: 'valid',
    validationError: { message: '' }
  })

  watch(
    () => validationResult.value,
    () => {
      if (typeof validationResult.value === 'string') {
        validationInfo.validationStatus = 'invalid'
        validationInfo.validationError.message = validationResult.value
      } else {
        validationInfo.validationStatus = 'valid'
        validationInfo.validationError.message = ''
      }
    }
  )

  const validatorExecutor = function (value: any) {
    if (props.validator) {
      validationResult.value = props.validator(value)
    }
  }

  return {
    validationInfo: validationInfo,
    validatorExecutor: validatorExecutor
  } as const
}
