<script setup lang="ts">
  import { computed, ref, watch } from 'vue';
  import { supabase } from '@/utils/supabase';
  import { IMAGES_BUCKET_URL } from '@/consts';
  import type { Image } from '@/types';
  import SnackbarError from '@/components/SncakbarError.vue';
  import TagFilter from '@/components/ImageTagFilter.vue';

  const emit = defineEmits<{
    (e: 'close', selectedImage: Image | null): void;
  }>();

  const selectedImage = ref<Image | null>(null);

  const showSnackbar = ref(false);
  const errorDetail = ref('');

  const images = ref<Image[]>([]);

  // 無限スクロール用に画像を10枚ずつ取得する
  const imageGetLimitLow = ref(0);
  const imageGetLimitHigh = ref(10);
  const imageGetLimitStep = ref(10);

  const getImages = async () => {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .range(imageGetLimitLow.value, imageGetLimitHigh.value)
      .order('id', { ascending: true });

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    images.value = [...images.value, ...(data as Image[])];
    imageGetLimitLow.value = imageGetLimitHigh.value + 1;
    imageGetLimitHigh.value = imageGetLimitHigh.value + imageGetLimitStep.value;

    return;
  };
  getImages();

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

  const closeDialog = () => {
    emit('close', selectedImage.value);
  };

  const tagFilterDrawer = ref(false);
  const selectedTags = ref<number[]>([]);
  const selectImageTag = (tags: number[]) => {
    selectedTags.value = tags;
    tagFilterDrawer.value = false;
  };

  type ImageTagMap = { image_id: number; tag_id: number };
  const imageTagMap = ref<ImageTagMap[]>([]);
  const getImageTagMap = async () => {
    const { data, error } = await supabase.from('image_tag_map').select();

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return;
    }

    imageTagMap.value = data as ImageTagMap[];

    return;
  };
  getImageTagMap();

  const filteredImages = computed(() => {
    if (!selectedTags.value.length) {
      return images.value;
    }

    const filteredImageTagMap = imageTagMap.value
      .filter((map) => selectedTags.value.includes(map.tag_id))
      .map((map) => map.image_id);

    const filteredImagesByTag = images.value.filter((image) =>
      filteredImageTagMap.includes(image.id)
    );

    return filteredImagesByTag;
  });
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    error-message="画像の取得に失敗しました。"
    :error-detail="errorDetail"
  />

  <v-card class="text-center">
    <v-layout>
      <v-app-bar class="elevation-0" color="white">
        <v-app-bar-title class="pl-10">画像を選択する</v-app-bar-title>

        <v-btn @click="tagFilterDrawer = !tagFilterDrawer" icon="mdi-filter" />
      </v-app-bar>

      <v-navigation-drawer
        v-model="tagFilterDrawer"
        location="right"
        temporary
        width="350"
      >
        <TagFilter @ok="selectImageTag" @cancel="tagFilterDrawer = false" />
      </v-navigation-drawer>

      <v-main class="scrollable">
        <v-card-text class="pa-0">
          <v-container>
            <v-row>
              <v-col
                v-for="image in filteredImages"
                :key="image.id"
                class="pa-1"
                cols="6"
              >
                <v-img
                  @click="(selectedImage = image), closeDialog()"
                  aspect-ratio="1"
                  cover
                  :src="`${IMAGES_BUCKET_URL}/${image.path}`"
                >
                  <template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="grey-lighten-5"
                      />
                    </v-row>
                  </template>
                </v-img>
              </v-col>

              <div ref="observingTarget"></div>
            </v-row>
          </v-container>
        </v-card-text>
      </v-main>
    </v-layout>

    <v-card-actions class="d-flex justify-end pb-6 pr-4">
      <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .scrollable {
    overflow: scroll;
  }
</style>
