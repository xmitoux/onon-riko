<script setup lang="ts">
  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import 'dayjs/locale/ja';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const props = defineProps<{
    lastDatetime?: string;
    lastImagePath?: string;
  }>();

  const lastDatetime = computed(() => dayjs(props.lastDatetime));

  const interval = computed(() => {
    const now = dayjs();
    return now.diff(lastDatetime.value, 'day');
  });
</script>

<template>
  <v-sheet class="mx-5 mt-6 px-3" color="#FFD6DE" height="345" rounded="lg">
    <v-row align="center" class="text-center" style="height: 125px">
      <v-col class="pt-0">
        <div class="text-caption my-1">前回実施日</div>
        <div class="text-h6">
          {{ lastDatetime.locale('ja').format('M/DD(dd)') }}
        </div>
        <v-sheet class="text-body-2 my-1" color="white" rounded="pill">
          前回から{{ interval }}日経過
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
          v-if="props.lastImagePath"
          class="mx-auto"
          max-height="250"
          max-width="250"
          :src="`${IMAGES_BUCKET_URL}/${props.lastImagePath}`"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>
