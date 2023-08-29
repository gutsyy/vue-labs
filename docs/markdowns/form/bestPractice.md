<script setup>
import 'devextreme/dist/css/dx.light.css'
import '@gutsyy/labs-devextreme/style.css'
import ExampleForm from '../../components/exampleForm.vue'
</script>
# 最佳实践

> 在这里提供一个 `useForm` 的最佳实践，在这个实践中，主要展示各种类型的代理输入组件，以及数据源关联输入数据，组件配置关联输入数据

## 表单数据和逻辑

```js
{
    /** 姓名 */
    name: '',                     // text-box-proxy
    /** 年龄 */
    age: '',                      // number-box-proxy
    /** 性别 */
    gender: '',                   // select-box-proxy
    /** 课程 */
    lesson: '',                   // select-box-proxy
    /** 角色 */
    role: [],                     // tag-box-proxy
    /** 班级 */
    class: [],                    // tree-box-proxy
    /** 预计完成日期 */
    estimatedCompletionDate: '',  // date-box-proxy 
    /** 最晚完成日期 */
    latestCompletionDate: '',     // date-box-proxy
    /** 学生类型 */
    studentType: ''               // radio-box-proxy
}
```

**在以上数据中**

* 通过性别 `gender` 的输入，来 **刷新** `lesson` 的数据源，以此保证男女选择专项课程

* 通过预计完成日期 `estimatedCompletionDate` 来约束 `latestCompletionDate`，保证最晚完成日期 **晚于** 预计完成日期

## 数据源准备

```js
// 性别数据源
// 性别数据源
const genderDS = ['男', '女']

// 创建获取数据源函数
const createDS = function (data) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(data), 500)
    })
}

// 课程数据源
const lessonsDS = function (formData) {
  if (formData.gender === '男') {
    return createDS([
      { id: 0, lessonName: '篮球' },
      { id: 1, lessonName: '足球' }
    ])()
  } else if (formData.gender === '女') {
    return createDS([
      { id: 2, lessonName: '羽毛球' },
      { id: 3, lessonName: '乒乓球' }
    ])()
  }
  return createDS([])()
}

// 角色数据源
const roleDS = createDS([
  { id: 0, roleName: '班长' },
  { id: 1, roleName: '学习委员' },
  { id: 2, roleName: '辅导员' }
])

// 学生类型数据源
const studentTypeDS = [
  { id: 0, studentTypeName: '本科生' },
  { id: 1, studentTypeName: '研究生' }
]

// 班级数据源
const classDS = createDS([
  {
    id: 1,
    parentId: 0,
    className: '计算机学院',
    children: [
      {
        id: 2,
        className: '一班',
        parentId: 1
      },
      {
        id: 3,
        className: '二班',
        parentId: 1
      }
    ]
  }
])
```

## useForm
```js
const form = useForm(
  {
    name: '',
    age: null,
    gender: '',
    lesson: '',
    role: [],
    class: [],
    estimatedCompletionDate: '',
    latestCompletionDate: '',
    studentType: ''
  },
  {
    dataSources: {
      gender: {
        dataSource: genderDS
      },
      lesson: {
        dataSource: lessonsDS,
        dependencies: ['gender'],
        valueExpr: 'id',
        displayExpr: 'lessonName'
      },
      role: {
        dataSource: roleDS,
        valueExpr: 'id',
        displayExpr: 'roleName'
      },
      class: {
        dataSource: classDS,
        valueExpr: 'id',
        displayExpr: 'className'
      },
      studentType: {
        dataSource: studentTypeDS,
        valueExpr: 'id',
        displayExpr: 'studentTypeName'
      }
    },
    validators: {
      name: ['isRequired'],
      age: ['isRequired'],
      gender: ['isRequired'],
      lesson: ['isRequired'],
      role: ['isRequired'],
      class: ['isRequired'],
      estimatedCompletionDate: ['isRequired'],
      latestCompletionDate: ['isRequired'],
      studentType: ['isRequired']
    }
  }
)
```

