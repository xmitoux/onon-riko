<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import type { Image } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';
  import SnackbarError from '@/components/SncakbarError.vue';

  const images = ref<Image[]>([]);
  const errorDetail = ref('');
  const getImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .order('use_count', { ascending: false });

    if (!data) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    images.value = data as Image[];
  };

  getImages();

  const showSnackbar = ref(false);
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    error-message="画像の取得に失敗しました。"
    :error-detail="errorDetail"
  />

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
