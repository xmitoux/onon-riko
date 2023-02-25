<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '@/utils/supabase';
  import { useSnackbarError } from '@/utils/use-snackbar-error';
  import SnackbarError from '@/components/SncakbarError.vue';

  const router = useRouter();

  const { showSnackbar, errorMessage, errorDetail, showSnackbarError } =
    useSnackbarError();

  const email = ref('');
  const password = ref('');

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      showSnackbarError('認証に失敗しました。', error.message);
      return;
    }

    localStorage.setItem('userId', data.session!.user.id);
    router.push({ name: 'home' });
  };
</script>

<template>
  <SnackbarError
    v-model="showSnackbar"
    :error-message="errorMessage"
    :error-detail="errorDetail"
  />

  <v-container>
    <v-row class="ma-2">
      <v-text-field v-model="email" label="E-mail" variant="outlined" />
    </v-row>

    <v-row class="ma-2">
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        variant="outlined"
      />
    </v-row>

    <v-row justify="space-around">
      <v-btn @click="login">ログイン</v-btn>
    </v-row>
  </v-container>
</template>

<style scoped></style>
