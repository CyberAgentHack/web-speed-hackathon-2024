import _, { get } from 'lodash';
import { Suspense, useId } from 'react';

import { BookCard } from '../../features/book/components/BookCard';
import { FeatureCard } from '../../features/feature/components/FeatureCard';
import { useFeatureList } from '../../features/feature/hooks/useFeatureList';
import { RankingCard } from '../../features/ranking/components/RankingCard';
import { useRankingList } from '../../features/ranking/hooks/useRankingList';
import { useRelease } from '../../features/release/hooks/useRelease';
import { Box } from '../../foundation/components/Box';
import { Flex } from '../../foundation/components/Flex';
import { Spacer } from '../../foundation/components/Spacer';
import { Text } from '../../foundation/components/Text';
import { Color, Space, Typography } from '../../foundation/styles/variables';
import { getDayOfWeekStr } from '../../lib/date/getDayOfWeekStr';

import { CoverSection } from './internal/CoverSection';
import { unstable_serialize } from 'swr';
import { releaseApiClient } from '../../features/release/apiClient/releaseApiClient';
import { featureApiClient } from '../../features/feature/apiClient/featureApiClient';
import { rankingApiClient } from '../../features/ranking/apiClient/rankingApiClient';


const TopPage: React.FC = () => {
  const todayStr = getDayOfWeekStr();

  console.log('TopPage');

  const template = document.getElementById('inject-data');
  if (!template) {
    throw new Error('inject-data not found');
  }
  const data = JSON.parse(template.innerHTML)
  console.log('data', data);
  const release_key = unstable_serialize(releaseApiClient.fetch$$key({ params: { dayOfWeek: todayStr } }));
  const feature_key = unstable_serialize(featureApiClient.fetchList$$key({ query: {} }));
  const ranking_key = unstable_serialize(rankingApiClient.fetchList$$key({ query: {} }));

  const release = data[release_key];
  const featureList = data[feature_key];
  const rankingList = data[ranking_key];

  const pickupA11yId = useId();
  const rankingA11yId = useId();
  const todayA11yId = useId();

  return (
    <Flex align="flex-start" direction="column" gap={Space * 2} justify="center" pb={Space * 2}>
      <Box as="header" maxWidth="100%" width="100%">
        <CoverSection />
      </Box>
      <Box as="main" maxWidth="100%" width="100%">
        <Box aria-labelledby={pickupA11yId} as="section" maxWidth="100%" mt={16} width="100%">
          <Text as="h2" color={Color.MONO_100} id={pickupA11yId} typography={Typography.NORMAL20} weight="bold">
            ピックアップ
          </Text>
          <Spacer height={Space * 2} />
          <Box maxWidth="100%" overflowX="scroll" overflowY="hidden">
            <Flex align="stretch" direction="row" gap={Space * 2} justify="flex-start">
              {_.map(featureList, (feature) => (
                <FeatureCard key={feature.id} bookDetail={feature} />
              ))}
            </Flex>
          </Box>
        </Box>

        <Spacer height={Space * 2} />

        <Box aria-labelledby={rankingA11yId} as="section" maxWidth="100%" width="100%">
          <Text as="h2" color={Color.MONO_100} id={rankingA11yId} typography={Typography.NORMAL20} weight="bold">
            ランキング
          </Text>
          <Spacer height={Space * 2} />
          <Box maxWidth="100%" overflowX="hidden" overflowY="hidden">
            <Flex align="center" as="ul" direction="column" justify="center">
              {_.map(rankingList, (ranking) => (
                <RankingCard key={ranking.id} bookDetail={ranking} />
              ))}
            </Flex>
          </Box>
        </Box>

        <Spacer height={Space * 2} />

        <Box aria-labelledby={todayA11yId} as="section" maxWidth="100%" width="100%">
          <Text as="h2" color={Color.MONO_100} id={todayA11yId} typography={Typography.NORMAL20} weight="bold">
            本日更新
          </Text>
          <Spacer height={Space * 2} />
          <Box maxWidth="100%" overflowX="scroll" overflowY="hidden">
            <Flex align="stretch" gap={Space * 2} justify="flex-start">
              {_.map(release.books, (book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </Flex>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
};

const TopPageWithSuspense: React.FC = () => {
  console.log('TopPageWithSuspense');
  return (
    <Suspense fallback={null}>
      <TopPage />
    </Suspense>
  );
};

export { TopPageWithSuspense as TopPage };
