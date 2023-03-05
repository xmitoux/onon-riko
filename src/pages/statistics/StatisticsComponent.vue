<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import StatisticsInfo from '@/pages/statistics/StatisticsInfo.vue';

  type StatisticsTotal = { count_total: number; do_time_total: number };

  const countTotal = ref(0);
  const doTimeTotal = ref(0);

  const getStatisticsCount = async () => {
    const { data, error } = await supabase
      .rpc('get_statistics_total', {
        in_year: 0,
      })
      .single();

    if (error) {
      console.log(error);
    }

    const result = data as StatisticsTotal;
    countTotal.value = result.count_total;
    doTimeTotal.value = result.do_time_total;
  };

  getStatisticsCount();
</script>

<template>
  <v-sheet class="mx-auto" width="300">
    <v-select label="Select" :items="[]" variant="solo"></v-select>
  </v-sheet>

  <StatisticsInfo :count-total="countTotal" :do-time-total="doTimeTotal" />
</template>

<style scoped></style>
