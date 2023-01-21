<script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean;
    errorMessage: string;
    errorDetail: string;
  }>();

  const emits = defineEmits(['update:modelValue']);

  const closeSnackbar = () => {
    emits('update:modelValue', false);
  };
</script>

<template>
  <v-snackbar
    :model-value="props.modelValue"
    color="error"
    location="top"
    :timeout="-1"
  >
    <v-alert type="error">
      <p>{{ props.errorMessage }}</p>
      <p>({{ props.errorDetail }})</p>
    </v-alert>
    <template v-slot:actions>
      <v-btn variant="text" @click="closeSnackbar">OK</v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped></style>
