# 更新日志

## v 0.2.5

💡 更新了表单数据源获取方式，现在可以做到三种场景的配置

**场景一：无任何特殊配置（默认推荐 & 最稳定）**

  这种情况下，数据源在执行useForm时加载，且全周期不会刷新（依赖刷新除外）

::: tip 为什么推荐场景一
场景一在页面加载时就准备好了表单的一切数据，当用户点击打开表单时，没有任何异步请求发起，高效正确的初始化表单
:::

**场景二：配置 deferRendering 为 true（性能最优）**

  这种情况下，数据源在 **第一次** 打开表单时执行加载，之后不再刷新（依赖刷新除外）

  ```vue
    <FormPopupContainer :deferRendering="true"></FormPopupContainer>
  ```

::: warning 特别注意
这里只有在第一次打开表单时，执行一次数据源请求加载，只有的关闭打开都不会再刷新。这是由于 DevPopup 只支持 hidden（隐藏），表单内容挂载（onMounted）一次后，不会随着用户关掉popup，而卸载
:::

**场景三：配置 deferRendering 和 refetchOnHidden 为 true（特殊场景）**

  这种情况下，在表单关闭（onHidden）时，会刷新数据源，满足一些特定场景需求

  ```vue
    <FormPopupContainer :deferRendering="true" :refetchOnHidden="true"></FormPopupContainer>
  ```


::: tip 为什么不在每次打开表单时刷新数据
由于表单要满足初始化的需求，如果在打开表单时刷新数据，表单的初始化可能会受到影响，导致初始化失败
:::

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