## popup 配置和事件
```js
const popupVis = ref(false)

const popupTitle = ref<string>('')

const onOpen = function (
  type?: 'add' | 'edit',
  setData?: { [k in keyof typeof form.value]?: any } & { id?: string }
) {
  if (type === 'edit') {
    if (setData) {
      form.set(setData)
    }
    popupTitle.value = '修改表单'
  } else {
    popupTitle.value = '新增表单'
  }
  popupVis.value = true
}

const onEdit = function () {
  onOpen('edit', {
    name: 'gutsyy',
    age: 26,
    gender: '男',
    lesson: 0,
    role: [0],
    class: [1],
    estimatedCompletionDate: '2023-07-20',
    latestCompletionDate: '2023-07-25',
    studentType: 1
  })
}
```

## template
```vue
<template>
    <FormPopupContainer
      :title="popupTitle"
      :visible="popupVis"
      @confirm="onSubmit"
      @hidden="onClose"
    >
      <TextBoxProxy label-text="姓名" v-bind="form.getFormOptions('name')"></TextBoxProxy>
      <NumberBoxProxy label-text="年龄" v-bind="form.getFormOptions('age')"></NumberBoxProxy>
      <SelectBoxProxy label-text="性别" v-bind="form.getFormOptions('gender')"></SelectBoxProxy>
      <SelectBoxProxy label-text="课程" v-bind="form.getFormOptions('lesson')"></SelectBoxProxy>
      <DateBoxProxy
        label-text="预计完成日期"
        v-bind="form.getFormOptions('estimatedCompletionDate')"
      ></DateBoxProxy>
      <DateBoxProxy
        label-text="最晚完成日期"
        v-bind="form.getFormOptions('latestCompletionDate')"
        :min="form.value.estimatedCompletionDate"
      ></DateBoxProxy>
      <TreeBoxProxy
        class="col-span-2"
        label-text="班级"
        v-bind="form.getFormOptions('class')"
      ></TreeBoxProxy>
      <TagBoxProxy
        label-text="角色"
        class="col-span-2"
        v-bind="form.getFormOptions('role')"
      ></TagBoxProxy>
      <RadioBoxProxy
        label-text="学生类型"
        v-bind="form.getFormOptions('studentType')"
      ></RadioBoxProxy>
    </FormPopupContainer>
    <div class="button-container">
      <div class="new-button" @click="() => onOpen()">新增</div>
      <div class="edit-button" @click="onEdit">修改</div>
    </div>
</template>
```

## 渲染结果

<ExampleForm />

