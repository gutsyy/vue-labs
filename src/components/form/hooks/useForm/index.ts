/**
 * useForm
 * help create devExtreme form quickly
 * integrated lots of form logic
 * gutsyy 2023-07-20 created
 */

import { type UnwrapRef } from 'vue'
import { ref } from 'vue'
import type { DataSources } from './types'
import { useDataSources } from './useDataSources'
import { useAutoLabelWidth } from './useAutoLabelWidth'
import { useValidators, type Validator } from './useValidators'

// return options
type CommonOptions = {
  value: any
  onBoxValueChanged: (value: any) => void
  labelWidth: UnwrapRef<number>
  getLabelDefaultWidth: (w: number) => void
  validationMessage: string | null
  validator: any
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
      [k in VK]: Validator
    }
  }
) {
  const formDataRef = ref(formData)

  // store onBoxValueChanged function, prevent form item refresh by function recreated
  const onBoxValueChangedStore: Record<string, any> = {}
  const onBoxValueChanged = (dataField: keyof T) => {
    onBoxValueChangedStore[dataField as string] = function (value: any) {
      formDataRef.value[dataField as keyof UnwrapRef<T>] = value
    }
    return onBoxValueChangedStore[dataField as string]
  }

  const dataSourcesRef = useDataSources(options ? options.dataSources : undefined, formDataRef)

  const [labelWidth, getLabelDefaultWidth] = useAutoLabelWidth(Object.keys(formData).length)

  const { validationMessages, validatorsFunctions, executeAllValidators } = useValidators(
    options ? options.validators : undefined
  )

  const getFormOptions = function <K extends keyof T>(dataField: K): K extends DK ? ArrayItemOptions : CommonOptions {
    let formOptions: CommonOptions | ArrayItemOptions = {
      value: formDataRef.value[dataField as keyof UnwrapRef<T>],
      onBoxValueChanged: onBoxValueChangedStore[dataField as string] ?? onBoxValueChanged(dataField),
      labelWidth: labelWidth.value,
      getLabelDefaultWidth: getLabelDefaultWidth,
      validationMessage: validationMessages.value[dataField as string],
      validator: validatorsFunctions[dataField as string]
    }

    if (dataSourcesRef.value[dataField as string]) {
      formOptions = {
        ...formOptions,
        dataSource: dataSourcesRef.value[dataField as string].dataSource,
        valueExpr: dataSourcesRef.value[dataField as string].valueExpr,
        displayExpr: dataSourcesRef.value[dataField as string].displayExpr
      }
    }

    return formOptions as any
  }

  const onSubmit = function (callback: (data: typeof formDataRef.value) => void) {
    // validate
    if (executeAllValidators(formDataRef.value)) {
      callback(formDataRef.value)
    }
  }

  return { value: formDataRef.value, getFormOptions, onSubmit } as const
}
