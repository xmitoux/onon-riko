<script setup lang="ts">
  import { computed, ref } from 'vue';
  import dayjs from 'dayjs';

  import { supabase } from '@/utils/supabase';
  import { useRankingDetails } from '@/utils/useRankingDetail';
  import { useSnackbarError } from '@/utils/use-snackbar';
  import { getMaxMapValue } from '@/utils/utils';

  import ChartBar from '@/components/ChartBar.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{
    imageId: number;
    imagePath: string;
  }>();

  const emit = defineEmits(['close']);

  type RikoniTotal = {
    total_count: number;
    avg_do_time: number;
    avg_rating: number;
    avg_amount: number;
  };

  // 総回数と平均値を取得する
  const rikoniTotalCount = ref(0);
  const rikoniAvgDoTime = ref(0);
  const rikoniAvgRating = ref(0);

  const { showSnackbar, showSnackbarError, errorMessage, errorDetail } =
    useSnackbarError();

  const getRikoniTotal = async (in_image_id: number) => {
    const { data, error } = await supabase.rpc('get_rikoni_total', {
      in_image_id,
    });

    if (error) {
      showSnackbarError('総使用回数取得に失敗しました。', error.message);

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
  const getRikoniCountPerYear = async (in_image_id: number) => {
    const { data, error } = await supabase.rpc('get_rikoni_per_year', {
      in_image_id,
    });

    if (error) {
      showSnackbarError('年別データ取得に失敗しました。', error.message);
      return;
    }

    extract5YearsDatasets(data as RikoniPerYear[]);

    // 年別グラフのY軸の最大値(全ての年の中で最大の値)
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

  // 月別データセットを取得する
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
      showSnackbarError('月別データ取得に失敗しました。', error.message);
      return;
    }

    getMonthDatasets(data as RikoniPerMonth[]);

    loadingMonth.value = true;
  };
  getRikoniCountPerMonth(props.imageId, dayjs().year());

  // 月別グラフのY軸の最大値(月別データセット内の最大値を設定)
  const maxYAxisMonth = computed(() =>
    getMaxMapValue(rikoniMonthDatasets.value)
  );

  // 年別グラフクリックでその年の月別グラフを表示する
  const selectedYear = ref(dayjs());
  const onClickYearChart = (label: string) => {
    const year = Number(label);
    selectedYear.value = selectedYear.value.set('year', year);
    getRikoniCountPerMonth(props.imageId, year);
  };
</script>

<template>
  <v-card class="text-center" title="画像詳細">
    <v-card-text class="pa-0">
      <v-row class="pa-0 ma-0 my-2" justify="center">
        <v-img max-height="250" max-width="350" :src="props.imagePath" />
      </v-row>
      <v-sheet class="mx-5 mt-6 px-3" color="#FFD6DE" height="85" rounded="lg">
        <v-row align="center" class="text-center" style="height: 80px">
          <v-col class="">
            <div class="text-caption">総使用回数</div>

            <template v-if="true">
              <div class="text-h6">{{ rikoniTotalCount }}回</div>
            </template>

            <template v-else>
              <v-sheet color="#FFD6DE" height="60" />
            </template>
          </v-col>

          <v-divider inset length="70" vertical />

          <v-col class="">
            <div class="text-caption">総実施時間</div>

            <template v-if="true">
              <div class="text-h6">{{ rikoniAvgDoTime }}分</div>
            </template>

            <template v-else>
              <v-sheet color="#FFD6DE" height="64" />
            </template>
          </v-col>

          <v-divider inset length="70" vertical />

          <v-col class="">
            <div class="text-caption">平均評価</div>

            <template v-if="true">
              <div class="text-h6">{{ rikoniAvgRating }}</div>
            </template>

            <template v-else>
              <v-sheet color="#FFD6DE" height="64" />
            </template>
          </v-col>
        </v-row>
      </v-sheet>

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
          :bar-percentage="(rikoniYearDatasets.size / 5) * 0.5"
          :datasets="rikoniYearDatasets"
          title="年別使用回数"
          :max-y-axis="maxYAxisYear"
        />
      </v-sheet>

      <v-sheet class="chart pa-4 py-0">
        <ChartBar
          v-if="loadingMonth"
          :bar-percentage="0.5"
          :datasets="rikoniMonthDatasets"
          :title="`月別使用回数(${selectedYear.year()})`"
          :max-y-axis="maxYAxisMonth"
        />
      </v-sheet>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pb-6 pr-4">
      <v-btn variant="outlined" @click="emit('close')">OK</v-btn>
    </v-card-actions>
  </v-card>

  <SnackbarError
    v-model="showSnackbar"
    :error-message="errorMessage"
    :error-detail="errorDetail"
  />
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