:::details 显示代码
```vue
<template>
  <main>
    <FormPopupContainer
      :title="popupTitle"
      :visible="popupVis"
      @confirm="onSubmit"
      @hidden="onClose"
    >
      <TextBoxProxy label-text="姓名" v-bind="form.getFormOptions('name')"></TextBoxProxy>
      <NumberBoxProxy label-text="年龄" v-bind="form.getFormOptions('age')"></NumberBoxProxy>
      <SelectBoxProxy label-text="性别" v-bind="form.getFormOptions('gender')"></SelectBoxProxy>
      <SelectBoxProxy label-text="课程" v-bind="form.getFormOptions('lesson')"></SelectBoxProxy>
      <DateBoxProxy
        label-text="预计完成日期"
        v-bind="form.getFormOptions('estimatedCompletionDate')"
      ></DateBoxProxy>
      <DateBoxProxy
        label-text="最晚完成日期"
        v-bind="form.getFormOptions('latestCompletionDate')"
        :min="form.value.estimatedCompletionDate"
      ></DateBoxProxy>
      <TreeBoxProxy
        class="col-span-2"
        label-text="班级"
        v-bind="form.getFormOptions('class')"
      ></TreeBoxProxy>
      <TagBoxProxy
        label-text="角色"
        class="col-span-2"
        v-bind="form.getFormOptions('role')"
      ></TagBoxProxy>
      <RadioBoxProxy
        label-text="学生类型"
        v-bind="form.getFormOptions('studentType')"
      ></RadioBoxProxy>
    </FormPopupContainer>
    <div class="button-container">
      <div class="new-button" @click="() => onOpen()">新增</div>
      <div class="edit-button" @click="onEdit">修改</div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {
  FormPopupContainer,
  TextBoxProxy,
  NumberBoxProxy,
  TagBoxProxy,
  SelectBoxProxy,
  TreeBoxProxy,
  DateBoxProxy,
  RadioBoxProxy,
  useForm
} from '@gutsyy/labs-devextreme'
import { ref } from 'vue'

/* ------------- 数据源 --------------- */

// 性别数据源
const genderDS = ['男', '女']

// 创建获取数据源函数
const createDS = function (data: any) {
  return () =>
    new Promise((resolve) => {
      setTimeout(() => resolve(data), 500)
    })
}

// 课程数据源
const lessonsDS = function (formData: any) {
  if (formData.gender === '男') {
    return createDS([
      { id: 0, lessonName: '篮球' },
      { id: 1, lessonName: '足球' }
    ])()
  } else if (formData.gender === '女') {
    return createDS([
      { id: 2, lessonName: '羽毛球' },
      { id: 3, lessonName: '乒乓球' }
    ])()
  }
  return createDS([])()
}

// 角色数据源
const roleDS = createDS([
  { id: 0, roleName: '班长' },
  { id: 1, roleName: '学习委员' },
  { id: 2, roleName: '辅导员' }
])

// 学生类型数据源
const studentTypeDS = [
  { id: 0, studentTypeName: '本科生' },
  { id: 1, studentTypeName: '研究生' }
]

// 班级数据源
const classDS = createDS([
  {
    id: 1,
    parentId: 0,
    className: '计算机学院',
    children: [
      {
        id: 2,
        className: '一班',
        parentId: 1
      },
      {
        id: 3,
        className: '二班',
        parentId: 1
      }
    ]
  }
])

/* -------------- useForm --------------- */

const form = useForm(
  {
    name: '',
    age: null,
    gender: '',
    lesson: '',
    role: [],
    class: [],
    estimatedCompletionDate: '',
    latestCompletionDate: '',
    studentType: ''
  },
  {
    dataSources: {
      gender: {
        dataSource: genderDS
      },
      lesson: {
        dataSource: lessonsDS,
        dependencies: ['gender'],
        valueExpr: 'id',
        displayExpr: 'lessonName'
      },
      role: {
        dataSource: roleDS,
        valueExpr: 'id',
        displayExpr: 'roleName'
      },
      class: {
        dataSource: classDS,
        valueExpr: 'id',
        displayExpr: 'className'
      },
      studentType: {
        dataSource: studentTypeDS,
        valueExpr: 'id',
        displayExpr: 'studentTypeName'
      }
    },
    validators: {
      name: ['isRequired'],
      age: ['isRequired'],
      gender: ['isRequired'],
      lesson: ['isRequired'],
      role: ['isRequired'],
      class: ['isRequired'],
      estimatedCompletionDate: ['isRequired'],
      latestCompletionDate: ['isRequired'],
      studentType: ['isRequired']
    }
  }
)

/* -------------- popup事件 ----------------*/

const popupVis = ref(false)

const popupTitle = ref<string>('')

const onOpen = function (
  type?: 'add' | 'edit',
  setData?: { [k in keyof typeof form.value]?: any } & { id?: string }
) {
  if (type === 'edit') {
    if (setData) {
      form.set(setData)
    }
    popupTitle.value = '修改表单'
  } else {
    popupTitle.value = '新增表单'
  }
  popupVis.value = true
}

const onEdit = function () {
  onOpen('edit', {
    name: 'gutsyy',
    age: 26,
    gender: '男',
    lesson: 0,
    role: [0],
    class: [1],
    estimatedCompletionDate: '2023-07-20',
    latestCompletionDate: '2023-07-25',
    studentType: 1
  })
}

const onClose = function () {
  form.reset()
  popupVis.value = false
}

const onSubmit = function () {
  form.onSubmit((formData) => {
    alert(JSON.stringify(formData))
  })
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
}
.new-button {
  display: flex;
  align-items: center;
  background-color: black;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 4px;
  padding-bottom: 4px;
  color: white;
  border-radius: 4px;
}

.edit-button {
  display: flex;
  margin-left: 8px;
  align-items: center;
  border-color: #eaeaea;
  border-width: 1px;
  border-style: solid;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 4px;
  padding-bottom: 4px;
  border-radius: 4px;
}
</style>
```
:::