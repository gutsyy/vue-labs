<template>
  <form :class="`m-4 grid grid-cols-${props.colSpan} gap-2`">
    <template v-for="(itemConf, index) in props.itemsConfs">
      <div
        v-if="itemConf.type === 'text'"
        :class="`col-span-${itemConf.colSpan ?? 2}`"
        v-bind:key="`text-box-${index}`"
      >
        <TextBoxProxy
          :label="itemConf.label"
          :value="formData[itemConf.dataField]"
          :onValueChanged="onValueChangedEventMap[itemConf.dataField]"
          v-bind="(isRef(itemConf.options) ? itemConf.options.value : itemConf.options as OptionsByFormType['date'])"
        ></TextBoxProxy>
      </div>
      <div
        v-else-if="itemConf.type === 'number'"
        :class="`col-span-${itemConf.colSpan ?? 2}`"
        v-bind:key="`number-box-${index}`"
      >
        <NumberBoxProxy
          :value="formData[itemConf.dataField]"
          :on-value-changed="onValueChangedEventMap[itemConf.dataField]"
          v-bind="(isRef(itemConf.options) ? itemConf.options.value : itemConf.options as OptionsByFormType['date'])"
        ></NumberBoxProxy>
      </div>
      <div
        v-else-if="itemConf.type === 'select'"
        :class="`col-span-${itemConf.colSpan ?? 2}`"
        v-bind:key="`select-box-${index}`"
      >
        <SelectBoxProxy
          :value="formData[itemConf.dataField]"
          :data-source="itemsRepo[itemConf.dataField]"
          :on-selection-changed="onSelectionChangedEventMap[itemConf.dataField]"
          v-bind="(itemConf.options as OptionsByFormType['select'])"
        ></SelectBoxProxy>
      </div>
      <div
        v-else-if="itemConf.type === 'date'"
        :class="`col-span-${itemConf.colSpan ?? 2}`"
        v-bind:key="`date-box-${index}`"
      >
        <DateBoxProxy
          :value="formData[itemConf.dataField]"
          :on-value-changed="onValueChangedEventMap[itemConf.dataField]"
          v-bind="(isRef(itemConf.options) ? itemConf.options.value : itemConf.options as OptionsByFormType['date'])"
        ></DateBoxProxy>
      </div>
      <div
        v-else-if="itemConf.type === 'tag'"
        :class="`col-span-${itemConf.colSpan ?? 2}`"
        v-bind:key="`tag-box-${index}`"
      >
        <TagBoxProxy
          :value="formData[itemConf.dataField]"
          :data-source="itemsRepo[itemConf.dataField]"
          :on-selection-changed="onSelectionChangedEventMap[itemConf.dataField]"
          v-bind="(itemConf.options as OptionsByFormType['tag'])"
        ></TagBoxProxy>
      </div>
    </template>
    <div :class="`flex justify-end col-span-${props.colSpan} pt-2`">
      <DxButton :width="128" type="default">确认</DxButton>
      <DxButton :class="'ml-2'" :width="128">取消</DxButton>
    </div>
  </form>
</template>

<script lang="ts" setup>
import type { ValueChangedEvent } from 'devextreme/ui/text_box'
import type { FormItemsConfs, OptionsByFormType, FormItemConf } from './types'
import DateBoxProxy from './proxy/date-box-proxy.vue'
import NumberBoxProxy from './proxy/number-box-proxy.vue'
import SelectBoxProxy from './proxy/select-box-proxy.vue'
import TextBoxProxy from './proxy/text-box-proxy.vue'
import TagBoxProxy from './proxy/tag-box-proxy.vue'
import { onMounted, ref, watch, computed, isRef, toRaw, isProxy } from 'vue'
import type { SelectionChangedEvent } from 'devextreme/ui/select_box'
import type { SelectionChangedEvent as TagSelectionChangedEvent } from 'devextreme/ui/tag_box'
import { createArrayStore } from '@/utils/data-layer'
import { DxButton } from 'devextreme-vue'
import { calCurrItems } from './utils'

const props = withDefaults(
  defineProps<{
    itemsConfs: FormItemsConfs
    colSpan?: 2 | 6 | 12
    formData: Record<string, any>
  }>(),
  {
    colSpan: 2
  }
)

