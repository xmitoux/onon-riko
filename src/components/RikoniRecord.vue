<script setup lang="ts">
import { ref } from 'vue';
// import ImageSelector from '@/components/ImageSelector.vue';

const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['close']);

const imageSelector = ref(false);
const valid = ref(false);

const closeDialog = () => {
  emit('close');
};

const imgUrl = ref('');
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
                <v-text-field type="datetime-local"></v-text-field>
              </v-col>
            </v-row>

            <v-row class="ma-1" align="center" justify="space-between">
              <v-col cols="4">終了日時</v-col>
              <v-col>
                <v-text-field type="datetime-local"></v-text-field>
              </v-col>
            </v-row>

            <v-row class="ma-1" align="center" justify="space-between">
              <v-col cols="4">使用画像</v-col>
              <v-col>
                <v-btn
                  prepend-icon="mdi-image-search"
                  @click="imageSelector = true"
                >
                  選択
                </v-btn>
              </v-col>
            </v-row>

            <v-img :src="imgUrl"></v-img>
          </v-container>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn block @click="closeDialog">キャンセル</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <ImageSelector :open="imageSelector" @close="imageSelector = false" /> -->
</template>
