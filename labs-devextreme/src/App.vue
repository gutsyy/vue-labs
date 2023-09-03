<template>
  <main>
    <div>
      <div class="m-4 mb-8 p-4 bg-gray-100 rounded-2xl">
        <div class="flex justify-center">
          <DxButton @click="newPopForm" width="100" type="default">新增</DxButton>
          <DxButton @click="editPopForm" class="ml-4" width="100">修改</DxButton>
        </div>
        <FormPopupContainer :visible="popFormVis" cols="2" title="新增" @confirm="onSubmit" @hidden="onHiddenPopForm">
          <GroupFormItems title="基本信息">
            <TextBoxProxy label-text="姓名" v-bind="form.getFormOptions('name')"></TextBoxProxy>
            <NumberBoxProxy label-text="年龄" v-bind="form.getFormOptions('age')"></NumberBoxProxy>
            <TagBoxProxy label-text="角色" v-bind="form.getFormOptions('role')" :show-clear-button="true"></TagBoxProxy>
            <SelectBoxProxy label-text="性别" v-bind="form.getFormOptions('gender')"></SelectBoxProxy>
          </GroupFormItems>
          <GroupFormItems title="其他信息">
            <SelectBoxProxy label-text="兴趣爱好" v-bind="form.getFormOptions('interest')"></SelectBoxProxy>
            <SelectBoxProxy label-text="部门" v-bind="form.getFormOptions('department')"></SelectBoxProxy>
            <TextBoxProxy label-text="截止日" v-bind="form.getFormOptions('ddl')"></TextBoxProxy>
            <RadioBoxProxy label-text="选择" v-bind="form.getFormOptions('radio')"></RadioBoxProxy>
            <DateBoxProxy
              class="col-span-2"
              label-text="完成日期"
              v-bind="form.getFormOptions('date')"
              :max="form.value.ddl"
            ></DateBoxProxy>
            <TreeBoxProxy
              class="col-span-2"
              selection-mode="multiple"
              label-text="省份"
              :virtual-mode-enabled="true"
              v-bind="form.getFormOptions('tree', { showClearButton: true, dropDownOptions: { width: 500 } })"
            ></TreeBoxProxy>
          </GroupFormItems>
          <GroupFormItems title="杂项">
            <TextareaBoxProxy label-text="备注" class="col-span-2" v-bind="form.getFormOptions('remark')"></TextareaBoxProxy>
            <CheckBoxProxy label-text="" text="是否完成" v-bind="form.getFormOptions('isFinish')" />
          </GroupFormItems>
        </FormPopupContainer>
      </div>
      <div class="mt-4 flex justify-center">
        <DxButton @click="onSetFormData">测试按钮</DxButton>
      </div>
      <div class="mt-4 flex flex-col items-center">
        <div class="p-1 font-mono" v-for="(data, index) in formDataPrintArr" v-bind:key="index">
          {{ data }}
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { DxButton } from 'devextreme-vue'
import { computed, isProxy, toRaw, ref } from 'vue'
import { useForm } from './components/form/hooks/useForm'
import {
  TextBoxProxy,
  TagBoxProxy,
  SelectBoxProxy,
  DateBoxProxy,
  RadioBoxProxy,
  TreeBoxProxy,
  TextareaBoxProxy,
  CheckBoxProxy,
  FormPopupContainer,
  NumberBoxProxy,
  GroupFormItems
} from './components'

import muchTreeNodesData from './data.json'

const popFormVis = ref(false)

const newPopForm = function () {
  popFormVis.value = true
}

const editPopForm = function () {
  form.set({
    department: 1,
    role: [1] as never[],
    name: 'gy',
    gender: 'man',
    interest: 'esport',
    tree: [31808],
    id: 123
  })
  popFormVis.value = true
}

const onSubmit = () => {
  form.onSubmit((data) => {
    console.log(data.id)
  })
}

const onHiddenPopForm = function () {
  form.reset()
  popFormVis.value = false
}

const returnPromise = (value: any) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 300)
  })

const getRolesData = () =>
  returnPromise([
    { name: 'admin', id: 0 },
    { name: 'user', id: 1 }
  ])

const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['man', 'woman']), 300)
  })
}

const getInterestData = (data: any) => {
  const { gender } = data
  if (gender === 'man') {
    return returnPromise(['esport', 'basketball'])
  }

  return returnPromise([])
}

const getDepartmentData = () => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          { deptName: 'A', id: 0 },
          { deptName: 'B', id: 1 }
        ]),
      300
    )
  })
}

const getRadioData = () =>
  returnPromise([
    { name: 'A', id: 0 },
    { name: 'B', id: 1 }
  ])

const getTreeData = () =>
  returnPromise([
    {
      id: 10,
      name: '中国',
      children: [
        {
          id: 6,
          name: '湖南省',
          children: [
            { id: 1, name: '长沙市' },
            { id: 2, name: '湘潭市' }
          ]
        },
        {
          id: 3,
          name: '广东省',
          children: [
            { id: 4, name: '广州市' },
            { id: 5, name: '深圳市' }
          ]
        }
      ]
    }
  ])

const form = useForm(
  {
    name: '',
    gender: '',
    age: 26,
    role: [],
    interest: '',
    department: 0,
    ddl: '2023-07-23',
    date: null,
    radio: 1,
    tree: [4],
    remark: '',
    isFinish: false
  },
  {
    dataSources: {
      tree: {
        dataSource: () => new Promise((res) => setTimeout(() => res(muchTreeNodesData), 2000)),
        valueExpr: 'id',
        displayExpr: 'name'
      },
      role: {
        dataSource: getRolesData,
        valueExpr: 'id',
        displayExpr: 'name'
      },
      gender: {
        dataSource: getData
      },
      interest: {
        dataSource: getInterestData,
        dependencies: ['gender']
      },
      department: {
        dataSource: getDepartmentData,
        valueExpr: 'id',
        displayExpr: 'deptName'
      },
      radio: {
        dataSource: getRadioData,
        displayExpr: 'name',
        valueExpr: 'id'
      }
    },
    validators: {
      name: ['isRequired'],
      role: ['isRequired'],
      gender: ['isRequired'],
      interest: ['isRequired'],
      department: ['isRequired'],
      ddl: ['isRequired'],
      date: ['isRequired'],
      radio: ['isRequired'],
      tree: ['isRequired'],
      remark: ['isRequired']
    }
  }
)

const onSetFormData = () => {
  form.value.department = { id: 0 }
}

const printObj = (value: any) => {
  if (value) {
    const printStr = Object.entries(value).reduce<string>((prev, data, index) => {
      return prev + `${data[0]}: ${data[1]}${index !== Object.entries(value).length - 1 ? ', ' : ''}`
    }, '')
    return `{ ${printStr} }`
  }
  return ''
}

const printArr = (value: any[]) => {
  const printStr = value.map((ele) => `${typeof ele === 'object' ? printObj(ele) : ele}`)
  return `[${printStr}]`
}

const formDataPrintArr = computed(() => {
  return Object.entries(form.value).map((data) => {
    const raw = isProxy(data[1]) ? toRaw(data[1]) : data[1]
    if (Array.isArray(raw)) {
      return `${data[0]}: ${printArr(raw)}`
    }
    return `${data[0]}: ${typeof data[1] === 'object' ? printObj(raw) : raw}`
  })
})
</script>