// 存储数据源，如selectbox的数据源
const itemsRepo = ref<Record<string, any>>({})
// 拿取所有数组形式的数据源，并监听数据源的依赖值，如依赖值发生变化，重新获取数据源
onMounted(() => {
  for (const itemConf of props.itemsConfs) {
    if (itemConf.items) {
      if (Array.isArray(itemConf.items)) {
        itemsRepo.value[itemConf.dataField] = itemConf.items
      } else {
        const [asyncGetData, dependencies] = itemConf.items()
        const setDataSource = () =>
          asyncGetData(
            dependencies.reduce<Record<string, any>>((prev, curr) => {
              return { ...prev, [curr]: props.formData[curr] }
            }, {})
          ).then((data) => {
            if (Array.isArray(data)) {
              itemsRepo.value[itemConf.dataField] =
                itemConf.options && (itemConf.options as OptionsByFormType['select']).valueExpr
                  ? createArrayStore(
                      (itemConf.options as OptionsByFormType['select']).valueExpr,
                      data
                    )
                  : data
            }
          })
        setDataSource()

        // 创建watch监听器
        dependencies.forEach((d) => {
          const dependency = computed(() => props.formData[d])
          watch(dependency, () => {
            setDataSource()
          })
        })
      }
    }
  }
})

// 双向绑定
const emit = defineEmits(['update:formData'])

// 双向绑定，创建一个事件Map，防止函数动态创建导致异常刷新
const onValueChangedEventMap = props.itemsConfs.reduce<
  Record<string, (e: ValueChangedEvent) => void>
>((prev, curr) => {
  return {
    ...prev,
    [curr.dataField]: (e: ValueChangedEvent) => {
      emit('update:formData', { ...props.formData, [curr.dataField]: e.value })
      // 使用settimeout防止修改formData.value时，被忽略的问题，具体原因暂未知
      setTimeout(() => {
        if (curr.onValueChanged) {
          curr.onValueChanged(e.value)
        }
      })
    }
  }
}, {})

// selectBox 选择时的事件函数，此处是生成事件函数
const genSelectBoxSelectionChanged = function (itemConf: FormItemConf<'select'>) {
  return (e: SelectionChangedEvent) => {
    emit('update:formData', { ...props.formData, [itemConf.dataField]: e.selectedItem })
    if (itemConf.onValueChanged && e.selectedItem) {
      setTimeout(() => itemConf.onValueChanged!(e.selectedItem))
    }
  }
}

// tagBox 选择时的事件函数，此处是生成事件函数
const genTagBoxSelectionChanged = function (itemConf: FormItemConf<'tag'>) {
  return (e: TagSelectionChangedEvent) => {
    // 由于dev只传递addedItems和removedItems，而不会返回当前选中的所有items，因此通过calCurrItems来进行计算
    const allSelectedItem = calCurrItems(
      props.formData[itemConf.dataField],
      // dev中返回的选择对象是proxy，此处进行toRaw操作，解除proxy
      e.addedItems.map((item) => (isProxy(item) ? toRaw(item) : item)),
      e.removedItems.map((item) => (isProxy(item) ? toRaw(item) : item)),
      itemConf.options && itemConf.options.valueExpr ? (itemConf.options.valueExpr as string) : ''
    )
    emit('update:formData', { ...props.formData, [itemConf.dataField]: allSelectedItem })
    if (itemConf.onValueChanged && allSelectedItem) {
      setTimeout(() => itemConf.onValueChanged!(toRaw(allSelectedItem.map((ele) => toRaw(ele)))))
    }
  }
}

// 双向绑定，创建一个map来存储事件函数，类似于callback，防止动态创建导致异常刷新
const onSelectionChangedEventMap = props.itemsConfs.reduce<Record<string, (e: any) => void>>(
  (prev, curr) => {
    if (['select'].includes(curr.type)) {
      return {
        ...prev,
        [curr.dataField]: genSelectBoxSelectionChanged(curr as FormItemConf<'select'>)
      }
    }
    if (curr.type === 'tag') {
      return {
        ...prev,
        [curr.dataField]: genTagBoxSelectionChanged(curr as FormItemConf<'tag'>)
      }
    }
    return { ...prev }
  },
  {}
)
</script>
