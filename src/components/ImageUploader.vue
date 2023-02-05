<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import type { ImageTag } from '@/types';
  import { useSnackbarError } from '@/utils/use-snackbar-error';
  import SnackbarError from '@/components/SncakbarError.vue';

  const emit = defineEmits(['close']);

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

  const { showSnackbar, errorMessage, errorDetail, showSnackbarError } =
    useSnackbarError();

  const uploadedImagePath = ref('');
  const uploadImage = async () => {
    if (!uploadFile.value) {
      showSnackbarError('画像を選択してください。');
      return;
    }

    const { data, error } = await supabase.storage
      .from('riko-images')
      .upload(uploadFile.value.name, uploadFile.value);

    if (error || !data) {
      showSnackbarError(
        '画像の登録(ストレージ)に失敗しました。',
        error.message
      );
      return;
    }

    uploadedImagePath.value = data.path;

    const { error: error2 } = await supabase.rpc('insert_image_with_tag', {
      in_image_path: uploadedImagePath.value,
      in_tag_ids: selectedTags.value,
    });

    if (error2) {
      showSnackbarError('画像の登録(DB)に失敗しました。', error2.details);
      return;
    }

    closeDialog();
  };

  const deleteImage = () => {
    uploadFile.value = null;
    attachedImage.value = null;
  };

  const imageTags = ref<ImageTag[]>([]);
  const getTags = async () => {
    const { data, error } = await supabase
      .from('image_tags')
      .select('*')
      .order('display_order');

    if (error || !data) {
      showSnackbarError('タグの取得に失敗しました。', error.details);
      return;
    }

    imageTags.value = data as ImageTag[];
  };
  getTags();

  const selectedTags = ref<number[]>([]);

  const closeDialog = () => {
    emit('close');
  };
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    :error-message="errorMessage"
    :error-detail="errorDetail"
  />

  <v-card class="text-center" title="画像を登録する">
    <v-card-text class="pa-4">
      <v-container class="pa-0">
        <v-row align="center" class="mb-2">
          <v-col cols="4">登録画像</v-col>

          <v-col>
            <input
              accept="image/*"
              class="d-none"
              ref="uploader"
              type="file"
              @change="onChangeImage"
            />
            <v-btn @click="selectImage" prepend-icon="mdi-image-album">
              参照
            </v-btn>
          </v-col>

          <v-col>
            <v-btn
              v-if="attachedImage"
              @click="deleteImage"
              prepend-icon="mdi-delete"
            >
              削除
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="ma-0">
          <v-img v-if="attachedImage" max-height="300" :src="attachedImage" />
        </v-row>

        <v-row>
          <v-col cols="4">タグ選択</v-col>
        </v-row>

        <v-row class="ma-0 pl-6">
          <v-col v-for="tag in imageTags" :key="tag.id" class="pa-0" cols="6">
            <v-checkbox
              v-model="selectedTags"
              class="tag-label"
              color="pink"
              hide-details
              :label="tag.name"
              :value="tag.id"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pb-6 pr-4">
      <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
      <v-btn variant="outlined" @click="uploadImage">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .tag-label :deep() .v-label {
    font-size: small;
  }
</style>
