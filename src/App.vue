<script setup lang="ts"></script>

<template>
  <v-app>
    <v-app-bar class="text-center" :elevation="1">
      <v-app-bar-title>OnaOna</v-app-bar-title>
    </v-app-bar>

    <v-bottom-navigation grow :elevation="3">
      <v-btn value="recent">
        <v-icon icon="mdi-home" />
      </v-btn>

      <v-btn value="nearby">
        <v-icon icon="mdi-calendar-month" />
      </v-btn>

      <v-btn value="favorites">
        <v-icon icon="mdi-heart" />
      </v-btn>

      <v-btn value="nearby">
        <v-icon icon="mdi-chart-bar" />
      </v-btn>

      <v-btn value="favorites">
        <v-icon icon="mdi-cog" />
      </v-btn>
    </v-bottom-navigation>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<style scoped></style>
