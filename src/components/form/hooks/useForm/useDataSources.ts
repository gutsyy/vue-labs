/**
 * only created / used in useForm hook
 * create and return a dataSources<datafield, {dataSource: any[], valueExpr: string | undefined, displayExpr: string | undefined }> ref
 * create watch event to refresh datasource by dependencies
 * gutsyy 2023-07-21 created
 */

import type { UnwrapRef } from 'vue'

type DataSourceAsync<T> = (data: T | UnwrapRef<T>) => Promise<any>

type DataSource<T, D = keyof T> = {
  dataSource: DataSourceAsync<T> | any[]
  dependencies?: D[]
  valueExpr?: string
  displayExpr?: string
}

export type DataSources<T extends Record<string, any>, DK extends keyof T> = Record<DK, DataSource<T>>

import { ref, type Ref, watch } from 'vue'
import { createArrayStore } from '@/utils/data-layer'
import type ArrayStore from 'devextreme/data/array_store'

export function useDataSources<T extends Record<string, any>, DK extends keyof T>(
  dataSources: DataSources<T, DK> | undefined,
  formData: Ref<UnwrapRef<T>>
) {
  dataSources = dataSources ?? ({} as DataSources<T, DK>)

  const dataSourcesRef = ref<
    Record<
      string,
      {
        dataSource: any[] | ArrayStore<any, any>
        valueExpr: string | undefined
        displayExpr: string | undefined
      }
    >
  >(
    Object.keys(dataSources).reduce((prev, key) => {
      return { ...prev, [key]: [] }
    }, {})
  )

  for (const key in dataSources) {
    const { dataSource, dependencies, valueExpr, displayExpr } = dataSources[key]

    dataSourcesRef.value[key].valueExpr = valueExpr
    dataSourcesRef.value[key].displayExpr = displayExpr

    const getDataAsync = Array.isArray(dataSource) ? () => new Promise((resolve) => resolve(dataSource)) : dataSource

    const createStoreIfNecessary = (data: any[]) => {
      if (valueExpr) {
        return createArrayStore(valueExpr, data)
      }
      return data
    }

    const fetchDataSaved = (asyncFn: (t: UnwrapRef<T>) => Promise<any>) => {
      asyncFn(formData.value).then((data: any) => {
        dataSourcesRef.value[key].dataSource = Array.isArray(data) ? createStoreIfNecessary(data) : []
      })
    }

    fetchDataSaved(getDataAsync)

    if (dependencies) {
      for (const dependency of dependencies) {
        watch(
          () => formData.value[dependency as keyof UnwrapRef<T>],
          () => fetchDataSaved(getDataAsync)
        )
      }
    }
  }

  return dataSourcesRef
}
