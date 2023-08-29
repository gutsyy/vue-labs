/**
 * only used in useForm hook
 * manage all form items validator & validation messages
 * if validation message is null, item is valid, if message is string, item is invalid
 * isRequired function help to set isRequired logic quickly
 */

type ValidatorFn<T extends any = any> = (value: T) => string | null

type PresetRule = 'isRequired'

export type ValidatorRules<T extends any> = (ValidatorFn<T> | PresetRule)[]

import { shallowReactive } from 'vue'

const isRequiredMessage = '此项不能为空'

const isRequired: ValidatorFn = (value) => {
  if (Array.isArray(value)) {
    if (value.length) {
      return null
    }
    return isRequiredMessage
  }
  if (value === 0) {
    return null
  }
  if (typeof value === 'string' && value.length) {
    return null
  }
  if (typeof value === 'boolean') {
    return null
  }
  if (value) {
    return null
  }
  return isRequiredMessage
}

export function useValidators<T extends Record<string, any>, K extends keyof T>(
  validators: Record<string, ValidatorRules<T[K]>> | undefined
) {
  validators = validators ?? {}

  const validationMessages = shallowReactive<Record<string, null | string>>(
    Object.keys(validators).reduce((prev, key) => {
      return { ...prev, [key]: null }
    }, {})
  )

  const isRequiredItems: Record<string, boolean> = {}

  const createValidatorRulesExecutor = function (validatorRules: ValidatorRules<T[K]>) {
    return function (value: T[K]) {
      let errorMessage: string | null = null
      for (const rule of validatorRules) {
        if (rule === 'isRequired') {
          errorMessage = isRequired(value)
        } else {
          errorMessage = rule(value)
        }
        if (typeof errorMessage === 'string') {
          return errorMessage
        }
      }
      return errorMessage
    }
  }

  const validatorsParsePreset: Record<string, ValidatorFn> = Object.entries(validators).reduce((prev, validator) => {
    if (validator[1].includes('isRequired')) {
      isRequiredItems[validator[0]] = true
    }
    return { ...prev, [validator[0]]: createValidatorRulesExecutor(validator[1]) }
  }, {})

  const executeAllValidators = function (formData: Record<string, any>) {
    Object.entries(validatorsParsePreset).forEach((validator) => {
      validationMessages[validator[0]] = validator[1](formData[validator[0]])
    })
    for (const message of Object.values(validationMessages)) {
      if (typeof message === 'string') {
        return false
      }
    }
    return true
  }

  const resetValidationMessages = function () {
    for (const key in validationMessages) {
      validationMessages[key] = ''
    }
    setTimeout(() => {
      for (const key in validationMessages) {
        validationMessages[key] = null
      }
    })
  }

  return {
    validationMessages,
    validatorsFunctions: validatorsParsePreset,
    executeAllValidators,
    isRequiredItems,
    resetValidationMessages
  } as const
}
