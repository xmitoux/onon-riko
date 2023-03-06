<script setup lang="ts">
  import { computed, ref } from 'vue';
  import dayjs from 'dayjs';
  import { supabase } from '@/utils/supabase';
  import { getMaxMapValue } from '@/utils/utils';
  import { useRankingDetails } from '@/utils/useRankingDetail';
  import StatisticsInfo from '@/pages/statistics/StatisticsInfo.vue';
  import ChartBar from '@/components/ChartBar.vue';

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

  const {
    rikoniYearDatasets,
    rikoniYearDatasetsPast,
    rikoniYearDatasetsFuture,
    rikoniMonthDatasets,
    extract5YearsDatasets,
    getMonthDatasets,
    moveElement,
  } = useRankingDetails();

  type RikoniPerYear = {
    year: string;
    count: number;
  };

  // 年別データセットを取得する
  let maxYAxisYear = 0;
  const loadingYear = ref(false);
  const getCountPerYear = async () => {
    const { data, error } = await supabase.rpc('get_statistics_count_per_year');

    if (error) {
      console.log(error);
    }

    extract5YearsDatasets(data as RikoniPerYear[]);

    // 年別グラフのY軸の最大値(全ての年の中で最大の値)
    maxYAxisYear = getMaxMapValue([
      rikoniYearDatasets.value,
      rikoniYearDatasetsPast.value,
    ]);

    loadingYear.value = true;
  };
  getCountPerYear();

  type RikoniPerMonth = {
    month: string;
    count: number;
  };

  // 月別データセットを取得する
  const loadingMonth = ref(false);
  const getRikoniCountPerMonth = async (in_year: number) => {
    const { data, error } = await supabase.rpc(
      'get_statistics_count_per_month',
      {
        in_year,
      }
    );

    if (error) {
      // errorDetail.value = error.message;
      // showSnackbar.value = true;
      return;
    }

    getMonthDatasets(data as RikoniPerMonth[]);

    loadingMonth.value = true;
  };
  getRikoniCountPerMonth(dayjs().year());

  // 月別グラフのY軸の最大値(月別データセット内の最大値を設定)
  const maxYAxisMonth = computed(() =>
    getMaxMapValue(rikoniMonthDatasets.value)
  );

  // 年別グラフクリックでその年の月別グラフを表示する
  const selectedYear = ref(dayjs());
  const onClickYearChart = (label: string) => {
    const year = Number(label);
    selectedYear.value = selectedYear.value.set('year', year);
    getRikoniCountPerMonth(year);
  };
</script>

<template>
  <StatisticsInfo :count-total="countTotal" :do-time-total="doTimeTotal" />

  <v-sheet class="relative px-4 my-5" height="200">
    <v-btn
      v-show="rikoniYearDatasetsPast.size"
      @click="moveElement('prev')"
      class="prev-year"
      icon="mdi-arrow-left"
      size="x-small"
      variant="text"
    />

    <v-btn
      v-show="rikoniYearDatasetsFuture.size"
      @click="moveElement('next')"
      class="next-year"
      icon="mdi-arrow-right"
      size="x-small"
      variant="text"
    />

    <ChartBar
      v-if="loadingYear"
      @click="onClickYearChart"
      :bar-percentage="(rikoniYearDatasets.size / 5) * 0.5"
      :datasets="rikoniYearDatasets"
      title="年別実施回数"
      :max-y-axis="maxYAxisYear"
    />
  </v-sheet>

  <v-sheet class="chart px-4 my-5" height="200">
    <ChartBar
      v-if="loadingMonth"
      :bar-percentage="0.5"
      :datasets="rikoniMonthDatasets"
      :title="`月別実施回数(${selectedYear.year()})`"
      :max-y-axis="maxYAxisMonth"
    />
  </v-sheet>
</template>

<style scoped>
  .relative {
    position: relative;
  }

  .prev-year {
    position: absolute;
    top: 1px;
    left: 100px;
  }

  .next-year {
    position: absolute;
    top: 1px;
    right: 100px;
  }
</style>
