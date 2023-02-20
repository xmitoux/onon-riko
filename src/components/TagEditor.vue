<script setup lang="ts">
  import { ref } from 'vue';
  import draggable from 'vuedraggable';
  import { supabase } from '@/utils/supabase';
  import { geImagetTags } from '@/service/getImageTags';
  import type { ImageTag } from '@/types';

  const emit = defineEmits(['close']);

  const imageTags = ref<ImageTag[]>([]);

  geImagetTags()
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

  const closeDialog = () => {
    emit('close');
  };
</script>

<template>
  <v-card class="text-center" title="画像タグを編集する">
    <v-card-text class="pa-4">
      <draggable
        class="list-group"
        handle=".handle"
        item-key="name"
        :list="imageTags"
      >
        <template
          #item="{ element, index }: { element: ImageTag, index: number }"
        >
          <div class="list-group-item">
            <v-row align="center">
              <v-col cols="1">
                <v-icon class="handle" icon="mdi-menu" />
              </v-col>

              <v-col>
                <v-text-field
                  v-model="element.name"
                  density="compact"
                  variant="solo"
                  single-line
                  hide-details
                />
              </v-col>

              <v-col cols="1">
                <v-btn
                  @click="removeAt(index)"
                  icon="mdi-close"
                  :ripple="false"
                  size="x-small"
                  variant="text"
                />
              </v-col>
            </v-row>
          </div>
        </template>
      </draggable>

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

<style scoped></style>
