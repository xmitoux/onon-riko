import type { Image } from '@/types';
export type RankedImage = Image & { rank: number };

const rankImagesByUseCount = (images: Image[]) => {
  const rankedImages: RankedImage[] = [];
  let currentRank = 1;
  let currentCount = images[0].use_count;

  for (let i = 0; i < images.length; i++) {
    if (images[i].use_count < currentCount) {
      currentRank = i + 1;
      currentCount = images[i].use_count;
    }

    rankedImages.push({
      ...images[i],
      rank: currentRank,
    });
  }

  return rankedImages;
};

export const useRankingComponent = () => {
  return { rankImagesByUseCount };
};
