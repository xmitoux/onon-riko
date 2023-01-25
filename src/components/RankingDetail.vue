<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { supabase } from '@/utils/supabase';
  import { useRankingDetails } from '@/utils/useRankingDetail';

  import ChartBar from '@/components/ChartBar.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{
    modelValue: boolean;
    imageId: number;
    imagePath: string;
  }>();

  const emit = defineEmits(['update:modelValue', 'close']);

  // ランキング詳細子画面が開かれたときだけAPI呼び出しするためのprops監視
  watch(props, (newProps) => {
    if (newProps.modelValue) {
      // 閉じたときに発火させないために必要
      getRikoniTotal(newProps.imageId);
      getRikoniCountPerYear(newProps.imageId);
      getRikoniCountPerMonth(newProps.imageId);
    }
  });

  type RikoniTotal = {
    total_count: number;
    avg_do_time: number;
    avg_rating: number;
    avg_amount: number;
  };

  const rikoniTotalCount = ref(0);
  const rikoniAvgDoTime = ref(0);
  const rikoniAvgRating = ref(0);
  const rikoniAvgAmount = ref(0);
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

    const d = (data as RikoniTotal[])[0];
    rikoniTotalCount.value = d.total_count;
    rikoniAvgDoTime.value = d.avg_do_time;
    rikoniAvgRating.value = d.avg_rating;
    rikoniAvgAmount.value = d.avg_amount;
  };

  type RikoniPerYear = {
    year: string;
    count: number;
  };

  const {
    rikoniYearDatasets,
    extractYearDatasets,
    rikoniMonthDatasets,
    extractMonthDatasets,
  } = useRankingDetails();

  const getRikoniCountPerYear = async (in_image_id: number) => {
    const { data, error } = await supabase.rpc('get_rikoni_per_year', {
      in_image_id,
    });

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    extractYearDatasets(data as RikoniPerYear[], 2023, 5);
  };

  type RikoniPerMonth = {
    month: string;
    count: number;
  };
  const getRikoniCountPerMonth = async (in_image_id: number) => {
    const { data, error } = await supabase.rpc('get_rikoni_per_month', {
      in_image_id,
      in_year: 2023,
    });

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    // const test = [
    //   { month: '1', count: 10 },
    //   { month: '2', count: 14 },
    //   { month: '3', count: 20 },
    //   { month: '4', count: 12 },
    //   { month: '5', count: 3 },
    //   { month: '6', count: 32 },
    //   { month: '7', count: 5 },
    //   { month: '8', count: 10 },
    //   { month: '9', count: 41 },
    //   { month: '10', count: 22 },
    //   { month: '11', count: 0 },
    //   { month: '12', count: 36 },
    // ];
    // extractMonthDatasets(test);
    extractMonthDatasets(data as RikoniPerMonth[]);
  };

  const closeDialog = () => {
    emit('update:modelValue', false);
    emit('close');
  };
</script>

<template>
  <v-dialog
    :model-value="props.modelValue"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <SnackbarError
      v-model="showSnackbar"
      error-message="統計データ取得に失敗しました。"
      :error-detail="errorDetail"
    />

    <v-card class="text-center" title="画像詳細">
      <v-card-text class="pa-0">
        <v-container>
          <v-row justify="center">
            <v-img max-height="250" max-width="250" :src="props.imagePath" />
          </v-row>
          <v-row>
            <v-col>総使用回数</v-col>
            <v-col>{{ rikoniTotalCount }}回</v-col>
          </v-row>

          <v-row>
            <v-col>平均実施時間</v-col>
            <v-col>{{ rikoniAvgDoTime }}分</v-col>
          </v-row>

          <v-row>
            <v-col>平均評価</v-col>
            <v-col>{{ rikoniAvgRating }}</v-col>
          </v-row>

          <v-row>
            <v-col>平均量</v-col>
            <v-col>{{ rikoniAvgAmount }}</v-col>
          </v-row>
        </v-container>

        <ChartBar :datasets="rikoniYearDatasets" title="年別使用回数" />
        <ChartBar :datasets="rikoniMonthDatasets" title="月別使用回数" />
      </v-card-text>

      <v-card-actions class="d-flex justify-end pb-6 pr-4">
        <v-btn variant="outlined" @click="closeDialog">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped></style>
