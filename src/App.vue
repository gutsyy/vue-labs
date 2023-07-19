<script setup lang="ts">
import { DxButton } from 'devextreme-vue'
import FormContainer from './components/form/form-ultra.vue'
import type { FormItemsConfs } from './components/form/types'
import { getAsyncItems } from './components/form/types'
import { computed, ref, isProxy, toRaw } from 'vue'
import { appendFile } from 'fs'

const returnPromise = (value: any) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(value), 300)
  })

const getData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(['man', 'woman']), 300)
  })
}

const getInterestData = (data: Partial<typeof formData.value>) => {
  const { gender } = data
  if (gender === 'man') {
    return returnPromise(['esport', 'basketball'])
  }

  return returnPromise([])
}

const getRolesData = () =>
  returnPromise([
    { name: 'admin', id: 0 },
    { name: 'user', id: 1 }
  ])

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

const formData = ref({
  firstName: 'Gong',
  lastName: 'Yuan',
  gender: 'man',
  interest: '',
  department: 0,
  leftDay: '2023-07-16',
  midDay: '',
  rightDay: '2023-07-20',
  age: 26,
  role: [0]
})

const formItemsConfs: FormItemsConfs<
  ['text', 'text', 'select', 'select', 'select', 'text', 'text', 'date', 'number', 'tag'],
  keyof typeof formData.value
> = [
  {
    label: '姓名',
    type: 'text',
    dataField: 'firstName',
    options: {
      disabled: true
    }
  },
  {
    label: '',
    type: 'text',
    dataField: 'lastName'
  },
  {
    label: '',
    type: 'select',
    dataField: 'gender',
    items: getAsyncItems(getData)
  },
  {
    label: '',
    type: 'select',
    dataField: 'interest',
    items: getAsyncItems(getInterestData, ['gender'])
  },
  {
    label: '',
    type: 'select',
    dataField: 'department',
    items: getAsyncItems(getDepartmentData),
    onValueChanged: (item) => {
      formData.value.firstName = item.deptName
    },
    options: {
      valueExpr: 'id',
      displayExpr: 'deptName'
    }
  },
  {
    label: '',
    type: 'text',
    dataField: 'leftDay'
  },
  {
    label: '',
    type: 'text',
    dataField: 'rightDay'
  },
  {
    label: '',
    type: 'date',
    colSpan: 1,
    dataField: 'midDay',
    options: computed(() => ({
      min: formData.value.leftDay,
      max: formData.value.rightDay
    }))
  },
  {
    label: '',
    type: 'number',
    colSpan: 1,
    dataField: 'age'
  },
  {
    label: '',
    type: 'tag',
    dataField: 'role',
    // items: ['user', 'admin']
    items: getAsyncItems(getRolesData),
    options: {
      displayExpr: 'name',
      valueExpr: 'id'
    }
  }
]

const onSetFormData = () => {
  formData.value.department = 1
  formData.value.age = 27
  formData.value.role = [1]
}

const printObj = (value: any) => {
  if (value) {
    const printStr = Object.entries(value).reduce<string>((prev, data, index) => {
      return (
        prev + `${data[0]}: ${data[1]}${index !== Object.entries(value).length - 1 ? ', ' : ''}`
      )
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
  return Object.entries(formData.value).map((data) => {
    const raw = isProxy(data[1]) ? toRaw(data[1]) : data[1]
    if (Array.isArray(raw)) {
      return `${data[0]}: ${printArr(raw)}`
    }
    return `${data[0]}: ${typeof data[1] === 'object' ? printObj(raw) : raw}`
  })
})
</script>

<template>
  <main>
    <div>
      <FormContainer v-model:form-data="formData" :items-confs="formItemsConfs" />
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
