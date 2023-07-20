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

export function useForm<T extends Record<string, any>, D extends keyof T, DK extends keyof T>(
  formData: T,
  // 能不能通过denpendencies的输入进一步约束D?
  dataSources?: DataSources<T, D, DK>
) {
  const formDataRef = ref<T>(formData)

  type DataSourceRef = {
    [K in string]?: any[] | ArrayStore<any, any> | undefined
  }

  const dataSourceRef = ref<DataSourceRef>({})

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

  type CommonOptions = {
    value: any
    onBoxValueChanged: (value: any) => void
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
    if (dataSources && Object.keys(dataSources).includes(dataField as string)) {
      return {
        value: formDataRef.value[dataField as keyof UnwrapRef<T>],
        dataSource: dataSourceRef.value[dataField as string] ?? undefined,
        onBoxValueChanged:
          onBoxValueChangedStore[dataField as string] ?? onBoxValueChanged(dataField),
        valueExpr: (dataSources[dataField] as any).valueExpr ?? undefined,
        displayExpr: (dataSources[dataField] as any).displayExpr ?? undefined
      } as any
    }

    return {
      value: formDataRef.value[dataField as keyof UnwrapRef<T>],
      onBoxValueChanged: onBoxValueChangedStore[dataField as string] ?? onBoxValueChanged(dataField)
    } as any
  }

  return { value: formDataRef.value, dataSourceRef, getFormOptions } as const
}
