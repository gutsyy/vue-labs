import { createArrayStore } from '@/utils/data-layer'
import type ArrayStore from 'devextreme/data/array_store'
import { type UnwrapRef } from 'vue'
import { ref, watch } from 'vue'

type DataSourceAsync<T> = (data: T | UnwrapRef<T>) => Promise<any>

type DataSource<T, D> = {
  dataSource: DataSourceAsync<T> | any[]
  dependencies?: D[]
  valueExpr?: string
  displayExpr?: string
}

type DataSources<T, D, DK extends keyof T> = {
  [k in DK]?: DataSource<T, D>
}

type ValidatorFn<T> = (value: T) => string | null

export function useForm<T extends Record<string, any>, D extends keyof T, DK extends keyof T>(
  formData: T,
  // 能不能通过denpendencies的输入进一步约束D?
  options?: {
    dataSources?: DataSources<T, D, DK>
    validators?: {
      [k in keyof T]?: 'isRequired' | ValidatorFn<T[k]>
    }
  }
) {
  const formDataRef = ref<T>(formData)

  // fetch data
  type DataSourceRef = {
    [K in string]?: any[] | ArrayStore<any, any> | undefined
  }

  const dataSourceRef = ref<DataSourceRef>({})

  const dataSources = options && options.dataSources ? options.dataSources : undefined

  if (dataSources) {
    for (const [dataField, _dataSourceDefine] of Object.entries(dataSources)) {
      const dataSourceDefine = _dataSourceDefine as DataSource<T, D>
      // pure data array
      if (Array.isArray(dataSourceDefine.dataSource)) {
        dataSourceRef.value[dataField] = dataSourceDefine.dataSource
      }
      // async api function
      else {
        const fetchData = () => {
          const asyncFn = dataSourceDefine.dataSource as DataSourceAsync<T>
          asyncFn(formDataRef.value).then((data: any) => {
            dataSourceRef.value[dataField] = Array.isArray(data)
              ? dataSourceDefine.valueExpr
                ? createArrayStore(dataSourceDefine.valueExpr, data)
                : data
              : undefined
          })
        }
        // 首次获取数据
        fetchData()
        // 创建监听器
        const { dependencies } = dataSourceDefine
        if (dependencies) {
          dependencies.forEach((d) => {
            watch(
              () => formDataRef.value[d as keyof UnwrapRef<T>],
              () => fetchData()
            )
          })
        }
      }
    }
  }

  // store onBoxValueChanged function, prevent form item refresh by function recreated
  const onBoxValueChangedStore: Record<string, any> = {}
  const onBoxValueChanged = (dataField: keyof T) => {
    onBoxValueChangedStore[dataField as string] = function (value: any) {
      formDataRef.value[dataField as keyof UnwrapRef<T>] = value
    }
    return onBoxValueChangedStore[dataField as string]
  }

  // label width
  let gotLabelWidthNumber: number = 0
  let maxLabelWidthNumber: number = 0

  const labelWidth = ref<number>(0)

  const getLabelDefaultWidth = function (width: number) {
    if (gotLabelWidthNumber === Object.keys(formData).length - 1) {
      labelWidth.value = maxLabelWidthNumber
    }
    if (width > maxLabelWidthNumber) maxLabelWidthNumber = width
    gotLabelWidthNumber++
  }

  // validators
  const validationMessages = ref<Record<string, string | null>>({})

  // initialization ref
  Object.keys(formData).forEach((key) => (validationMessages.value[key] = null))

  const isRequiredValidator = function (value: any) {
    if (Array.isArray(value)) {
      return value.length ? null : '此项不能为空'
    }
    return value || value === 0 ? null : '此项不能为空'
  }

  const getValidatorByDataField = (
    dataField: string
  ): ((value: any) => string | null) | undefined => {
    if (options && options.validators) {
      if (options.validators[dataField] === 'isRequired') {
        return isRequiredValidator
      }
      return options.validators[dataField] as ((value: any) => string | null) | undefined
    }
  }

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

  const getFormOptions = function <K extends keyof T>(
    dataField: K
  ): K extends DK ? ArrayItemOptions : CommonOptions {
    let formOptions: CommonOptions | ArrayItemOptions = {
      value: formDataRef.value[dataField as keyof UnwrapRef<T>],
      onBoxValueChanged:
        onBoxValueChangedStore[dataField as string] ?? onBoxValueChanged(dataField),
      labelWidth: labelWidth.value,
      getLabelDefaultWidth: getLabelDefaultWidth,
      validationMessage: validationMessages.value[dataField as string],
      validator: getValidatorByDataField(dataField as string)
    }

    if (dataSources && Object.keys(dataSources).includes(dataField as string)) {
      formOptions = {
        ...formOptions,
        dataSource: dataSourceRef.value[dataField as string] ?? undefined,
        valueExpr: (dataSources[dataField] as any).valueExpr ?? undefined,
        displayExpr: (dataSources[dataField] as any).displayExpr ?? undefined
      }
    }

    return formOptions as any
  }

  const onSubmit = function (callback: (data: typeof formDataRef.value) => void) {
    // validate
    if (options && options.validators) {
      Object.keys(formData).forEach((key) => {
        if (getValidatorByDataField(key)) {
          validationMessages.value[key as string] = getValidatorByDataField(key)!(
            formDataRef.value[key]
          )
        }
      })
    }
    for (const key of Object.keys(validationMessages)) {
      if (validationMessages.value[key] === 'string') {
        return
      }
    }

    callback(formDataRef.value)
  }

  return { value: formDataRef.value, dataSourceRef, getFormOptions, onSubmit } as const
}
