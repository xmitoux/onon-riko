<script setup lang="ts">
  const props = defineProps<{ countTotal: number; doTimeTotal: number }>();
</script>

<template>
  <v-sheet class="mx-5 mt-6 px-3" color="#FFD6DE" height="85" rounded="lg">
    <v-row align="center" class="text-center" style="height: 80px">
      <v-col class="">
        <div class="text-caption">総実施回数</div>

        <template v-if="true">
          <div class="text-h6">{{ props.countTotal }}回</div>
        </template>

        <template v-else>
          <v-sheet color="#FFD6DE" height="60" />
        </template>
      </v-col>

      <v-divider inset length="70" vertical />

      <v-col class="">
        <div class="text-caption">総実施時間</div>

        <template v-if="true">
          <div class="text-h6">{{ props.doTimeTotal }}分</div>
        </template>

        <template v-else>
          <v-sheet color="#FFD6DE" height="64" />
        </template>
      </v-col>
    </v-row>
  </v-sheet>
</template>
