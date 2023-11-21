<template>
  <div class="h-screen w-screen">
    <FormPopupContainer title="测试" :visible="visible" @hidden="handleClose" @confirm="handleConfirm">
      <SelectBoxProxy class="col-span-2" v-bind="form.getFormOptions('select')" />
    </FormPopupContainer>
    <div class="flex">
      <Button @click="handleInitError">初始化错误数据</Button>
      <Button @click="handleInitCorrect">初始化正确数据</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { FormPopupContainer, SelectBoxProxy } from './components'
import { useForm } from './components/form/hooks/useForm'

const visible = ref(false)

const form = useForm(
  {
    select: null
  },
  {
    dataSources: {
      select: {
        dataSource: [
          { label: '1', value: '1' },
          { label: '2', value: '2' }
        ],
        displayExpr: 'label',
        valueExpr: 'value'
      }
    }
  }
)

const handleConfirm = () => {
  console.log(form.value)
}

const handleClose = () => {
  visible.value = false
}

const handleInitError = () => {
  form.set({
    select: '3' as any
  })
  visible.value = true
}

const handleInitCorrect = () => {
  form.set({
    select: '1' as any
  })
  visible.value = true
}
</script>
