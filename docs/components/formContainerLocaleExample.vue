<template>
  <FormContainer :showCancelButton="false" :showConfirmButton="false">
    <SelectBoxProxy class="col-span-2" :items="[]"></SelectBoxProxy>
  </FormContainer>
</template>

<script setup>
import { FormContainer, SelectBoxProxy } from '@gutsyy/labs-devextreme'
</script>
