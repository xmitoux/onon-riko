<script setup lang="ts">
  import { ref } from 'vue';
  import { supabase } from '@/utils/supabase';
  import type { ImageTag } from '@/types';

  const emit = defineEmits<{
    (e: 'ok', tags: number[]): void;
    (e: 'cancel'): void;
  }>();

  const imageTags = ref<ImageTag[]>([]);

  const getImageTags = async () => {
    const { data, error } = await supabase.from('image_tags').select();
    if (error) {
      return;
    }

    imageTags.value = data as ImageTag[];

    return;
  };
  getImageTags();

  const selectedTags = ref<number[]>([]);

  const onOk = () => {
    emit('ok', selectedTags.value);
  };

  const onCancel = () => {
    emit('cancel');
  };

  const onReset = () => {
    selectedTags.value = [];
    emit('ok', selectedTags.value);
  };
</script>

<template>
  <v-divider />
  <v-card class="elevation-2 text-center" title="タグフィルタ">
    <v-card-text class="pa-0">
      <v-container class="tag-area">
        <v-row>
          <v-col v-for="tag in imageTags" :key="tag.id" class="pa-1" cols="6">
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
      <v-btn variant="outlined" @click="onReset">リセット</v-btn>
      <v-btn variant="outlined" @click="onCancel">戻る</v-btn>
      <v-btn variant="outlined" @click="onOk">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .tag-area {
    height: 540px;
    overflow: scroll;
  }

  .tag-label :deep() .v-label {
    font-size: small;
  }
</style>
