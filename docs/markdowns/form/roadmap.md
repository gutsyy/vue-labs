# 更新日志

## v 0.2.4

1. 支持配置表单确认和取消按钮的文案

```vue
<FormContainer confirmButtonName="确认" cancelButtonName="取消" />
```

2. `<TagBoxProxy />` 现已支持 `<DxTagBox />` 的全部配置

3. 修复了 `<TreeBoxProxy />` 配置 `DropDownBox.showClearButton` 时，清空逻辑缺失的问题

4. 支持对 `<TreeBoxProxy />` 中 DropDownBox 的配置，具体用例如下：

```vue
// 打开清空按钮，同时设置 dropdown 的宽度
// 理论上支持 DropDownBox 的全部配置 
// https://js.devexpress.com/Documentation/ApiReference/UI_Components/dxDropDownBox/Configuration/#dropDownOptions
<TreeBoxProxy 
    v-bind="form.getFormOptions('tree', {showClearButton: true, dropDownOptions: {width: 300}})" 
/>
```

## Todos

* 单个用户选择 \<user-select-proxy /\>

* 多用户选择 \<users-select-proxy /\>

* 表格选择 \<table-select-proxy /\>

* 动态表单项（可动态增加表单项）