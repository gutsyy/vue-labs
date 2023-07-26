<script setup>
import "@gutsyy/labs-devextreme/style.css"
import FormPopupContainerExample from '../../components/formPopupContainerExample.vue'
</script>

# FormPopupContainer 组件

> FormPopupContainer 组件是使用 `DxPopup` 对 `FormContainer` 进行的包裹，方便弹窗使用

## 属性(Props)

`typeof dxPopup` & [FormContainer.Props](./formContainer.md#属性props)

:::tip 提示
在设置了 `PopupContainer` 的 `@hidden` 属性后，不用再设置 `@cancel` 属性
:::

## 示例

<FormPopupContainerExample />

:::details 显示代码 
```vue
<template>
  <div class="container">
    <div class="button" @click="onOpen">打开表单</div>
  </div>
  <FormPopupContainer
    width="40vw"
    :visible="formVis"
    title="表单"
    @hidden="onClose"
  >
    <TextBoxProxy class="col-span-2" label-text="姓名"></TextBoxProxy>
  </FormPopupContainer>
</template>

<script setup>
import { FormPopupContainer, TextBoxProxy } from '@gutsyy/labs-devextreme'
import { ref } from 'vue'

const formVis = ref(false)

const onClose = function () {
  formVis.value = false
}

const onOpen = function () {
  formVis.value = true
}
</script>
```
:::