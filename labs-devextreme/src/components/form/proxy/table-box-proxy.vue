<template>
  <DxDataGrid><slot></slot></DxDataGrid>
</template>

<script lang="ts" setup>
import { removeUndefinedProps } from '@/utils'
import { DxDataGrid } from 'devextreme-vue/data-grid'
import { Properties } from 'devextreme/ui/data_grid'

const props = withDefaults(defineProps<Properties>(), {})

const noUndefinedProps = removeUndefinedProps(props)
</script>
