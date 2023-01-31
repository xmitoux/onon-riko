import type { Dayjs } from 'dayjs';

export type Image = {
  id: number;
  path: string;
  use_count: number;
  is_fav: boolean;
};

export type Calendar = CalendarWeek[];
export type CalendarWeek = CalendarDate[];
export type CalendarDate = Dayjs | null;

export type RikoniRecord = {
  started_at: string;
  finished_at: string;
  do_time: number;
  image_id: number;
  do_interval?: string;
  rating: number;
  amount: number;
  body_position: number;
  is_drunk: boolean;
  is_sleepy: boolean;
  is_pre_excited: boolean;
  done_work: boolean;
  done_exercise: boolean;
  meal_condition: number;
  item_id: number;
};

export type RikoniRecordWithImage = RikoniRecord & { images: Image };
