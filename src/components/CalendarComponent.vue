<script setup lang="ts">
  import { ref, computed } from 'vue';
  import dayjs, { Dayjs } from 'dayjs';
  import type { RikoniRecordWithImage } from '@/types';
  import { useCalendar } from '@/utils/useCalendar';
  import CalendarDetail from '@/components/CalendarDetail.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{
    date: Dayjs;
  }>();

  const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
  const isSaturday = (dayOfWeek: string) => dayOfWeek === '土';
  const isSunday = (dayOfWeek: string) => dayOfWeek === '日';

  const { getCalendar, getRecords } = useCalendar();

  const calendar = computed(() => getCalendar(props.date));

  const showSnackbar = ref(false);
  const errorDetail = ref('');

  const rikoniRecords = ref<RikoniRecordWithImage[]>([]);
  (async () => {
    const { data, error } = await getRecords();

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    if (data) {
      rikoniRecords.value = data;
    }
  })();

  // レコードを表示中の年月でフィルタする
  const filteredRecords = computed(() => {
    return rikoniRecords.value.filter((record) => {
      const tmp = dayjs(record.started_at);

      return (
        tmp.year() === props.date.year() && tmp.month() === props.date.month()
      );
    });
  });

  const isDoneRikoni = (date: Dayjs) => {
    return filteredRecords.value.some(
      (record) => dayjs(record.started_at).date() === date.date()
    );
  };

  const selectedRecord = ref<RikoniRecordWithImage | null>(null);
  const selectRecord = (date: Dayjs) => {
    const targetRecord = filteredRecords.value.filter(
      (r) => dayjs(r.started_at).date() === date.date()
    );

    selectedRecord.value = targetRecord[0];
  };
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    error-message="レコードの取得に失敗しました。"
    :error-detail="errorDetail"
  />

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
        v-for="(date, index) in week"
        class="calendar-cell pa-0"
        :key="index"
      >
        <div v-if="date">
          <v-sheet class="pl-1" height="20">
            {{ date.date() }}
          </v-sheet>

          <div class="text-center">
            <v-icon
              v-if="isDoneRikoni(date)"
              @click="selectRecord(date)"
              color="pink"
              icon="mdi-heart"
              size="small"
            />
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>

  <CalendarDetail :record="selectedRecord" />
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
