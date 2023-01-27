<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { supabase } from '@/utils/supabase';

  import type { Image } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';

  import RankingDetail from '@/components/RankingDetail.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  type RankedImage = Image & { rank: number };

  const showSnackbar = ref(false);
  const errorDetail = ref('');

  // 無限スクロール用に画像を10枚ずつ取得する
  const images = ref<RankedImage[]>([]);
  const imageGetLimitLow = ref(0);
  const imageGetLimitHigh = ref(10);
  const imageGetLimitStep = ref(10);
  const getImages = async () => {
    const { data, error } = await supabase
      .rpc('get_ranked_images')
      .select()
      .range(imageGetLimitLow.value, imageGetLimitHigh.value);

    if (!data) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    if (!data.length) {
      return;
    }

    images.value = [...images.value, ...(data as RankedImage[])];
    imageGetLimitLow.value = imageGetLimitHigh.value + 1;
    imageGetLimitHigh.value = imageGetLimitHigh.value + imageGetLimitStep.value;
  };
  getImages();

  const showDetail = ref(false);
  const selectedImage = ref({ id: 0, path: '' });

  const showDetailDialog = (imageId: number, imagePath: string) => {
    showDetail.value = true;
    selectedImage.value.id = imageId;
    selectedImage.value.path = imagePath;
  };

  // 無限スクロール処理
  // (スクロール最下部に監視対象要素を置き、それが表示されたら画像の続きを取得する)
  const observer = ref<IntersectionObserver | null>(null);
  const observingTarget = ref<Element | null>(null);
  watch(observingTarget, () => {
    if (!observingTarget.value) {
      // 画面を閉じるとnullになるので何もしないようreturn
      return;
    }

    observer.value = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.isIntersecting) {
        if (images.value.length) {
          // 画面を開いた直後は無限スクロールによる画像取得はしない
          // (createdでのgetImages()と同時に実行され画像を重複して取得してしまうため)
          getImages();
        }
      }
    });

    observer.value.observe(observingTarget.value as Element);
  });
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    error-message="画像の取得に失敗しました。"
    :error-detail="errorDetail"
  />

  <v-container>
    <v-row v-for="(image, i) in images" :key="i" justify="center">
      <v-col cols="4">{{ image.rank }}位 ({{ image.use_count }}回)</v-col>
      <v-col>
        <v-img
          @click="
            showDetailDialog(image.id, `${IMAGES_BUCKET_URL}/${image.path}`)
          "
          max-height="250"
          max-width="250"
          :src="`${IMAGES_BUCKET_URL}/${image.path}`"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                color="pink"
                indeterminate
                :size="50"
                :width="5"
              />
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>

    <!-- 無限スクロール監視用-->
    <div ref="observingTarget"></div>

    <v-dialog
      v-model="showDetail"
      fullscreen
      scrollable
      transition="dialog-bottom-transition"
    >
      <RankingDetail
        @close="showDetail = false"
        :image-id="selectedImage.id"
        :image-path="selectedImage.path"
      />
    </v-dialog>
  </v-container>
</template>

<style scoped></style>
