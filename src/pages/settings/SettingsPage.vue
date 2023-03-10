<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import { useSnackbarSuccess, useSnackbarError } from '@/utils/use-snackbar';
  import ImageUploader from '@/pages/settings/ImageUploader.vue';
  import ImageEditor from '@/pages/settings/ImageEditor.vue';
  import TagEditor from '@/pages/settings/TagEditor.vue';
  import SncakbarSuccess from '@/components/SncakbarSuccess.vue';
  import SnackbarError from '@/components/SncakbarError.vue';

  const imageUploader = ref(false);
  const imageEditor = ref(false);
  const tagEditor = ref(false);

  const targetCount = ref(0);

  const {
    showSnackbar: snackbarError,
    showSnackbarError,
    errorMessage,
    errorDetail,
  } = useSnackbarError();

  const getTargetCount = async () => {
    const { data, error } = await supabase.from('settings').select().single();

    if (error) {
      showSnackbarError(error.message, errorDetail.value);
    }

    targetCount.value = data.target_count_per_month;
  };
  getTargetCount();

  const { snackbarSuccess, successMessage, showSnackbarSuccess } =
    useSnackbarSuccess();

  const updateTargetCount = async () => {
    const { error } = await supabase
      .from('settings')
      .update({ target_count_per_month: targetCount.value })
      .eq('id', 1);

    if (error) {
      showSnackbarError(error.message, errorDetail.value);
      return;
    }

    showSnackbarSuccess('月間目標回数を更新しました。');
  };
</script>

<template>
  <v-container>
    <v-row class="ma-1" align="center" justify="space-between">
      <v-col cols="4">使用画像</v-col>

      <v-col>
        <v-btn @click="imageUploader = true" prepend-icon="mdi-image-plus">
          登録
        </v-btn>
      </v-col>

      <v-col>
        <v-btn @click="imageEditor = true" prepend-icon="mdi-pencil">
          編集
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="ma-1" align="center" justify="space-between">
      <v-col cols="4">画像タグ</v-col>

      <v-col>
        <v-btn @click="tagEditor = true" prepend-icon="mdi-pencil">編集</v-btn>
      </v-col>
    </v-row>

    <v-row class="ma-1 text-body-2" align="center">
      <v-col cols="4">月間目標回数</v-col>

      <v-col class="pt-5 pb-0" cols="4">
        <v-text-field v-model="targetCount" variant="outlined" />
      </v-col>

      <v-col>
        <v-btn @click="updateTargetCount">設定</v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog
    v-model="imageUploader"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <ImageUploader @close="imageUploader = false" />
  </v-dialog>

  <v-dialog
    v-model="imageEditor"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <ImageEditor @close="imageEditor = false" />
  </v-dialog>

  <v-dialog
    v-model="tagEditor"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <TagEditor @close="tagEditor = false" />
  </v-dialog>

  <SncakbarSuccess v-model="snackbarSuccess" :message="successMessage" />

  <SnackbarError
    v-model="snackbarError"
    :error-message="errorMessage"
    :error-detail="errorDetail"
  />
</template>
