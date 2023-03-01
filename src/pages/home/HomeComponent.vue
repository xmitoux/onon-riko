<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import { supabase } from '@/utils/supabase';
  import { lockScroll, unlockScroll } from '@/utils/utils';
  import { useSnackbarSuccess, useSnackbarError } from '@/utils/use-snackbar';
  import type { RikoniRecordWithImage } from '@/types';
  import HomeInfo from './HomeInfo.vue';
  import RikoniRecord from '@/pages/home/RikoniRecord.vue';
  import SncakbarSuccess from '@/components/SncakbarSuccess.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  onMounted(() => lockScroll());
  onUnmounted(() => unlockScroll());

  const { showSnackbar, showSnackbarError, errorMessage, errorDetail } =
    useSnackbarError();

  const latestRecord = ref<RikoniRecordWithImage | null>(null);
  const getLatestRecord = async () => {
    const { data, error } = await supabase
      .from('rikoni_records')
      .select('*, images(*)')
      .order('finished_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      showSnackbarError(error.message, errorDetail.value);
    }

    latestRecord.value = data as RikoniRecordWithImage;
  };
  getLatestRecord();

  const countPerMonth = ref(0);

  const getCountPerMonth = async () => {
    const { data, error } = await supabase
      .rpc('get_rikoni_count_per_month')
      .single();

    if (error) {
      showSnackbarError(error.message, errorDetail.value);
    }

    countPerMonth.value = data.count;
  };
  getCountPerMonth();

  const targetCount = ref(0);

  const getTargetCount = async () => {
    const { data, error } = await supabase.from('settings').select().single();

    if (error) {
      showSnackbarError(error.message, errorDetail.value);
    }

    targetCount.value = data.target_count_per_month;
  };
  getTargetCount();

  const showRecordDialog = ref(false);

  const startedAt = ref('');
  const startRikoni = () => {
    startedAt.value = dayjs().format('YYYY-MM-DD HH:mm');
  };

  const finishedAt = ref('');
  const finishRikoni = () => {
    finishedAt.value = dayjs().format('YYYY-MM-DD HH:mm');
    openDialog();
  };

  const clearTime = () => {
    startedAt.value = '';
    finishedAt.value = '';
  };

  const startManualRikoni = () => {
    clearTime();
    openDialog();
  };

  const openDialog = () => {
    showRecordDialog.value = true;
    unlockScroll();
  };

  const { snackbarSuccess, successMessage, showSnackbarSuccess } =
    useSnackbarSuccess();

  const onCloseDialog = (result: boolean) => {
    showRecordDialog.value = false;
    clearTime();
    lockScroll();

    if (result) {
      showSnackbarSuccess('登録しました。');
    }
  };
</script>

<template>
  <HomeInfo
    :last-image-path="latestRecord?.images.path"
    :last-datetime="latestRecord?.finished_at"
    :target-count="targetCount"
    :count-per-month="countPerMonth"
  />

  <v-container>
    <v-row class="ma-2 text-center" justify="space-around">
      <v-col v-if="!startedAt">
        <v-btn @click="startRikoni" color="#FFD6DE" rounded="pill">
          梨子ちゃんと😘
        </v-btn>
      </v-col>

      <template v-else>
        <v-col>
          <v-btn @click="clearTime" rounded="pill" variant="outlined">
            キャンセル
          </v-btn>
        </v-col>

        <v-col>
          <v-btn @click="finishRikoni" rounded="pill" variant="outlined">
            出た🥰
          </v-btn>
        </v-col>
      </template>
    </v-row>

    <v-row class="ma-2 text-center">
      <v-col>
        <v-btn @click="startManualRikoni" rounded="pill" variant="outlined">
          手動記録
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model="showRecordDialog"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <RikoniRecord :auto="{ startedAt, finishedAt }" @close="onCloseDialog" />
  </v-dialog>

  <SncakbarSuccess v-model="snackbarSuccess" :message="successMessage" />

  <SnackbarError
    v-model="showSnackbar"
    :error-message="errorMessage"
    :error-detail="errorDetail"
  />
</template>
