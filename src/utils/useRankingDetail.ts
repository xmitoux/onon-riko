import { ref } from 'vue';

type DateDataset = Map<number, number>;
type DbDateDatasets =
  | { count: number; year: string }[]
  | { count: number; month: string }[];

const convertDbDatasetToMap = (dbDatasets: DbDateDatasets) => {
  const map: DateDataset = new Map<number, number>();
  for (const dataset of dbDatasets) {
    if ('year' in dataset) {
      map.set(Number(dataset.year), dataset.count);
    } else {
      map.set(Number(dataset.month), dataset.count);
    }
  }

  return map;
};

const getRecentYears = (year: number, count: number): number[] => {
  const recentYears = [];
  for (let i = 0; i < count; i++) {
    recentYears.push(year - (count - 1 - i));
  }
  return recentYears;
};

const rikoniYearDatasets = ref(new Map<number, number>());

const extractYearDatasets = (
  datasetObj: {
    year: string;
    count: number;
  }[],
  year: number,
  yearRange: number
) => {
  const newDatasetMap: DateDataset = new Map<number, number>();
  const datasetMap = convertDbDatasetToMap(datasetObj);
  const recentYears = getRecentYears(year, yearRange);
  for (const year of recentYears) {
    newDatasetMap.set(year, datasetMap.get(year) || 0);
  }
  rikoniYearDatasets.value = newDatasetMap;
};

const rikoniMonthDatasets = ref(new Map<number, number>());
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const extractMonthDatasets = (
  datasetObj: {
    month: string;
    count: number;
  }[]
) => {
  const newDatasetMap: DateDataset = new Map<number, number>();
  const datasetMap = convertDbDatasetToMap(datasetObj);
  for (const month of months) {
    newDatasetMap.set(month, datasetMap.get(month) || 0);
  }
  rikoniMonthDatasets.value = newDatasetMap;
};

export const useRankingDetails = () => {
  return {
    rikoniYearDatasets,
    extractYearDatasets,
    rikoniMonthDatasets,
    extractMonthDatasets,
  };
};
