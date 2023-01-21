<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import type { Image } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';

  const images = ref<Image[]>([]);
  const getImages = async () => {
    const { data } = await supabase
      .from('images')
      .select('*')
      .order('use_count', { ascending: false });

    // TODO: エラー処理
    if (!data) {
      return;
    }

    images.value = data as Image[];
  };
  getImages();
</script>

<template>
  <v-container>
    <v-row v-for="(image, i) in images" :key="i" justify="center">
      <v-col cols="4">{{ i + 1 }}位({{ image.use_count }}回)</v-col>
      <v-col>
        <v-img
          max-height="250"
          max-width="250"
          :src="`${IMAGES_BUCKET_URL}/${image.path}`"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped></style>
