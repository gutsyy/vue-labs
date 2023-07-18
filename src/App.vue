<script setup lang="ts">
import { DxButton } from 'devextreme-vue'
import FormContainer from './components/form/form-container.vue'
import type { FormItemsConfs } from './components/form/types'
import { getAsyncItems } from './components/form/types'
import { computed, ref } from 'vue'

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
  age: 26
})

const formItemsConfs: FormItemsConfs<
  ['text', 'text', 'select', 'select', 'select', 'text', 'text', 'date', 'number'],
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
  }
]

const printf = function () {
  console.log(formData.value)
}

const onSetFormData = () => {
  formData.value.department = 1
  formData.value.age = 27
}

const printObj = (value: any) => {
  return Object.entries(value).reduce<string>((prev, data) => {
    return prev + `${data[0]}: ${data[1]}, `
  }, '')
}

const formDataPrintArr = computed(() => {
  return Object.entries(formData.value).map((data) => {
    return `${data[0]}: ${
      typeof data[1] === 'object' && !Array.isArray(data[1]) ? printObj(data[1]) : data[1]
    }`
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
