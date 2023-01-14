<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import { supabase } from '@/utils/supabase';
import ImageSelector from '@/components/ImageSelector.vue';
import { IMAGES_BUCKET_URL } from '@/consts';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['close']);

const startedAt = ref('');
const finishedAt = ref('');

const showImageSelector = ref(false);
const valid = ref(false);

const closeDialog = () => {
  selectedImage.value = null;
  emit('close');
};

const selectedImage = ref<Image | null>(null);
const onCloseImageSelector = (image: Image) => {
  selectedImage.value = image;
  imageSelector.value = false;
};

const rating = ref(0);
const amount = ref(0);

type RikoniRecord = {
  started_at: string;
  finished_at: string;
  do_time: number;
  image_id: number;
  do_interval: number;
  rating: number;
  amount: number;
  is_drunk: boolean;
  is_sleepy: boolean;
  is_pre_excited: boolean;
  done_work: boolean;
  done_exercise: boolean;
  meal_condition: number;
  body_position: number;
  item_id: number;
};

const insertRikoniRecord = async (record: RikoniRecord) => {
  const { data, error } = await supabase
    .from('rikoni_records')
    .insert(record)
    .select('*');

  // TODO: エラー処理
  if (!data) {
    return;
  }

  closeDialog();
};

const recordRikoni = () => {
  if (!selectedImage.value) {
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
    is_drunk: false,
    is_sleepy: false,
    is_pre_excited: false,
    done_work: false,
    done_exercise: false,
    meal_condition: 1,
    body_position: 1,
    item_id: 1,
  };

  insertRikoniRecord(record);
};
</script>

<template>
  <v-dialog
    :model-value="props.open"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="text-center" title="記録する">
      <v-card-text class="pa-0">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container class="pa-0">
            <v-row class="ma-1" align="center" justify="space-between">
              <v-col cols="4">開始日時</v-col>
              <v-col>
                <v-text-field v-model="startedAt" type="datetime-local" />
              </v-col>
            </v-row>

            <v-row class="ma-1" align="center" justify="space-between">
              <v-col cols="4">終了日時</v-col>
              <v-col>
                <v-text-field v-model="finishedAt" type="datetime-local" />
              </v-col>
            </v-row>

            <v-row class="ma-1" align="center" justify="space-between">
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

            <v-row class="ma-4">
              <v-img
                v-if="selectedImage"
                class="pa-0"
                max-height="250"
                :src="`${IMAGES_BUCKET_URL}/${selectedImage.path}`"
              ></v-img>
            </v-row>

            <v-row class="ma-1">
              <v-col cols="4">評価</v-col>
              <v-col>
                <v-rating
                  v-model="rating"
                  color="pink"
                  empty-icon="mdi-heart-outline"
                  full-icon="mdi-heart"
                  half-icon="mdi-heart-half"
                  half-increments
                  hover
                  size="40"
                ></v-rating>
              </v-col>
            </v-row>

            <v-row class="ma-1">
              <v-col cols="4">量</v-col>
              <v-col>
                <v-radio-group v-model="amount">
                  <v-radio label="多い" :value="5"></v-radio>
                  <v-radio label="ちょっと多い" :value="4"></v-radio>
                  <v-radio label="普通" :value="3"></v-radio>
                  <v-radio label="ちょっと少ない" :value="2"></v-radio>
                  <v-radio label="少ない" :value="1"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
        <v-btn variant="outlined" @click="recordRikoni">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <ImageSelector :open="showImageSelector" @close="onCloseImageSelector" />
</template>
