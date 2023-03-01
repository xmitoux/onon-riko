<script setup lang="ts">
  const props = defineProps<{
    modelValue: boolean;
    message: string;
  }>();

  const emits = defineEmits(['update:modelValue']);

  const closeSnackbar = () => {
    emits('update:modelValue', false);
  };
</script>

<template>
  <v-snackbar
    @click="closeSnackbar"
    color="success"
    location="top"
    :model-value="props.modelValue"
    :timeout="-1"
  >
    <v-alert class="px-0" type="success">
      <p>{{ props.message }}</p>
    </v-alert>
  </v-snackbar>
</template>
