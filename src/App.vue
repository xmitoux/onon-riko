<script setup lang="ts">
  import { ref } from 'vue';

  const appBarTitle = ref('OnaOna(R)');
</script>

<template>
  <v-app>
    <v-app-bar class="text-center" :elevation="1">
      <v-app-bar-title class="app-title">
        {{ appBarTitle }}
      </v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-bottom-navigation :elevation="3" grow height="100">
      <v-btn @click="appBarTitle = 'OnaOna(R)'" to="/">
        <v-icon icon="mdi-home" />
      </v-btn>

      <v-btn @click="appBarTitle = 'カレンダー'" to="/calendar">
        <v-icon icon="mdi-calendar-month" />
      </v-btn>

      <v-btn @click="appBarTitle = 'ランキング'" to="/ranking">
        <v-icon icon="mdi-crown" />
      </v-btn>

      <v-btn @click="appBarTitle = '統計'" to="statistics">
        <v-icon icon="mdi-chart-bar" />
      </v-btn>

      <v-btn @click="appBarTitle = '設定'" to="/settings">
        <v-icon icon="mdi-cog" />
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Balsamiq+Sans&display=swap');

  .app-title {
    font-family: 'Balsamiq Sans', cursive;
    font-size: x-large;
  }
</style>
