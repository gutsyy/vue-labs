import { toRaw } from 'vue'

// 用来tagBox的添加item和删除item
export function calCurrItems(
  arr: any[],
  addItems: any[],
  removedItems: any[],
  valueExpr: string = ''
) {
  let _arr: any[] = arr
  // 处理addItems
  if (addItems.length) {
    if (_arr.length && typeof toRaw(arr[0]) !== typeof addItems[0]) {
      _arr = [...addItems]
    } else {
      const valueArr = valueExpr ? _arr.map((ele) => ele[valueExpr]) : _arr
      addItems.forEach((ele) => {
        if (!valueArr.includes(valueExpr ? ele[valueExpr] : ele)) {
          _arr.push(toRaw(ele))
        }
      })
    }
  }

  if (removedItems.length) {
    const valueArr = removedItems.map((ele) => (valueExpr ? ele[valueExpr] : ele))
    _arr = _arr.filter((ele) => {
      return !valueArr.includes(valueExpr ? ele[valueExpr] : ele)
    })
  }

  return _arr
}
