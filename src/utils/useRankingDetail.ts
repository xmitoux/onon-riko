import { ref } from 'vue';

type YearDataset = Map<string, number>;

const convertYearDatasetToMap = (
  yearDatasets: {
    year: string;
    count: number;
  }[]
) => {
  const map: YearDataset = new Map<string, number>();
  for (const dataset of yearDatasets) {
    map.set(dataset.year, dataset.count);
  }

  return map;
};

const getRecentYears = (year: number, count: number): string[] => {
  const recentYears = [];
  for (let i = 0; i < count; i++) {
    recentYears.push((year - (count - 1 - i)).toString());
  }
  return recentYears;
};

const rikoniYearDatasets = ref(new Map<string, number>());

const extractYearDatasets = (
  datasetObj: {
    year: string;
    count: number;
  }[],
  year: number,
  yearRange: number
) => {
  const newDatasetMap: YearDataset = new Map<string, number>();
  const datasetMap = convertYearDatasetToMap(datasetObj);
  const recentYears = getRecentYears(year, yearRange);
  for (const year of recentYears) {
    newDatasetMap.set(year, datasetMap.get(year) || 0);
  }
  rikoniYearDatasets.value = newDatasetMap;
};

export const useRankingDetails = () => {
  return {
    rikoniYearDatasets,
    extractYearDatasets,
  };
};
