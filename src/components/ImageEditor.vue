<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import type { ImageTag, ImageWithTag } from '@/types';
  import { IMAGES_BUCKET_URL } from '@/consts';
  import { useSnackbarError } from '@/utils/use-snackbar-error';
  import SnackbarError from '@/components/SncakbarError.vue';
  import ImageSelector from '@/components/ImageSelector.vue';

  const emit = defineEmits(['close']);

  const { showSnackbar, errorMessage, errorDetail, showSnackbarError } =
    useSnackbarError();

  const selectedImage = ref<ImageWithTag | null>(null);
  const selectImage = (image: ImageWithTag) => {
    selectedImage.value = image;
    selectedTags.value = selectedImage.value.tag_ids;
  };

  const imageTags = ref<ImageTag[]>([]);
  const getTags = async () => {
    const { data, error } = await supabase
      .from('image_tags')
      .select()
      .order('id');

    if (error || !data) {
      showSnackbarError('タグの取得に失敗しました。', error.details);
      return;
    }

    imageTags.value = data as ImageTag[];
  };
  getTags();

  const selectedTags = ref<number[]>([]);

  const editTag = async () => {
    const { error } = await supabase.rpc('update_image_tag_map', {
      in_image_id: selectedImage.value!.id,
      in_tag_ids: 'selectedTags.value',
    });

    if (error) {
      showSnackbarError('タグの更新に失敗しました。', error.details);
      return;
    }

    closeEditDialog();
  };

  const closeEditDialog = () => {
    selectedImage.value = null;
  };

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

  <ImageSelector @close="closeDialog" @select="selectImage" />

  <v-dialog
    :model-value="!!selectedImage"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="text-center" title="画像タグを編集する">
      <v-card-text class="pa-4">
        <v-container class="pa-0">
          <v-row class="ma-0">
            <v-img
              v-if="selectedImage"
              max-height="300"
              :src="`${IMAGES_BUCKET_URL}/${selectedImage.path}`"
            />
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
        <v-btn variant="outlined" @click="closeEditDialog">キャンセル</v-btn>
        <v-btn variant="outlined" @click="editTag">OK</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
  .tag-label :deep() .v-label {
    font-size: small;
  }
</style>
