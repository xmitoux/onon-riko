<script setup lang="ts">
import { ref } from 'vue';
import ImageUploader from '@/components/ImageUploader.vue';
const imageUploader = ref(false);
</script>

<template>
  <v-container>
    <v-row class="ma-1" align="center" justify="space-between">
      <v-col cols="4">使用画像</v-col>

      <v-col>
        <v-btn prepend-icon="mdi-image-plus" @click="imageUploader = true">
          登録
        </v-btn>
      </v-col>

      <v-col>
        <v-btn prepend-icon="mdi-pencil">編集</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <ImageUploader :open="imageUploader" @close="imageUploader = false" />
</template>
