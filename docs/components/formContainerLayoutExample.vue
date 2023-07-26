<template>
  <FormContainer cols="4" :showCancelButton="false" :showConfirmButton="false">
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy></TextBoxProxy>
    <TextBoxProxy class="col-span-2"></TextBoxProxy>
    <TextBoxProxy class="col-span-2"></TextBoxProxy>
    <TextBoxProxy class="col-span-4"></TextBoxProxy>
  </FormContainer>
</template>

<script setup>
import { FormContainer, TextBoxProxy } from '@gutsyy/labs-devextreme'
</script>

<style></style>
