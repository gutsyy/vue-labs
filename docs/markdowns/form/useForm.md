<script setup>
import UseFormExample from '../../components/useFormExample.vue'
import '@gutsyy/labs-devextreme/style.css'
</script>

# useForm

::: danger 注意
useForm 只能对 [代理后的组件](/form/proxyComponents) 使用，不能直接用于 Dev组件！
:::

`useForm` 是一个hook函数，内部封装了表单所需的业务逻辑，包括:

* 数据的双向绑定
* 数据源的获取
* 数据源的刷新
* 数据校验

## Params 参数

### 类型

```ts
<T extends string>(
    // 表单数据
    formData: Record<T, any>, 
    // 可选项
    options?: { 
        // 向某些字段配置数据源
        dataSources: {
            [key in T]?: { 
                // 获取数据源的异步函数
                dataSource?: (formData) => Promise<any[]> | any[], 
                // 依赖数组，当依赖中的表单数据变化时，刷新数据源
                dependencies?: T[], 
                // 当数据源为对象数组时，配置valueExpr，如id
                valueExpr?: string, 
                // 当数据源为对象数组时，配置displayExpr，如name
                displayExpr?: string 
            }
        },
        // 校验规则配置
        validators: {
            // 为指定字段配置多个校验函数，校验函数返回null为合法，返回string为非法
            // 'isRequired' 是使用内置校验函数
            [key in T]?: ((value) => null | string) | 'isRequired'[]
        }
    }
)
```

## dataSources 数据源配置

> 配置如下拉选择框的数据源对象 `key` 为formData的字段名，`value` 为 `dataSource` `dependencies` `valueExpr` `displayExpr` 四个可选属性对象

### dataSource 数据源

Type: `((formData) => Promise<any[]>) | any[]`

获取数据的异步函数，也可以直接给数组，同时该函数接受表单数据，来帮助数据获取

### dependencies (optional) 依赖字段

Type: `(keyof FormData)[]`

依赖的字段名数组，当依赖的字段数据发生变化，数据源刷新

### valueExpr (optional) 

Type: `string`

如果数据源是对象数组，需指定一个字段为valueExpr，来保证 `useForm` 正常运行，但不会影响选择值的获取，在 `useForm` 中，如果数据源为对象数组，选择值同样也为对象

:::danger 重要概念
在 `useForm` 中，如果数据源为对象数组，选择值同样也为对象
:::

### displayExpr (optional)

Type: `string`

如果数据源是对象数组，指定对象中其中一个字段为显示字段

## validators

> 数据校验的对象，`key` 为formData的字段名，`value` 为一个数组

validators的值接受一个数组，数组中可以是预设规则字符串或是 [校验函数](#校验函数)，在执行 `form.onSubmit()` 的时候，字段数据必须满足数组中所有规则才合法，只有所有字段通过校验，才能执行回调函数

## 校验函数

* Type: `(value) => null | string`

接收数据，如果符合规则，则校验函数返回 `null`，否则返回错误信息 `errorMessage`

```js
const validate = function(value) { 
    if (value < 99) { 
        return null
    }
    return '超过范围'
}

```

## Return 返回对象

### 类型

```ts
(formData: FormData) => (
    { 
        // 表单数据的响应式变量，实现了双向绑定
        value: ShadowReactive<FormData>,
        // 该函数返回options用于配置formItems
        getFormOptions: (dataField: keyof T) => FormItemOptions
        // submit函数，用于数据提交
        onSubmit: (callback: (formData) => void) => void
        // 重置表单数据至默认值，并重置校验错误信息
        reset: () => void
        // 批量修改表单数据，同时可以set其他数据，方便onSubmit函数使用，如修改表单中id字段数据
        set: (setData: FormData & Record<string, any>) => void
    } as const 
)
```

## form.value 
Type: `ShallowReactive<FormData>`   

表单数据的响应式变量，实现了双向绑定，可以通过直接修改它来外部修改表单状态

```js
form.value.name = 'vue'
```

或用于绑定其他属性，如日期组件的输入范围

```vue
<DateBoxProxy :max="form.value.ddl" />
```

## form.reset()

Type: `() => void`

用来重置表单数据，同时清除错误信息

## form.set(setData)

Type: `(setData: {[k in keyof FormData]: any} & Record<string, any>) => void`

用来修改 `useForm` 中的表单数据，常用于修改状态时的数据初始化，同时可以冗余其他字段，方便 `onSubmit` 时使用，如在修改状态下，冗余进 `id` 字段

## form.onSubmit(callback)

Type: `(callback: (formData) => void ) => void`

用于表单提交，提交前根据配置的 [validators](#validators) 进行数据校验，如果校验失败，`callback` 回调函数不会执行

## form.getFormOptions(dataField)

Type: `(dataField: keyof FormData) => FormOptions`

用于表单组件的绑定

```vue
<TextBoxProxy v-bind="form.getFormOptions('name')"></TextBoxProxy>
```

## 简单示例

<UseFormExample />

::: details 显示代码

```vue
<template>
    <SelectBoxProxy label-text="技术栈" v-bind="form.getFormOptions('stack')"></SelectBoxProxy>
</template>

<script setup lang='ts'>
import { useForm, SelectBoxProxy } from '@gutsyy/labs-devextreme'

// 测试数据源
const getTestData = () =>
  new Promise((resolve) => {
    setTimeout(() =>
      resolve([
        { id: 0, name: 'vue' },
        { id: 1, name: 'react' }
      ])
    )
  })

const form = useForm(
  { stack: '' },
  {
    dataSources: {
      stack: {
        dataSource: getTestData,
        valueExpr: 'id',
        displayExpr: 'name'
      }
    },
    validators: {
      stack: ['isRequired']
    }
  }
)
</script>
```

:::

你可以尝试在 **form-data** 输入框中修改数据，来改变选择框中的选项，如修改成 `{"stack": 0}` 或 `{"stack":{"id":1}}`，选择框都能正确的进行数据初始化

::: tip 小提示
`v-bind="form.getFormOptions('stack')"` 是批量绑定 [代理组件](/form/proxyComponents) 属性，来实现表单的逻辑
:::
