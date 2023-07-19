import type { Properties as TextOptions } from 'devextreme/ui/text_box'
import type { Properties as NumberOptions } from 'devextreme/ui/number_box'
import type { Properties as SelectOptions } from 'devextreme/ui/select_box'
import type { Properties as DateOptions } from 'devextreme/ui/date_box'
import type { Properties as TagBoxOptions } from 'devextreme/ui/tag_box'
import type { ComputedRef, Ref } from 'vue'

type FormTypes = 'date' | 'number' | 'select' | 'text' | 'slot' | 'tag'

interface SelectOptionsCorrect extends SelectOptions {
  valueExpr: string
}

export type OptionsByFormType = {
  date: DateOptions | ComputedRef<DateOptions> | Ref<DateOptions>
  select: SelectOptionsCorrect
  text: TextOptions | ComputedRef<TextOptions> | Ref<TextOptions>
  number: NumberOptions | ComputedRef<NumberOptions> | Ref<NumberOptions>
  tag: TagBoxOptions
}

type GetAsyncItems = () => readonly [(...args: any[]) => Promise<unknown>, string[]]

export function getAsyncItems(
  asyncFn: (...args: any[]) => Promise<unknown>,
  dependencies: string[] = []
): GetAsyncItems {
  return () => [asyncFn, dependencies ?? []] as const
}

export function getFormItemByDataField<F extends FormItemsConfs<T>, T extends FormTypes[]>(
  formItems: F,
  dataField: string
) {
  return formItems.filter((items) => items.dataField === dataField)
}

export type FormItemConf<T extends FormTypes, D = string> = {
  label: string
  colSpan?: 1 | 2 | 3 | 4 | 6 | 12
  dataField: D
  type: T
  /** Dev组件配置选项 */
  // options?: OptionsByFormType[T extends keyof OptionsByFormType ? T : 0]
  options?: T extends keyof OptionsByFormType ? OptionsByFormType[T] : Record<PropertyKey, any>
  // 刷新依赖，当元组中的值发生变化，该输入框刷新
  refreshDependencies?: D[]
  // 当值变化时的回调函数
  onValueChanged?: (value: any) => void
} & (T extends 'slot' ? { slotName: string } : { slotName?: undefined }) &
  (T extends 'select' | 'tag' ? { items: Array<any> | GetAsyncItems } : { items?: undefined })

/** 可以使用元组来进一步约束类型
 * 示例：FormItemsConfs<['text', 'date']> */
export type FormItemsConfs<T extends readonly FormTypes[] = FormTypes[], D = string> = {
  [K in keyof T]: FormItemConf<T[K], D>
}
