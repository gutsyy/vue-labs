/**
 * only used in useForm hook
 * manage all form items validator & validation messages
 * if validation message is null, item is valid, if message is string, item is invalid
 * isRequired function help to set isRequired logic quickly
 */

type ValidatorFn<T extends any = any> = (value: T) => string | null

type PresetRule = 'isRequired'

export type Validator = ValidatorFn | PresetRule

import { ref } from 'vue'

const isRequiredMessage = '此项不能为空'

const isRequired: ValidatorFn = (value) => {
  if (Array.isArray(value)) {
    return value.length ? null : isRequiredMessage
  }
  if (value === 0) {
    return null
  }
  if (value) {
    return null
  }
  return isRequiredMessage
}

export function useValidators<T extends Record<string, any>, K extends keyof T>(
  validators: Record<string, ValidatorFn<T[K]> | PresetRule> | undefined
) {
  validators = validators ?? {}

  const validationMessages = ref<Record<string, null | string>>(
    Object.keys(validators).reduce((prev, key) => {
      return { ...prev, [key]: null }
    }, {})
  )

  const validatorsParsePreset: Record<string, ValidatorFn> = Object.entries(validators).reduce((prev, validator) => {
    if (validator[1] === 'isRequired') {
      return { ...prev, [validator[0]]: isRequired }
    }
    return { ...prev, [validator[0]]: validator[1] }
  }, {})

  const executeAllValidators = function (formData: Record<string, any>) {
    Object.entries(validatorsParsePreset).forEach((validator) => {
      validationMessages.value[validator[0]] = validator[1](formData[validator[0]])
    })
    for (const message of Object.values(validationMessages.value)) {
      if (typeof message === 'string') {
        return false
      }
    }
    return true
  }

  return { validationMessages, validatorsFunctions: validatorsParsePreset, executeAllValidators } as const
}
