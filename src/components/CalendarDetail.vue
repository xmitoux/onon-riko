<script setup lang="ts">
  import dayjs from 'dayjs';
  import type { RikoniRecordWithImage } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const props = defineProps<{ record: RikoniRecordWithImage | null }>();
</script>

<template>
  <v-container v-if="props.record" class="py-0">
    <v-row align="center" class="ma-1">
      <v-col class="text-center" cols="4">実施日時</v-col>
      <v-col>
        {{ dayjs(props.record.started_at).format('HH:mm') }} 〜
        {{ dayjs(props.record.finished_at).format('HH:mm') }}
      </v-col>
    </v-row>

    <v-row align="start" class="ma-1">
      <v-col class="text-center" cols="4">使用画像</v-col>
      <v-col>
        <v-img
          max-height="200"
          max-width="200"
          :src="`${IMAGES_BUCKET_URL}/${props.record.images.path}`"
        />
      </v-col>
    </v-row>

    <v-row align="center" class="ma-1">
      <v-col class="text-center" cols="4">評価</v-col>
      <v-rating
        :model-value="props.record.rating"
        class="pl-1"
        color="pink"
        disabled
        empty-icon="mdi-heart-outline"
        full-icon="mdi-heart"
        half-icon="mdi-heart-half"
        half-increments
        size="35"
      />
    </v-row>
  </v-container>
</template>

<style scoped></style>
