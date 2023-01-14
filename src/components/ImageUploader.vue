<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/utils/supabase';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['close']);

const closeDialog = () => {
  deleteImage();
  emit('close');
};

const uploader = ref<HTMLInputElement>();
const selectImage = () => {
  uploader.value?.click();
};

const uploadFile = ref<File | null>(null);
const attachedImage = ref<string | null>(null);
const onChangeImage = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (!files?.length) {
    return;
  }

  const file = files[0];
  uploadFile.value = file;

  const fileReader = new FileReader();
  fileReader.onload = (fileEvent) => {
    if (!fileEvent.target) {
      return;
    }

    attachedImage.value = fileEvent.target.result as string;

    // 画像削除後に同じファイルを上げられるようにする
    target.value = '';
  };
  fileReader.readAsDataURL(uploadFile.value);
};

const uploadImage = async () => {
  if (!uploadFile.value) {
    console.log('画像を選択してください');
    return;
  }

  const { data, error } = await supabase.storage
    .from('riko-images')
    .upload(uploadFile.value.name, uploadFile.value)
    .catch();

  console.log(data);
  console.log(error);

  closeDialog();
};

const deleteImage = () => {
  uploadFile.value = null;
  attachedImage.value = null;
};

const fav = ref(false);

type ImageTag = {
  id: number;
  name: string;
};
const imageTags = ref<ImageTag[]>([]);
const getTags = async () => {
  const { data, error } = await supabase
    .from('image_tags')
    .select('*')
    .order('display_order');

  // TODO: エラー処理
  console.log(data);
  console.log(error);

  if (!data) {
    return;
  }

  imageTags.value = data as ImageTag[];
};

getTags();
</script>

<template>
  <v-dialog
    :model-value="props.open"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="text-center" title="画像を登録する">
      <v-card-text class="pa-2">
        <v-container class="pa-0">
          <v-row class="ma-1" align="center" justify="space-between">
            <v-col cols="4">登録画像</v-col>

            <v-col>
              <input
                class="d-none"
                accept="image/*"
                ref="uploader"
                type="file"
                @change="onChangeImage"
              />
              <v-btn @click="selectImage">選択</v-btn>
            </v-col>

            <v-col>
              <v-btn v-if="attachedImage" @click="deleteImage">削除</v-btn>
            </v-col>
          </v-row>

          <v-row class="ma-4">
            <v-img v-if="attachedImage" :src="attachedImage" />
          </v-row>

          <v-row>
            <v-col cols="4">タグ選択</v-col>
          </v-row>

          <template v-for="imageTag in imageTags" :key="imageTag.id">
            <v-checkbox hide-details :label="imageTag.name" />
          </template>

          <v-row class="ma-1" align="center" justify="space-between">
            <v-col cols="4">お気に入り</v-col>

            <v-col><v-switch color="blue" inset v-model="fav" /></v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="d-flex justify-end">
        <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
        <v-btn variant="outlined" @click="uploadImage">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
