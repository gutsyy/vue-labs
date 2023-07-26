<template>
  <main>
    <FormPopupContainer
      :title="popupTitle"
      :visible="popupVis"
      @confirm="onSubmit"
      @hidden="onClose"
      confirm-button-class-name="confirm-button"
    >
      <TextBoxProxy label-text="姓名" v-bind="form.getFormOptions('name')"></TextBoxProxy>
      <NumberBoxProxy label-text="年龄" v-bind="form.getFormOptions('age')"></NumberBoxProxy>
      <SelectBoxProxy label-text="性别" v-bind="form.getFormOptions('gender')"></SelectBoxProxy>
      <SelectBoxProxy label-text="课程" v-bind="form.getFormOptions('lesson')"></SelectBoxProxy>
      <DateBoxProxy label-text="预计完成日期" v-bind="form.getFormOptions('estimatedCompletionDate')"></DateBoxProxy>
      <DateBoxProxy
        label-text="最晚完成日期"
        v-bind="form.getFormOptions('latestCompletionDate')"
        :min="form.value.estimatedCompletionDate"
      ></DateBoxProxy>
      <TreeBoxProxy class="col-span-2" label-text="班级" v-bind="form.getFormOptions('class')"></TreeBoxProxy>
      <TagBoxProxy label-text="角色" class="col-span-2" v-bind="form.getFormOptions('role')"></TagBoxProxy>
      <RadioBoxProxy label-text="学生类型" v-bind="form.getFormOptions('studentType')"></RadioBoxProxy>
    </FormPopupContainer>
    <div class="button-container">
      <div class="new-button" @click="() => onOpen()">新增</div>
      <div class="edit-button" @click="onEdit">修改</div>
    </div>
  </main>
</template>

<script setup>
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

const popupTitle = ref('')

const onOpen = function (type = 'add', setData = null) {
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

<style>
.confirm-button {
  background-color: black !important;
  border-radius: 4px;
}
</style>
