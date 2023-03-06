import type { Dayjs } from 'dayjs';
import { supabase } from './supabase';
import type { Calendar, CalendarWeek, RikoniRecordWithImage } from '@/types';

const getStartDate = (date: Dayjs) => {
  const day1 = date.startOf('month');
  const day1Number = day1.day();
  return day1.subtract(day1Number, 'days');
};

export const useCalendar = () => {
  const getCalendar = (currentDate: Dayjs): Calendar => {
    const tmpCalendar: Calendar = [];
    let tmpDate = getStartDate(currentDate);

    for (let weekNumber = 0; weekNumber < 5; weekNumber++) {
      const week: CalendarWeek = [];

      for (let day = 0; day < 7; day++) {
        const date = tmpDate.month() === currentDate.month() ? tmpDate : null;
        week.push(date);
        tmpDate = tmpDate.add(1, 'days');
      }

      tmpCalendar.push(week);
    }

    return tmpCalendar;
  };

  const getRecords = async () => {
    const { data, error } = await supabase
      .from('rikoni_records')
      .select('*, images(*)')
      .order('started_at');

    if (!data) {
      return {
        data: null,
        error,
      };
    }

    return {
      data: data as RikoniRecordWithImage[],
      error: null,
    };
  };

  return {
    getCalendar,
    getRecords,
  };
};
