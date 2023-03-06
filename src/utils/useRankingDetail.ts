import { ref } from 'vue';

type DateDataset = Map<number, number>;
type DbDateDatasets =
  | { count: number; year: string }[]
  | { count: number; month: string }[];

/**
 * DBデータをMap化する
 * @param dbDatasets DBデータ(年別/月別)
 * @returns DBデータのMap
 */
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

/**
 * APIで取得した年別カウントデータに歯抜けの年があるとき,
 * その年のカウントを0としてMapを埋める
 * @param map
 * @returns
 */
const fillMissingYears = (map: Map<number, number>): Map<number, number> => {
  const minMaxYear = [...map.keys()].reduce(
    (acc, key) => [Math.min(acc[0], key), Math.max(acc[1], key)],
    [Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]
  );

  const newMap = new Map<number, number>();
  for (let year = minMaxYear[0]; year <= minMaxYear[1]; year++) {
    newMap.set(year, map.get(year) || 0);
  }
  return newMap;
};

/**
 * 年別データセットを指定した年数分で分割する
 * @param map
 * @param num
 * @returns [余りのデータセット, 指定年数分のデータセット]
 */
const splitMap = (
  map: Map<number, number>,
  num: number
): [Map<number, number>, Map<number, number>] => {
  const entries = [...map.entries()];
  const newMap1 = new Map(entries.slice(-num));
  const newMap2 = new Map(entries.slice(0, -num));

  return [newMap2, newMap1];
};

export const useRankingDetails = () => {
  const rikoniYearDatasets = ref(new Map<number, number>());
  const rikoniYearDatasetsPast = ref(new Map<number, number>());
  const rikoniYearDatasetsFuture = ref(new Map<number, number>());

  /**
   * 年別データを直近5年とそれ以前のデータに分けて抽出する
   * @param datasetObj DBの年別データ
   */
  const extract5YearsDatasets = (
    datasetObj: {
      year: string;
      count: number;
    }[]
  ) => {
    const datasetMap = convertDbDatasetToMap(datasetObj);
    const filledYearsMap = fillMissingYears(datasetMap);
    const splitedYearsMap = splitMap(filledYearsMap, 5);

    [rikoniYearDatasetsPast.value, rikoniYearDatasets.value] = splitedYearsMap;
  };

  const rikoniMonthDatasets = ref(new Map<number, number>());
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  /**
   * 月別データセットを取得する
   * @param datasetObj DBの月別データ
   */
  const getMonthDatasets = (
    datasetObj: {
      month: string;
      count: number;
    }[]
  ) => {
    const newDatasetMap: DateDataset = new Map<number, number>();
    const datasetMap = convertDbDatasetToMap(datasetObj);

    // 0回の月はDBデータに存在しないのでを追加する
    for (const month of months) {
      newDatasetMap.set(month, datasetMap.get(month) || 0);
    }

    rikoniMonthDatasets.value = newDatasetMap;
  };

  /**
   * 年別グラフの表示年切り替えのため年別データセット配列の前後入れ替えを行う
   * @param command 'prev' or 'next'
   */
  const moveElement = (command: 'prev' | 'next') => {
    const newMaps: Map<number, number>[] = [];

    if (command === 'prev') {
      newMaps[0] = new Map(
        [...rikoniYearDatasetsPast.value.entries()].slice(0, -1)
      );
      newMaps[1] = new Map([
        ...[...rikoniYearDatasetsPast.value.entries()].slice(-1),
        ...[...rikoniYearDatasets.value.entries()].slice(0, -1),
      ]);
      newMaps[2] = new Map([
        ...[...rikoniYearDatasets.value.entries()].slice(-1),
        ...[...rikoniYearDatasetsFuture.value.entries()].slice(),
      ]);
    } else if (command === 'next') {
      newMaps[2] = new Map(
        [...rikoniYearDatasetsFuture.value.entries()].slice(1)
      );
      newMaps[1] = new Map([
        ...[...rikoniYearDatasets.value.entries()].slice(1),
        ...[...rikoniYearDatasetsFuture.value.entries()].slice(0, 1),
      ]);
      newMaps[0] = new Map([
        ...[...rikoniYearDatasetsPast.value.entries()].slice(),
        ...[...rikoniYearDatasets.value.entries()].slice(0, 1),
      ]);
    }

    [
      rikoniYearDatasetsPast.value,
      rikoniYearDatasets.value,
      rikoniYearDatasetsFuture.value,
    ] = newMaps;
  };

  return {
    rikoniYearDatasets,
    rikoniYearDatasetsPast,
    rikoniYearDatasetsFuture,
    extract5YearsDatasets,
    rikoniMonthDatasets,
    getMonthDatasets,
    moveElement,
  };
};
