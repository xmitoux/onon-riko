/**
 * Mapの最大値を取得する
 */
export const getMaxMapValue = (
  maps: Map<number, number> | Map<number, number>[]
): number => {
  let tmpMaps: Map<number, number>[];

  if (maps instanceof Map) {
    if (!maps.size) {
      return 0;
    } else {
      tmpMaps = [maps];
    }
  } else {
    if (maps.some((map) => map.size)) {
      tmpMaps = maps;
    } else {
      return 0;
    }
  }

  let maxValue = Number.MIN_SAFE_INTEGER;

  tmpMaps.forEach((map) => {
    map.forEach((value) => {
      if (value > maxValue) {
        maxValue = value;
      }
    });
  });

  return maxValue;
};
