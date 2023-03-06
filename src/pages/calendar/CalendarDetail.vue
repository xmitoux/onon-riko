<script setup lang="ts">
  import dayjs from 'dayjs';
  import type { RikoniRecordWithImage } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const props = defineProps<{ record: RikoniRecordWithImage | null }>();
</script>

<template>
  <v-container v-if="props.record" class="py-2">
    <v-img
      height="200"
      :src="`${IMAGES_BUCKET_URL}/${props.record.images.path}`"
    />

    <v-row align="center" class="pl-3 ma-1">
      <v-col class="text-center py-0" cols="5">実施日</v-col>
      <v-col class="py-0">
        {{ dayjs(props.record.started_at).format('YYYY/MM/DD') }}
      </v-col>
    </v-row>

    <v-row align="center" class="pl-3 ma-1">
      <v-col class="text-center py-0" cols="5">実施時間</v-col>
      <v-col class="py-0">
        {{ dayjs(props.record.started_at).format('HH:mm') }} 〜
        {{ dayjs(props.record.finished_at).format('HH:mm') }}
        ({{ props.record.do_time }}分)
      </v-col>
    </v-row>

    <v-row align="center" class="pl-3 ma-1">
      <v-col class="text-center py-0" cols="5">評価</v-col>
      <v-rating
        :model-value="props.record.rating"
        class="pl-2"
        color="pink"
        disabled
        empty-icon="mdi-heart-outline"
        full-icon="mdi-heart"
        half-icon="mdi-heart-half"
        half-increments
        size="25"
      />
    </v-row>
  </v-container>
</template>

<style scoped></style>
