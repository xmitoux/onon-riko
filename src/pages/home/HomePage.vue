<script setup lang="ts">
  import { ref } from 'vue';
  import dayjs from 'dayjs';
  import RikoniRecord from '@/components/RikoniRecord.vue';

  const showRecordDialog = ref(false);

  const startedAt = ref('');
  const startRikoni = () => {
    startedAt.value = dayjs().format('YYYY-MM-DD HH:mm');
  };

  const finishedAt = ref('');
  const finishRikoni = () => {
    finishedAt.value = dayjs().format('YYYY-MM-DD HH:mm');
    showRecordDialog.value = true;
  };

  const clearTime = () => {
    startedAt.value = '';
    finishedAt.value = '';
  };

  const startManualRikoni = () => {
    clearTime();
    showRecordDialog.value = true;
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

  <RikoniRecord
    v-model="showRecordDialog"
    :auto="{ startedAt, finishedAt }"
    @close="clearTime"
  />
</template>
