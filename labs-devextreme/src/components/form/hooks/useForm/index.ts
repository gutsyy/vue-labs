/**
 * useForm
 * help create devExtreme form quickly
 * integrated lots of form logic
 * gutsyy 2023-07-20 created
 */

import { type UnwrapRef } from 'vue'
import { shallowReactive, nextTick } from 'vue'
import type { DataSources } from './useDataSources'
import { useDataSources } from './useDataSources'
import { useAutoLabelWidth } from './useAutoLabelWidth'
import { useValidators, type ValidatorRules } from './useValidators'
import { useActionsType } from './useActionsType'

// return options
type CommonOptions = {
  value: any
  onBoxValueChanged: (value: any) => void
  labelWidth: UnwrapRef<number>
  getLabelDefaultWidth: (w: number) => void
  validationMessage: string | null
  validator: any
  boxActionType: 'default' | 'box-event'
  isRequired: boolean
}

type ArrayItemOptions = CommonOptions & {
  value: any[]
  dataSource: any
  valueExpr: any
  displayExpr: any
}

export function useForm<T extends Record<string, any>, DK extends keyof T, VK extends keyof T>(
  formData: T,
  // 能不能通过denpendencies的输入进一步约束D?
  options?: {
    dataSources?: DataSources<T, DK>
    validators?: {
      [k in VK]: ValidatorRules<T[k]>
    }
  }
) {
  const defaultFormData: Record<keyof T, any> = { ...formData }

  const formDataReactive = shallowReactive(formData)

  const actionsTypeReactive = useActionsType(formData)

  // help to distinguish the action type
  const formDataReactiveProxy: {
    [k in keyof T]: any
  } = new Proxy(formDataReactive, {
    set(obj, prop, newVal: { type: 'box-event'; value: any } | any) {
      if (newVal && newVal.type) {
        actionsTypeReactive[prop as string] = newVal.type
        obj[prop as keyof T] = newVal.value
      } else {
        actionsTypeReactive[prop as string] = 'default'
        obj[prop as keyof T] = newVal
      }
      return true
    }
  })

  // store onBoxValueChanged function, prevent form item refresh by function recreated
  const onBoxValueChangedStore: Record<string, any> = {}
  const onBoxValueChanged = (dataField: keyof T) => {
    onBoxValueChangedStore[dataField as string] = function (value: any) {
      formDataReactiveProxy[dataField] = { type: 'box-event', value: value } as const
    }
    return onBoxValueChangedStore[dataField as string]
  }

  const dataSourcesRef = useDataSources(options ? options.dataSources : undefined, formDataReactive)

  const [labelWidth, getLabelDefaultWidth] = useAutoLabelWidth(Object.keys(formData).length)

  const { validationMessages, validatorsFunctions, executeAllValidators, isRequiredItems, resetValidationMessages } =
    useValidators(options ? options.validators : undefined)

  const getFormOptions = function <K extends keyof T>(dataField: K): K extends DK ? ArrayItemOptions : CommonOptions {
    let formOptions: CommonOptions | ArrayItemOptions = {
      value: formDataReactive[dataField],
      onBoxValueChanged: onBoxValueChangedStore[dataField as string] ?? onBoxValueChanged(dataField),
      labelWidth: labelWidth.value,
      getLabelDefaultWidth: getLabelDefaultWidth,
      validationMessage: validationMessages[dataField as string],
      validator: validatorsFunctions[dataField as string],
      boxActionType: actionsTypeReactive[dataField],
      isRequired: isRequiredItems[dataField] ?? false
    }

    if (dataSourcesRef[dataField as string]) {
      formOptions = {
        ...formOptions,
        dataSource: dataSourcesRef[dataField as string].dataSource,
        valueExpr: dataSourcesRef[dataField as string].valueExpr,
        displayExpr: dataSourcesRef[dataField as string].displayExpr
      }
    }

    return formOptions as any
  }

  const onSubmit = function (callback: (data: typeof formDataReactive) => void) {
    // validate all validators
    if (executeAllValidators(formDataReactive)) {
      callback(formDataReactive)
    }
  }

  const clearFormData = function (data: Partial<typeof formData>) {
    for (const key in data) {
      if (Array.isArray(data[key])) {
        formDataReactiveProxy[key] = []
        continue
      }
      if (typeof data[key] === 'boolean') {
        formDataReactiveProxy[key] = false
        continue
      }
      if (typeof data[key] === 'string') {
        formDataReactiveProxy[key] = ''
        continue
      }
      formDataReactiveProxy[key] = undefined
    }
  }

  // reset form data / validate state
  const reset = function () {
    // reset will change formDataReactive twice to help value initialize
    clearFormData(defaultFormData)
    // prevent vue ignore value change
    setTimeout(() => {
      for (const key in defaultFormData) {
        formDataReactiveProxy[key] = defaultFormData[key]
      }
    })
    resetValidationMessages()
  }

  const set = async function (setData: Partial<typeof formData>) {
    // set will trigger formDataReactive update twice to help value initialize
    reset()
    // prevent vue ignore value change
    setTimeout(() => {
      for (const key in setData) {
        formDataReactiveProxy[key] = setData[key]
      }
    })
    resetValidationMessages()
  }

  return { value: formDataReactiveProxy, getFormOptions, onSubmit, reset, set } as const
}
