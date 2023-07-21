import type { UnwrapRef } from 'vue'

type DataSourceAsync<T> = (data: T | UnwrapRef<T>) => Promise<any>

type DataSource<T, D = keyof T> = {
  dataSource: DataSourceAsync<T> | any[]
  dependencies?: D[]
  valueExpr?: string
  displayExpr?: string
}

export type DataSources<T extends Record<string, any>, DK extends keyof T> = {
  [k in DK]: DataSource<T>
}
