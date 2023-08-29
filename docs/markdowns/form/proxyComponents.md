# 代理输入组件

> 代理输入组件通过包装DevExtreme的相关输入组件，预设一些逻辑或是属性，来更方便的使用组件，这里的目的主要是配合 `useForm` 

## 什么是代理组件?

代理组件是指对UI库中的组件进行包装和属性预设，方便使用，更强大的代理组件可以统一属性和接口，来替换掉底层的UI库

## 属性 (Props)

代理组件的属性由 `dev组件` 自身的属性和 **代理属性** 组成，不同的代理组件之间略有差异

主要的 **代理属性** 如下：

### label-text

* Type: `string`

* 功能： 用于水平放置 Label，以及定义 Label 的文字

### label-width 

* Type: `number`

* 功能：用于定义 Label 的宽度

### is-required

* Type: `boolean`

* 功能：Label 中必须标记是否显示

### on-box-value-changed

* Type: `(value) => void`

* 功能：改善后的`valueChanged`函数，用于获取输入值

## 已代理的输入组件

::: danger 注意
代理后的组件都不能再使用 `v-model` 进行双向绑定
:::

### text-box-proxy

* value: `string`

* Props: `<type of dxTextBox>` & [ProxyProps](#属性-props)

* 功能：代理 `DxTextBox`

### textarea-box-proxy

* Props: `typeof dxTextareaBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxTextareaBox`

### check-box-proxy

* value: `string | number`

* Props: `typeof dxCheckBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxCheckBox`

### date-box-proxy

* value: `string | null`

* Props: `typeof dxDateBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxDateBox`

:::danger 注意
\<date-box-proxy /\> 默认值要使用 `null`，使用空字符串会导致一些问题，无法正常使用
:::

### number-box-proxy

* value: `number | null`

* Props: `typeof dxNumberBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxNumberBox`

### radio-box-proxy

* value: `number | string`

* Props: `typeof dxRadioNumberBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxRadioBox`

### select-box-proxy

* value: `number | string | object`

* Props: `typeof dxSelectBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxSelectBox`，用于单选

### tag-box-proxy

* value: `(string | number | object)[]`

* Props: `typeof dxTagBox` & [ProxyProps](#属性-props)

* 功能：代理 `DxTagBox`，用于多选

### tree-box-proxy

* value: `(string | number | object)[]`

* Props: `typeof dxTreeView` & [ProxyProps](#属性-props)

* 功能：通过 `DxDropdownBox` 和 `DxTreeView` 实现树形选择，支持单多选

:::tip 为什么 \<tree-box-proxy /\> & \<tag-box-proxy /\> 可以使用 `string | number` 进行初始化？
一般来说，item 的数据格式都是 Object，但很多场景中，我们需要初始选择，但我们前端可能只有 id 字段的值，这时可以直接设置 id 的值作为初始值，组件会在获取数据源后，自动根据 id 进行默认选择
:::