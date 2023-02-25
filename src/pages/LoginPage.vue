<script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { supabase } from '@/utils/supabase';

  const router = useRouter();

  const email = ref('');
  const password = ref('');

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) {
      console.log(error);
      return;
    }

    localStorage.setItem('userId', data.session!.user.id);
    router.push('/');
  };
</script>

<template>
  <v-container class="">
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
