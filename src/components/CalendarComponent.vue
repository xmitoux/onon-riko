<script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  import dayjs from 'dayjs';
  import { supabase } from '@/utils/supabase';
  import type { Calendar, CalendarWeek, RikoniRecord, Image } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const currentDate = ref(dayjs());
  const currentMonth = computed(() => currentDate.value.get('month'));

  type RikoniRecordWithImage = RikoniRecord & { images: Image };
  const rikoniRecords = ref<RikoniRecordWithImage[]>([]);
  const getRikoniRecords = async () => {
    const firstDayOfMonth = currentDate.value.startOf('month');
    const lastDayOfMonth = currentDate.value.endOf('month');

    const { data, error } = await supabase
      .from('rikoni_records')
      .select('*, images(*)')
      .gte('started_at', firstDayOfMonth.format('YYYY-MM-DD HH:mm:ss'))
      .lte('started_at', lastDayOfMonth.format('YYYY-MM-DD HH:mm:ss'));

    // TODO: エラー処理
    if (!data) {
      return;
    }

    rikoniRecords.value = data as RikoniRecordWithImage[];
  };

  watch(currentDate, () => getRikoniRecords(), { immediate: true });

  const getStartDate = () => {
    const day1 = dayjs(currentDate.value).startOf('month');
    const day1Number = day1.day();
    return day1.subtract(day1Number, 'days');
  };

  const calendar = computed(() => getCalendar());
  const getCalendar = (): Calendar => {
    const tmpCalendar: Calendar = [];
    let startDate = getStartDate();

    for (let weekNumber = 0; weekNumber < 5; weekNumber++) {
      const week: CalendarWeek = [];
      for (let day = 0; day < 7; day++) {
        const date =
          startDate.get('month') === currentMonth.value
            ? startDate.get('date')
            : 0;
        week.push({ date });
        startDate = startDate.add(1, 'days');
      }
      tmpCalendar.push(week);
    }

    return tmpCalendar;
  };

  const isDoneRikoni = (day: number) => {
    const startedDates = rikoniRecords.value.map((record) =>
      dayjs(record.started_at).get('date')
    );

    return startedDates.some((date) => date === day);
  };

  const selectedRecord = ref<RikoniRecordWithImage | null>(null);
  const selectRecord = (day: number) => {
    const targetRecord = rikoniRecords.value.filter(
      (r) => dayjs(r.started_at).get('date') === day
    );

    selectedRecord.value = targetRecord[0];
  };

  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const isSaturday = (dayOfWeek: string) => dayOfWeek === '土';
  const isSunday = (dayOfWeek: string) => dayOfWeek === '日';
</script>

<template>
  <span>{{ currentDate.get('year') }}/{{ currentMonth + 1 }}</span>
  <v-btn @click="currentDate = currentDate.subtract(1, 'month')">前の月</v-btn>
  <v-btn @click="currentDate = dayjs()">今日</v-btn>
  <v-btn @click="currentDate = currentDate.add(1, 'month')">次の月</v-btn>

  <v-container class="px-6">
    <v-row>
      <v-col
        v-for="day in dayOfWeek"
        class="text-center pa-0 ma-0 day-of-week"
        :class="{ sunday: isSunday(day), saturday: isSaturday(day) }"
        :key="day"
      >
        {{ day }}
      </v-col>
    </v-row>

    <v-row
      v-for="(week, index) in calendar"
      class="calendar-row"
      :class="{ 'calendar-row-top': index === 0 }"
      :key="index"
    >
      <v-col
        v-for="(day, index) in week"
        class="calendar-cell pa-0"
        :key="index"
      >
        <div>
          <v-sheet v-if="day.date !== 0" class="pl-1" height="20">
            {{ day.date }}
          </v-sheet>

          <div class="text-center">
            <v-icon
              v-if="isDoneRikoni(day.date)"
              @click="selectRecord(day.date)"
              color="pink"
              icon="mdi-heart"
              size="small"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-if="selectedRecord">
    <v-row>
      <v-col cols="3">実施日時</v-col>
      <v-col>
        {{ dayjs(selectedRecord.started_at).format('HH:mm') }} 〜
        {{ dayjs(selectedRecord.finished_at).format('HH:mm') }}
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="3">評価</v-col>
      <v-rating
        :model-value="selectedRecord.rating"
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
        :src="`${IMAGES_BUCKET_URL}/${selectedRecord.images.path}`"
      ></v-img>
    </v-row>
  </v-container>
</template>

<style scoped>
  .day-of-week {
    font-size: small;
  }

  .sunday {
    color: tomato;
  }

  .saturday {
    color: cornflowerblue;
  }

  .calendar-row {
    border-left: solid 1px black;
  }

  .calendar-row-top {
    border-top: solid 1px black;
  }

  .calendar-cell {
    border-right: solid 1px black;
    border-bottom: solid 1px black;
    height: 50px;
  }
</style>
