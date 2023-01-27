<script setup lang="ts">
  import { computed, ref } from 'vue';
  import dayjs from 'dayjs';
  import { supabase } from '@/utils/supabase';
  import { useRankingDetails } from '@/utils/useRankingDetail';
  import { getMaxMapValue } from '@/utils/utils';

  import ChartBar from '@/components/ChartBar.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{
    imageId: number;
    imagePath: string;
  }>();

  const emit = defineEmits(['close']);

  const currentYear = ref(dayjs());
  const selectedYear = ref(dayjs());

  type RikoniTotal = {
    total_count: number;
    avg_do_time: number;
    avg_rating: number;
    avg_amount: number;
  };

  const rikoniTotalCount = ref(0);
  const rikoniAvgDoTime = ref(0);
  const rikoniAvgRating = ref(0);
  const showSnackbar = ref(false);
  const errorDetail = ref('');

  const getRikoniTotal = async (in_image_id: number) => {
    const { data, error } = await supabase.rpc('get_rikoni_total', {
      in_image_id,
    });

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    if (!data.length) {
      // 0回は結果が返ってこないので終了
      return;
    }

    const d = (data as RikoniTotal[])[0];
    rikoniTotalCount.value = d.total_count;
    rikoniAvgDoTime.value = d.avg_do_time;
    rikoniAvgRating.value = d.avg_rating;
  };
  getRikoniTotal(props.imageId);

  type RikoniPerYear = {
    year: string;
    count: number;
  };

  const {
    rikoniYearDatasets,
    rikoniYearDatasetsPast,
    rikoniYearDatasetsFuture,
    rikoniMonthDatasets,
    extractYearDatasets,
    extractMonthDatasets,
    moveElement,
  } = useRankingDetails();

  let maxYAxisYear = 0;
  const loadingYear = ref(false);

  const getRikoniCountPerYear = async (in_image_id: number) => {
    const { data, error } = await supabase.rpc('get_rikoni_per_year', {
      in_image_id,
    });

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    extractYearDatasets(data as RikoniPerYear[]);

    maxYAxisYear = getMaxMapValue([
      rikoniYearDatasets.value,
      rikoniYearDatasetsPast.value,
    ]);

    loadingYear.value = true;
  };
  getRikoniCountPerYear(props.imageId);

  type RikoniPerMonth = {
    month: string;
    count: number;
  };

  const loadingMonth = ref(false);

  const getRikoniCountPerMonth = async (
    in_image_id: number,
    in_year: number
  ) => {
    const { data, error } = await supabase.rpc('get_rikoni_per_month', {
      in_image_id,
      in_year,
    });

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    extractMonthDatasets(data as RikoniPerMonth[]);

    loadingMonth.value = true;
  };
  getRikoniCountPerMonth(props.imageId, currentYear.value.year());

  const maxYAxisMonth = computed(() =>
    getMaxMapValue(rikoniMonthDatasets.value)
  );

  const onClickYearChart = (label: string) => {
    const year = Number(label);
    selectedYear.value = selectedYear.value.set('year', year);
    getRikoniCountPerMonth(props.imageId, year);
  };
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    error-message="統計データ取得に失敗しました。"
    :error-detail="errorDetail"
  />

  <v-card class="text-center" title="画像詳細">
    <v-card-text class="pa-0">
      <v-container class="pa-0 ma-0 mt-2">
        <v-row class="pa-0 ma-0 mb-2" justify="center">
          <v-img max-height="250" max-width="250" :src="props.imagePath" />
        </v-row>

        <v-row class="pa-0 pl-4 ma-0 mt-1">
          <v-col class="pa-0 ma-0">総使用回数</v-col>
          <v-col class="pa-0 ma-0">{{ rikoniTotalCount }}回</v-col>
        </v-row>

        <v-row class="pa-0 pl-4 ma-0">
          <v-col class="pa-0 ma-0">平均実施時間</v-col>
          <v-col class="pa-0 ma-0">{{ rikoniAvgDoTime }}分</v-col>
        </v-row>

        <v-row class="pa-0 pl-4 ma-0">
          <v-col class="pa-0 ma-0">平均評価</v-col>
          <v-col class="pa-0 ma-0">{{ rikoniAvgRating }}</v-col>
        </v-row>

        <v-sheet class="relative chart px-4 mt-1">
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
            :bar-percentage="(rikoniYearDatasets.size / 5) * 0.9"
            :datasets="rikoniYearDatasets"
            title="年別使用回数"
            :max-y-axis="maxYAxisYear"
          />
        </v-sheet>

        <v-sheet class="chart pa-4 py-0">
          <ChartBar
            v-if="loadingMonth"
            :datasets="rikoniMonthDatasets"
            :title="`月別使用回数(${selectedYear.year()})`"
            :max-y-axis="maxYAxisMonth"
          />
        </v-sheet>
      </v-container>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pb-6 pr-4">
      <v-btn variant="outlined" @click="emit('close')">OK</v-btn>
    </v-card-actions>
  </v-card>
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

  .chart {
    height: 145px;
  }
</style>
