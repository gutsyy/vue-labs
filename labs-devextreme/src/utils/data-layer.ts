import ArrayStore from 'devextreme/data/array_store'

export const createArrayStore = function (key: string, arr: any[]) {
  return new ArrayStore({
    key: key,
    data: arr
  })
}
