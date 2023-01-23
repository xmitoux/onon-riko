<script setup lang="ts">
  import { ref, watch } from 'vue';
  import dayjs from 'dayjs';
  import { supabase } from '@/utils/supabase';
  import { IMAGES_BUCKET_URL } from '@/consts';
  import type { Image, RikoniRecord } from '@/types';
  import ImageSelector from '@/components/ImageSelector.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const props = defineProps<{
    modelValue: boolean;
    auto?: { startedAt: string; finishedAt: string };
  }>();

  const emit = defineEmits(['update:modelValue', 'close']);

  // 自動入力が渡されたら日時欄にセットするためウォッチ
  watch(props, () => {
    if (props.auto) {
      startedAt.value = props.auto.startedAt;
      finishedAt.value = props.auto.finishedAt;
    }
  });

  const showImageSelector = ref(false);
  const selectedImage = ref<Image | null>(null);

  const onCloseImageSelector = (image: Image | null) => {
    if (image) {
      selectedImage.value = image;
    }

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

  const errorDetail = ref('');
  const showSnackbar = ref(false);

  const recordRikoni = async () => {
    if (!startedAt.value || !finishedAt.value) {
      errorDetail.value = '日時を入力してください。';
      showSnackbar.value = true;
      return;
    }

    if (!selectedImage.value) {
      errorDetail.value = '画像を登録してください。';
      showSnackbar.value = true;
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
      do_interval: 0, // TODO: どうやって出す？
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
      closeDialog();
    }
  };

  const insertRikoniRecord = async (record: RikoniRecord): Promise<boolean> => {
    const { error } = await supabase.from('rikoni_records').insert(record);

    if (error) {
      errorDetail.value = error.message;
      showSnackbar.value = true;
      return false;
    }

    return true;
  };

  const closeDialog = () => {
    selectedImage.value = null;
    rating.value = 0;
    amount.value = 3;
    bodyPosition.value = 1;
    isDrunk.value = false;
    isSleepy.value = false;
    isPreExcited.value = false;
    doneWork.value = false;
    doneExercise.value = false;
    mealCondition.value = 1;

    emit('update:modelValue', false);
    emit('close');
  };
</script>

<template>
  <ImageSelector :open="showImageSelector" @close="onCloseImageSelector" />

  <v-dialog
    :model-value="props.modelValue"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <SnackbarError
      v-model="showSnackbar"
      error-message="登録に失敗しました。"
      :error-detail="errorDetail"
    />

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
            <v-col>
              <v-btn
                prepend-icon="mdi-image-search"
                @click="showImageSelector = true"
              >
                選択
              </v-btn>
            </v-col>
            <v-col>
              <v-btn v-if="selectedImage" @click="selectedImage = null">
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

          <v-row class="ma-1">
            <v-col cols="4">量</v-col>
            <v-col class="pt-1 pl-0 pb-0">
              <v-radio-group v-model="amount" color="pink" hide-details>
                <v-radio label="多い" :value="5"></v-radio>
                <v-radio label="ちょっと多い" :value="4"></v-radio>
                <v-radio label="普通" :value="3"></v-radio>
                <v-radio label="ちょっと少ない" :value="2"></v-radio>
                <v-radio label="少ない" :value="1"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row class="ma-1">
            <v-col cols="4">体位</v-col>

            <v-col class="pt-1 pl-0 pb-0">
              <v-radio-group v-model="bodyPosition" color="pink" hide-details>
                <v-radio label="座位" :value="1"></v-radio>
                <v-radio label="伏位" :value="2"></v-radio>
                <v-radio label="立位" :value="3"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>

          <v-row align="center" class="ma-1">
            <v-col cols="4">体調</v-col>

            <v-col class="ma-0 pa-0" cols="4">
              <v-checkbox
                v-model="isDrunk"
                color="pink"
                hide-details
                label="飲酒"
              />
            </v-col>

            <v-col class="ma-0 pa-0" cols="4">
              <v-checkbox
                v-model="isSleepy"
                color="pink"
                hide-details
                label="眠気"
              />
            </v-col>
          </v-row>

          <v-row class="ma-1">
            <v-col cols="4" />

            <v-col class="ma-0 pa-0" cols="4">
              <v-checkbox
                v-model="doneWork"
                color="pink"
                hide-details
                label="運動"
              />
            </v-col>

            <v-col class="ma-0 pa-0" cols="4">
              <v-checkbox
                v-model="doneExercise"
                color="pink"
                hide-details
                label="労働"
              />
            </v-col>
          </v-row>

          <v-row class="ma-1">
            <v-col cols="4" />
            <v-col class="ma-0 pa-0" cols="4">
              <v-checkbox
                v-model="isPreExcited"
                color="pink"
                hide-details
                label="事前の興奮"
              />
            </v-col>
            <v-col cols="4" />
          </v-row>

          <v-row class="ma-1">
            <v-col cols="4">食事状態</v-col>
            <v-col class="pt-1 pl-0 pb-0">
              <v-radio-group v-model="mealCondition" color="pink" hide-details>
                <v-radio label="食前" :value="1"></v-radio>
                <v-radio label="食間" :value="2"></v-radio>
                <v-radio label="食後" :value="3"></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="d-flex justify-end pb-6 pr-4">
        <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
        <v-btn variant="outlined" @click="recordRikoni">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
