<script setup>
import FormContainerLayoutExample from '../../components/formContainerLayoutExample.vue'
import FormContainerLocaleExample from '../../components/formContainerLocaleExample.vue'
import '@gutsyy/labs-devextreme/style.css'
import 'devextreme/dist/css/dx.light.css'
</script>

# FormContainer 组件
> FormContainer 组件就是帮助快速包裹表单输入组件，提供布局和确认取消按钮，同时还可以将内部的代理组件中文化

::: warning 建议
布局的支持最好使用tailwindCSS，但不是必须，包中的样式集成了所需的 `tailwindCSS` 类选择器
:::

## 属性(Props)

### className

* Type: string

* Default: undefined

* 功能：注入class，例如覆盖 Grid 行间距 `className="grid-y-[1.125rem]"`

### cols

* Type: `2 | 4 | 6 | 12`

* Default: `2`

* 功能： 网格设置，规定纵向有几个网格

### show-confirm-button

* Type: `boolean`

* Default: true

* 功能：是否显示确认按钮

### confirm-button-class-name

* Type: `string`

* Default: `undefined`

* 功能：客制化确认按钮

### cancel-button-class-name

* Type: `string`

* Default: `undefined`

* 功能：客制化取消按钮

### show-cancel-button

* Type: `boolean`

* Default: true

* 功能：是否显示取消按钮

### @confirm

* Type: `(...args: any[]) => void`

* Default: `undefined`

* 功能：确认按钮的回调函数

### @cancel

* Type: `(...args: any[]) => void`

* Default: `undefined`

* 功能：取消按钮的回调函数

## 布局

<FormContainerLayoutExample />

:::details 显示代码

```vue
<template>
  <FormContainer cols="4" :showCancelButton="false" :showConfirmButton="false">
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy class="col-span-2"></TextBoxProxy>
    <TextBoxProxy class="col-span-2"></TextBoxProxy>
    <TextBoxProxy class="col-span-4"></TextBoxProxy>
  </FormContainer>
</template>

<script setup>
import { FormContainer, TextBoxProxy } from '@gutsyy/labs-devextreme'
import '@gutsyy/labs-devextreme/style.css'
</script>
```
:::

