<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { supabase } from '@/utils/supabase';
  import { IMAGES_BUCKET_URL } from '@/consts';
  import type { Image } from '@/types';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{ open: boolean }>();
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
        getImages();
      }
    });

    observer.value.observe(observingTarget.value as Element);
  });

  const closeDialog = () => {
    emit('close', selectedImage.value);
    selectedImage.value = null;
  };
</script>

<template>
  <v-dialog
    :model-value="props.open"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <SnackbarError
      v-if="props.open"
      v-model="showSnackbar"
      error-message="画像の取得に失敗しました。"
      :error-detail="errorDetail"
    />

    <v-card class="text-center" title="画像を選択する">
      <v-card-text class="pa-0">
        <v-container>
          <v-row>
            <v-col
              v-for="image in images"
              :key="image.id"
              class="pa-1"
              cols="4"
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
                    <v-progress-circular indeterminate color="grey-lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </v-col>

            <!-- 無限スクロール監視用要素 -->
            <div ref="observingTarget"></div>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="d-flex justify-end pb-6 pr-4">
        <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
