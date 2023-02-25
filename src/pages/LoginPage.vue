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
  <v-row>
    <v-text-field v-model="email" />
  </v-row>

  <v-row>
    <v-text-field v-model="password" type="password" />
  </v-row>

  <v-row>
    <v-btn @click="login">ログイン</v-btn>
  </v-row>
</template>

<style scoped></style>
