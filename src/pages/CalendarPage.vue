<script setup lang="ts">
  import CalendarComponent from '@/components/CalendarComponent.vue';
  import { ref } from 'vue';
  import dayjs from 'dayjs';

  const currentDate = ref(dayjs());
</script>

<template>
  <span>{{ currentDate.year() }}/{{ currentDate.month() + 1 }}</span>
  <v-btn @click="currentDate = currentDate.subtract(1, 'month')">前の月</v-btn>
  <v-btn @click="currentDate = dayjs()">今日</v-btn>
  <v-btn @click="currentDate = currentDate.add(1, 'month')">次の月</v-btn>

  <CalendarComponent :date="currentDate" />
</template>

<style scoped></style>
