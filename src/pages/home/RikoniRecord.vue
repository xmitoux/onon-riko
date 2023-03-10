<script setup lang="ts">
  import { ref, watch } from 'vue';
  import dayjs from 'dayjs';
  import { supabase } from '@/utils/supabase';
  import { useSnackbarError } from '@/utils/use-snackbar';
  import { IMAGES_BUCKET_URL } from '@/consts';
  import type { Image, RikoniRecord } from '@/types';
  import ImageSelector from '@/components/image-selector/ImageSelector.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{
    auto?: { startedAt: string; finishedAt: string };
  }>();

  const emit = defineEmits<{
    (e: 'close', result: boolean): void;
  }>();

  // 自動入力が渡されたら日時欄にセットするためウォッチ
  watch(props, () => {
    if (props.auto) {
      startedAt.value = props.auto.startedAt;
      finishedAt.value = props.auto.finishedAt;
    }
  });

  const showImageSelector = ref(false);
  const selectedImage = ref<Image | null>(null);

  const selectImage = (image: Image) => {
    selectedImage.value = image;
    closeImageSelector();
  };

  const closeImageSelector = () => {
    showImageSelector.value = false;
  };

  const startedAt = ref('');
  const finishedAt = ref('');
  const rating = ref(0);
  const amount = ref(3);
  const bodyPosition = ref(1);
  const isDrunk = ref(false);
  const isSleepy = ref(false);
  const isPreExcited = ref(false);
  const doneWork = ref(false);
  const doneExercise = ref(false);
  const mealCondition = ref(1);

  const {
    showSnackbar: snackbarError,
    showSnackbarError,
    errorMessage,
    errorDetail,
  } = useSnackbarError();

  const recordRikoni = async () => {
    if (!startedAt.value || !finishedAt.value) {
      showSnackbarError('日時を入力してください。');
      return;
    }

    if (!selectedImage.value) {
      showSnackbarError('画像を登録してください。');
      return;
    }

    const start = dayjs(startedAt.value);
    const finish = dayjs(finishedAt.value);
    const doTime = finish.diff(start, 'minute');

    const record: RikoniRecord = {
      started_at: startedAt.value,
      finished_at: finishedAt.value,
      do_time: doTime,
      image_id: selectedImage.value.id,
      rating: rating.value,
      amount: amount.value,
      is_drunk: isDrunk.value,
      is_sleepy: isSleepy.value,
      is_pre_excited: isPreExcited.value,
      done_work: doneWork.value,
      done_exercise: doneExercise.value,
      meal_condition: mealCondition.value,
      body_position: bodyPosition.value,
      item_id: 1,
    };

    if (await insertRikoniRecord(record)) {
      closeDialog(true);
    }
  };

  const insertRikoniRecord = async (record: RikoniRecord): Promise<boolean> => {
    const { error } = await supabase.from('rikoni_records').insert(record);

    if (error) {
      showSnackbarError(error.message, error.details);
      return false;
    }

    return true;
  };

  const closeDialog = (result: boolean) => {
    emit('close', result);
  };
</script>

<template>
  <v-dialog
    v-model="showImageSelector"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <ImageSelector @close="closeImageSelector" @select="selectImage" />
  </v-dialog>

  <v-card class="text-center" title="記録する">
    <v-card-text class="pa-0">
      <v-container class="pa-0">
        <v-row align="center" class="ma-1">
          <v-col cols="4">開始日時</v-col>
          <v-col>
            <v-text-field
              v-model="startedAt"
              hide-details
              type="datetime-local"
            />
          </v-col>
        </v-row>

        <v-row align="center" class="ma-1">
          <v-col cols="4">終了日時</v-col>
          <v-col>
            <v-text-field
              v-model="finishedAt"
              hide-details
              type="datetime-local"
            />
          </v-col>
        </v-row>

        <v-row align="center" class="ma-1">
          <v-col cols="4">使用画像</v-col>
          <v-col class="pl-0">
            <v-btn
              @click="showImageSelector = true"
              prepend-icon="mdi-image-search"
            >
              選択
            </v-btn>
          </v-col>
          <v-col>
            <v-btn
              v-if="selectedImage"
              @click="selectedImage = null"
              prepend-icon="mdi-delete"
            >
              削除
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="selectedImage" class="ma-1">
          <v-col cols="4" />
          <v-img
            class="px-3"
            max-height="230"
            :src="`${IMAGES_BUCKET_URL}/${selectedImage.path}`"
          ></v-img>
        </v-row>

        <v-row align="center" class="ma-1">
          <v-col class="" cols="4">評価</v-col>
          <v-rating
            v-model="rating"
            class="pl-1"
            color="pink"
            empty-icon="mdi-heart-outline"
            full-icon="mdi-heart"
            half-icon="mdi-heart-half"
            half-increments
            size="35"
          />
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pb-6 pr-4">
      <v-btn variant="outlined" @click="closeDialog(false)">戻る</v-btn>
      <v-btn variant="outlined" @click="recordRikoni">OK</v-btn>
    </v-card-actions>
  </v-card>

  <SnackbarError
    v-model="snackbarError"
    :error-message="errorMessage"
    :error-detail="errorDetail"
  />
</template>
