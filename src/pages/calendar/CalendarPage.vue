<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import CalendarComponent from '@/pages/calendar/CalendarComponent.vue';
  import { lockScroll, unlockScroll } from '@/utils/utils';

  const currentDate = ref(dayjs());

  onMounted(() => lockScroll());
  onUnmounted(() => unlockScroll());
</script>

<template>
  <div class="d-flex align-center year-month mt-2">
    <v-btn
      @click="currentDate = currentDate.subtract(1, 'month')"
      icon="mdi-chevron-left"
      variant="text"
    />

    {{ currentDate.year() }}/{{ currentDate.format('MM') }}

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
