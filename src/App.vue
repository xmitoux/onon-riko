<script setup lang="ts"></script>

<template>
  <v-app>
    <v-app-bar class="text-center" :elevation="1">
      <v-app-bar-title>OnaOna(R)</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-bottom-navigation :elevation="3" grow height="70">
      <v-btn to="/">
        <v-icon icon="mdi-home" />
      </v-btn>

      <v-btn to="/calendar">
        <v-icon icon="mdi-calendar-month" />
      </v-btn>

      <v-btn to="/ranking">
        <v-icon icon="mdi-crown" />
      </v-btn>

      <v-btn>
        <v-icon icon="mdi-chart-bar" />
      </v-btn>

      <v-btn to="/settings">
        <v-icon icon="mdi-cog" />
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<style scoped></style>
