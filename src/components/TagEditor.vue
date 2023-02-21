<script setup lang="ts">
  import { ref } from 'vue';
  import draggable from 'vuedraggable';
  import { supabase } from '@/utils/supabase';
  import { getImagetTags } from '@/service/getImageTags';
  import type { ImageTag } from '@/types';

  const emit = defineEmits(['close']);

  const imageTags = ref<ImageTag[]>([]);

  getImagetTags()
    .then((data) => (imageTags.value = data))
    .catch((e) => console.log(e));

  const removeAt = (index: number) => {
    imageTags.value.splice(index, 1);
  };

  const updateImageTags = async () => {
    const { error } = await supabase.rpc('update_image_tags', {
      in_image_tags_json: imageTags.value.map((data, index) => ({
        ...data,
        display_order: index + 1,
      })),
    });

    if (error) {
      // showSnackbarError('タグの取得に失敗しました。', error.details);
      console.log(error);
      return;
    }

    closeDialog();
  };

  const addTag = () => {
    imageTags.value.push({ id: 0, name: '' });
  };

  const isSorting = ref(false);
  const switchSort = () => {
    isSorting.value = !isSorting.value;
  };

  const closeDialog = () => {
    emit('close');
  };
</script>

<template>
  <v-card class="text-center">
    <v-card-item class="relative">
      <v-card-title>
        タグを編集する
        <v-btn @click="switchSort" class="px-0 sort-btn" variant="text">
          {{ isSorting ? '完了' : '並び替え' }}
        </v-btn>
      </v-card-title>
    </v-card-item>

    <v-card-text class="pa-4">
      <draggable
        v-if="isSorting"
        handle=".handle"
        item-key="name"
        :list="imageTags"
      >
        <template #item="{ element }: { element: ImageTag }">
          <v-row align="center">
            <v-col class="pl-5 pr-0">
              <v-text-field
                v-model="element.name"
                density="compact"
                disabled
                hide-details
                single-line
                variant="solo"
              />
            </v-col>

            <v-col class="px-0" cols="2">
              <v-icon class="handle" icon="mdi-menu" />
            </v-col>
          </v-row>
        </template>
      </draggable>

      <div v-else>
        <v-row v-for="(tag, index) in imageTags" align="center" :key="tag.id">
          <v-col class="pl-5 pr-0">
            <v-text-field
              v-model="tag.name"
              density="compact"
              hide-details
              single-line
              variant="solo"
            />
          </v-col>

          <v-col class="px-0" cols="2">
            <v-icon @click="removeAt(index)" icon="mdi-close" />
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-btn @click="addTag" icon="mdi-plus" />
      </v-row>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pb-6 pr-4">
      <v-btn variant="outlined" @click="closeDialog">キャンセル</v-btn>
      <v-btn variant="outlined" @click="updateImageTags">OK</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
  .relative {
    position: relative;
  }
  .sort-btn {
    position: absolute;
    right: 10px;
  }
</style>
