<template>
  <ClientOnly>
    <div class="container">
      <div class="inputFormData">
        <TextBoxProxy
          width="220px"
          label="form data"
          :value="JSON.stringify(form.value)"
          @value-changed="onValueChanged"
        ></TextBoxProxy>
      </div>
      <SelectBoxProxy label-text="技术栈" v-bind="form.getFormOptions('stack')"></SelectBoxProxy>
    </div>
  </ClientOnly>
</template>

<script setup>
import { useForm, SelectBoxProxy, TextBoxProxy } from '@gutsyy/labs-devextreme'

const onValueChanged = function (e) {
  if (e.value !== JSON.stringify(form.value)) {
    let data = ''
    try {
      data = JSON.parse(e.value)
      form.set(data)
    } catch {
      return
    }
  }
}

const getTestData = () =>
  new Promise((resolve) => {
    setTimeout(() =>
      resolve([
        { id: 0, name: 'vue' },
        { id: 1, name: 'react' }
      ])
    )
  })

const form = useForm(
  { stack: '' },
  {
    dataSources: {
      stack: {
        dataSource: getTestData,
        valueExpr: 'id',
        displayExpr: 'name'
      }
    },
    validators: {
      stack: ['isRequired']
    }
  }
)
</script>

<style scoped>
.container {
  padding-bottom: 8px;
}

.inputFormData {
  display: flex;
  justify-content: center;
  font-size: 14px;
  margin-bottom: 8px;
}
</style>
