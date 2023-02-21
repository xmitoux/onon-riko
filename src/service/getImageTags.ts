import { supabase } from '@/utils/supabase';
import type { ImageTag } from '@/types';

export const getImagetTags = async () => {
  const { data, error } = await supabase
    .from('image_tags')
    .select()
    .order('display_order');

  if (error) {
    throw error;
  }

  return data as ImageTag[];
};
