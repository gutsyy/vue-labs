# 安装与配置

## 安装

请确保已经安装 `vue` `devextreme` `devextreme-vue` 后再进行安装

```bash
npm install @gutsyy/labs-devextreme --save
```

::: tip 建议
建议配置tailwindCSS一起使用
::: 

## 配置

在vue3项目中的入口文件 `main.ts` 中引入所需样式

```ts
import '@gutsyy/labs-devextreme/style.css'
```

## 可选配置

你可以注册包中的所有组件

```ts
import LabsDevExtreme from '@gutsyy/labs-devextreme'

// vue3 app
app.use(LabsDevExtreme)

```
