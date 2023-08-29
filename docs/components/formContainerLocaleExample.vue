<template>
  <ClientOnly>
    <FormContainer :showCancelButton="false" :showConfirmButton="false">
      <SelectBoxProxy class="col-span-2" :items="[]"></SelectBoxProxy>
    </FormContainer>
  </ClientOnly>
</template>

<script setup>
import { FormContainer, SelectBoxProxy } from '@gutsyy/labs-devextreme'
</script>
