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
  <v-container>
    <v-row class="ma-2 text-center" justify="space-around">
      <v-col v-if="!startedAt">
        <v-btn @click="startRikoni" variant="outlined">梨子ちゃんと❤️</v-btn>
      </v-col>

      <template v-else>
        <v-col>
          <v-btn @click="clearTime" variant="outlined">キャンセル</v-btn>
        </v-col>

        <v-col>
          <v-btn @click="finishRikoni" variant="outlined">出た🥰</v-btn>
        </v-col>
      </template>
    </v-row>

    <v-row class="ma-2 text-center">
      <v-col>
        <v-btn @click="startManualRikoni" variant="outlined">手動記録</v-btn>
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
