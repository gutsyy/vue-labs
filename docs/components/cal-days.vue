<template>
  <ClientOnly>
    {{ ` ${diffs.year} 年 / ${diffs.month} 月 / ${diffs.day} 天 / ${diffs.hour} 小时 / ${diffs.second} 秒` }}
  </ClientOnly>
</template>

<script setup>
import dayjs from 'dayjs'
import { reactive } from 'vue'

const memoDay = dayjs('2019-12-15')

const diffs = reactive({
  year: '',
  month: '',
  day: '',
  hour: '',
  second: ''
})

const calDiff = () => {
  const diffYear = dayjs().diff(memoDay, 'years')
  const diffMonth = dayjs().diff(memoDay, 'months')
  const diffDays = dayjs().diff(memoDay, 'days')
  const diffHours = dayjs().diff(memoDay, 'hours')
  const diffSec = dayjs().diff(memoDay, 'seconds')
  diffs.year = diffYear
  diffs.month = diffMonth
  diffs.day = diffDays
  diffs.hour = diffHours
  diffs.second = diffSec
}

calDiff()

setInterval(calDiff, 1000)
</script>
