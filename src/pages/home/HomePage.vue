<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue';
  import dayjs from 'dayjs';
  import { lockScroll, unlockScroll } from '@/utils/utils';
  import RikoniRecord from '@/pages/home/RikoniRecord.vue';

  onMounted(() => lockScroll());
  onUnmounted(() => unlockScroll());

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

  const onCloseDialog = () => {
    showRecordDialog.value = false;
    clearTime();
    lockScroll();
  };
</script>

<template>
  <v-sheet class="mx-5 mt-6 px-3" color="#FFD6DE" height="345" rounded="lg">
    <v-row align="center" class="text-center" style="height: 125px">
      <v-col class="pt-0">
        <div class="text-caption my-1">前回実施日</div>
        <div class="text-h6">02/27(月)</div>
        <v-sheet class="text-body-2 my-1" color="white" rounded="pill">
          前回から0日経過
        </v-sheet>
      </v-col>

      <v-divider inset length="100" vertical />

      <v-col class="pt-0">
        <div class="text-caption my-1">月間実施/目標回数</div>
        <div class="text-h6">11/10回</div>
        <div class="my-1">🎉☔️😌</div>
      </v-col>
    </v-row>

    <v-divider />

    <v-row align="center" class="text-center pt-2">
      <v-col class="">
        <div class="text-caption my-1">前回使用画像</div>
        <v-img
          class="mx-auto"
          max-height="250"
          max-width="250"
          src="https://kobjcbrpdnutcmhncgaa.supabase.co/storage/v1/object/public/riko-images/D2D3B2FE-3CB2-4760-A0B3-05AE005407C8.jpeg"
        />
      </v-col>
    </v-row>
  </v-sheet>

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
</template>
