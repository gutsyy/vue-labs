import { computed } from 'vue'

/**
 * devextreme 处理prop值为undefined时，会发生报错
 */
export function removeUndefinedProps(props: Record<PropertyKey, any>) {
  return computed(() => {
    return Object.entries(props).reduce<Record<PropertyKey, any>>((prev, curr) => {
      if (curr[1] === undefined) {
        return { ...prev }
      }
      return { ...prev, [curr[0]]: curr[1] }
    }, {})
  })
}
