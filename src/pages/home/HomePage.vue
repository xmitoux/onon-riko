<script setup lang="ts">
import { ref } from 'vue';
import RikoniRecord from '@/components/RikoniRecord.vue';

const dialog = ref(false);
</script>

<template>
  <v-container>
    <v-row class="ma-2" justify="center" no-gutters>
      <v-btn variant="outlined" @click="dialog = true"> 梨子ちゃんと❤️ </v-btn>
    </v-row>
    <v-row class="ma-2" justify="center" no-gutters>
      <v-btn variant="outlined">手動記録</v-btn>
    </v-row>
  </v-container>

  <RikoniRecord :open="dialog" @close="dialog = false" />
</template>
