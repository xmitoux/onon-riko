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
    @click="closeSnackbar"
    color="error"
    location="top"
    :model-value="props.modelValue"
    :timeout="-1"
  >
    <v-alert type="error">
      <p>{{ props.errorMessage }}</p>
      <p v-if="props.errorDetail">({{ props.errorDetail }})</p>
    </v-alert>
  </v-snackbar>
</template>

<style scoped></style>
