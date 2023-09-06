/**
 * only created / used in useForm hook
 * create and return a dataSources<datafield, {dataSource: any[], valueExpr: string | undefined, displayExpr: string | undefined }> ref
 * create watch event to refresh datasource by dependencies
 * gutsyy 2023-07-21 created
 */

import type { ShallowReactive } from 'vue'

type DataSourceAsync<T> = (data: T | ShallowReactive<T>) => Promise<any>

type DataSource<T, D = keyof T> = {
  dataSource: DataSourceAsync<T> | any[]
  dependencies?: D[]
  valueExpr?: string
  displayExpr?: string
}

export type DataSources<T extends Record<string, any>, DK extends keyof T> = Record<DK, DataSource<T>>

import { reactive, watch } from 'vue'
import { createArrayStore } from '@/utils/data-layer'
import type ArrayStore from 'devextreme/data/array_store'

export function useDataSources<T extends Record<string, any>, DK extends keyof T>(
  dataSources: DataSources<T, DK> | undefined,
  formData: ShallowReactive<T>
) {
  dataSources = dataSources ?? ({} as DataSources<T, DK>)

  const dataSourcesRef = reactive<
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

  const getAsyncDatasourceMap: Record<string, () => Promise<boolean>> = {}

  for (const key in dataSources) {
    const { dataSource, dependencies, valueExpr, displayExpr } = dataSources[key]

    dataSourcesRef[key].valueExpr = valueExpr
    dataSourcesRef[key].displayExpr = displayExpr

    const getDataAsync = Array.isArray(dataSource) ? () => new Promise((resolve) => resolve(dataSource)) : dataSource

    const createStoreIfNecessary = (data: any[]) => {
      if (valueExpr) {
        return createArrayStore(valueExpr, data)
      }
      return data
    }

    const fetchDataSaved = (asyncFn: (t: ShallowReactive<T>) => Promise<any>) => {
      return new Promise<boolean>((resolve) => {
        asyncFn(formData).then((data: any) => {
          dataSourcesRef[key].dataSource = Array.isArray(data) ? createStoreIfNecessary(data) : []
          resolve(true)
        })
      })
    }

    if (Array.isArray(dataSource)) {
      fetchDataSaved(getDataAsync)
    } else {
      getAsyncDatasourceMap[key] = () => fetchDataSaved(getDataAsync)
    }

    if (dependencies) {
      for (const dependency of dependencies) {
        watch(
          () => formData[dependency],
          () => fetchDataSaved(getDataAsync)
        )
      }
    }
  }

  return { dataSourcesRef, getAsyncDatasourceMap } as const
}
