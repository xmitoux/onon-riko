<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '@/utils/supabase';
import { IMAGES_BUCKET_URL } from '@/consts';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits<{
  (e: 'close', selectedImage: Image | null): void;
}>();

const closeDialog = () => {
  emit('close', selectedImage.value);
  selectedImage.value = null;
};

const iamges = ref<Image[]>([]);
const getImages = async () => {
  const { data } = await supabase
    .from('images')
    .select('*')
    .order('id', { ascending: true });

  // TODO: エラー処理
  if (!data) {
    return;
  }

  iamges.value = data as Image[];
};
getImages();

const selectedImage = ref<Image | null>(null);
</script>

<template>
  <v-dialog
    :model-value="props.open"
    fullscreen
    scrollable
    transition="dialog-bottom-transition"
  >
    <v-card class="text-center" title="画像を選択する">
      <v-card-text class="pa-2">
        <v-container class="pa-0">
          <v-row>
            <v-col
              v-for="image in iamges"
              :key="image.id"
              class="d-flex child-flex"
              cols="4"
            >
              <v-img
                aspect-ratio="1"
                cover
                :src="`${IMAGES_BUCKET_URL}/${image.path}`"
                v-ripple
                @click="(selectedImage = image), closeDialog()"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey-lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-btn block @click="closeDialog">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
