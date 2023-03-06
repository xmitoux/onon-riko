<script setup lang="ts">
  import { computed } from 'vue';
  import dayjs from 'dayjs';
  import 'dayjs/locale/ja';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const props = defineProps<{
    lastDatetime?: string;
    lastImagePath?: string;
    countPerMonth: number;
    targetCount: number;
  }>();

  const lastDatetime = computed(() => dayjs(props.lastDatetime));

  const interval = computed(() => {
    const now = dayjs();
    return now.diff(lastDatetime.value, 'day');
  });

  const evaluateCount = (targetCount: number, currentCount: number): string => {
    const percentage = currentCount / targetCount;

    // 評価結果を表す絵文字のリスト
    const goodEmojis = ['🥰', '☀', '🎉'];
    const averageEmojis = ['😐', '☁️', '👊'];
    const badEmojis = ['☹️', '☔️', '🐤'];

    const random = Math.floor(Math.random() * 3);

    // 割合に応じて評価を行う
    if (percentage >= 0.8) {
      // 目標回数の80%以上達成
      return goodEmojis[random];
    } else if (percentage >= 0.4) {
      // 目標回数の40%以上達成
      return averageEmojis[random];
    } else {
      // 目標回数の40%未満
      return badEmojis[random];
    }
  };

  const evaluatedEmoji = computed(() =>
    evaluateCount(props.targetCount, props.countPerMonth)
  );
</script>

<template>
  <v-sheet class="mx-5 mt-6 px-3" color="#FFD6DE" height="345" rounded="lg">
    <v-row align="center" class="text-center" style="height: 125px">
      <v-col class="pt-0">
        <div class="text-caption my-1">前回実施日</div>

        <template v-if="props.lastDatetime">
          <div class="text-h6">
            {{ lastDatetime.locale('ja').format('M/D(dd)') }}
          </div>
          <v-sheet class="text-body-2 my-1" color="white" rounded="pill">
            前回から{{ interval }}日経過
          </v-sheet>
        </template>

        <template v-else>
          <v-sheet color="#FFD6DE" height="60" />
        </template>
      </v-col>

      <v-divider inset length="100" vertical />

      <v-col class="pt-0">
        <div class="text-caption my-1">月間実施/目標回数</div>

        <template v-if="targetCount">
          <div class="text-h6">{{ countPerMonth }}/{{ targetCount }}回</div>
          <div class="my-1">{{ evaluatedEmoji }}</div>
        </template>

        <template v-else>
          <v-sheet color="#FFD6DE" height="64" />
        </template>
      </v-col>
    </v-row>

    <v-divider />

    <v-row align="center" class="text-center pt-2">
      <v-col class="">
        <div class="text-caption my-1">前回使用画像</div>
        <v-img
          v-if="props.lastImagePath"
          class="mx-auto"
          max-height="180"
          max-width="250"
          :src="`${IMAGES_BUCKET_URL}/${props.lastImagePath}`"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>
