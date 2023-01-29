<script setup lang="ts">
  import dayjs from 'dayjs';
  import type { RikoniRecordWithImage } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const props = defineProps<{ record: RikoniRecordWithImage }>();
</script>

<template>
  <v-container v-if="props.record">
    <v-row>
      <v-col cols="3">実施日時</v-col>
      <v-col>
        {{ dayjs(props.record.started_at).format('HH:mm') }} 〜
        {{ dayjs(props.record.finished_at).format('HH:mm') }}
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">評価</v-col>
      <v-rating
        :model-value="props.record.rating"
        color="pink"
        disabled
        empty-icon="mdi-heart-outline"
        full-icon="mdi-heart"
        half-icon="mdi-heart-half"
        half-increments
      ></v-rating>
    </v-row>

    <v-row>
      <v-col cols="3">使用画像</v-col>
      <v-img
        class="pa-0"
        max-height="200"
        max-width="200"
        :src="`${IMAGES_BUCKET_URL}/${props.record.images.path}`"
      ></v-img>
    </v-row>
  </v-container>
</template>

<style scoped></style>
