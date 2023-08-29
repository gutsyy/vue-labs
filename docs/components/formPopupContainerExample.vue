<template>
  <ClientOnly>
    <div class="container">
      <div class="button" @click="onOpen">打开表单</div>
    </div>
    <FormPopupContainer
      width="40vw"
      :visible="formVis"
      title="表单"
      @hidden="onClose"
      confirm-button-class-name="confirm-button"
    >
      <TextBoxProxy class="col-span-2" label-text="姓名"></TextBoxProxy>
    </FormPopupContainer>
  </ClientOnly>
</template>

<script setup>
import { FormPopupContainer, TextBoxProxy } from '@gutsyy/labs-devextreme'
import { ref } from 'vue'

const formVis = ref(false)

const onClose = function () {
  formVis.value = false
}

const onOpen = function () {
  formVis.value = true
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
}

.button {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: black;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  background: black !important;
}
</style>

<style>
.confirm-button {
  background: black !important;
  border-radius: 4px !important;
}
</style>
