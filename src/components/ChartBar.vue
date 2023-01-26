<script setup lang="ts">
  import { computed, watch } from 'vue';
  import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Title,
  } from 'chart.js';
  import { Bar } from 'vue-chartjs';

  ChartJS.defaults.backgroundColor = '#9BD0F5';
  ChartJS.register(BarElement, CategoryScale, LinearScale, Title);

  const props = defineProps<{
    title: string;
    datasets: Map<number, number>;
  }>();

  const emit = defineEmits(['click']);

  const data = computed(() => {
    return {
      labels: [...props.datasets.keys()],
      datasets: [{ data: [...props.datasets.values()] }],
    };
  });

  const options = {
    responsive: true,

    plugins: {
      title: {
        display: true,
        text: props.title,
      },
    },

    scales: {
      y: {
        ticks: {
          stepSize: 1,
          callback: (value: any) => Math.floor(value),
        },
      },
    },

    onClick: (e: any, elements: any, chart: any) => {
      if (elements[0]) {
        const i = elements[0].index;
        const label = chart.data.labels[i];
        const data = chart.data.datasets[0].data[i];

        emit('click', label, data);
      }
    },
  };

  watch(props, () => (options.plugins.title.text = props.title));
</script>

<template>
  <Bar :data="data" :options="options" />
</template>
