<script setup lang="ts">
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import CalendarComponent from '@/components/CalendarComponent.vue';

  const currentDate = ref(dayjs());
</script>

<template>
  <div class="d-flex align-center year-month mt-2">
    <v-btn
      @click="currentDate = currentDate.subtract(1, 'month')"
      icon="mdi-chevron-left"
      variant="text"
    />

    {{ currentDate.year() }}/{{ currentDate.month() + 1 }}

    <v-btn
      @click="currentDate = currentDate.add(1, 'month')"
      icon="mdi-chevron-right"
      variant="text"
    />
  </div>

  <CalendarComponent :date="currentDate" />
</template>

<style scoped>
  .year-month {
    height: 35px;
  }
</style>
