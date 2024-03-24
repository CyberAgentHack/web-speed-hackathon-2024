import weekday from 'dayjs/plugin/weekday';
import dayjs from 'dayjs';
import map from 'lodash/map';
import React, { Suspense, useId, useMemo } from 'react';
dayjs.extend(weekday);

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

const TopPage: React.FC = () => {
  const todayStr = useMemo(() => getDayOfWeekStr(dayjs()), []);
  const { data: release } = useRelease({ params: { dayOfWeek: todayStr } });
  const { data: featureList } = useFeatureList({ query: {} });
  const { data: rankingList } = useRankingList({ query: {} });

  const pickupA11yId = useId();
  const rankingA11yId = useId();
  const todayA11yId = useId();

  return (
    <Flex align="flex-start" direction="column" gap={Space * 2} justify="center" pb={Space * 2}>
      <Box as="header" maxWidth="100%" width="100%">
        <Suspense fallback={<div>Loading...</div>}>
          <CoverSection />
        </Suspense>
      </Box>
      <Box as="main" maxWidth="100%" width="100%">
        <Suspense fallback={<div>Loading sections...</div>}>
          <Box aria-labelledby={pickupA11yId} as="section" maxWidth="100%" mt={16} width="100%">
            <Text as="h2" color={Color.MONO_100} id={pickupA11yId} typography={Typography.NORMAL20} weight="bold">
              ピックアップ
            </Text>
            <Spacer height={Space * 2} />
            <Box maxWidth="100%" overflowX="scroll" overflowY="hidden">
              <Flex align="stretch" direction="row" gap={Space * 2} justify="flex-start">
                {map(featureList, (feature) => (
                  <FeatureCard key={feature.id} bookId={feature.book.id} />
                ))}
              </Flex>
            </Box>
          </Box>
        </Suspense>

        <Spacer height={Space * 2} />

        <Suspense fallback={<div>Loading sections...</div>}>
          <Box aria-labelledby={rankingA11yId} as="section" maxWidth="100%" width="100%">
            <Text as="h2" color={Color.MONO_100} id={rankingA11yId} typography={Typography.NORMAL20} weight="bold">
              ランキング
            </Text>
            <Spacer height={Space * 2} />
            <Box maxWidth="100%" overflowX="hidden" overflowY="hidden">
              <Flex align="center" as="ul" direction="column" justify="center">
                {map(rankingList, (ranking) => (
                  <RankingCard key={ranking.id} bookId={ranking.book.id} />
                ))}
              </Flex>
            </Box>
          </Box>
        </Suspense>

        <Spacer height={Space * 2} />

        <Suspense fallback={<div>Loading sections...</div>}>
          <Box aria-labelledby={todayA11yId} as="section" maxWidth="100%" width="100%">
            <Text as="h2" color={Color.MONO_100} id={todayA11yId} typography={Typography.NORMAL20} weight="bold">
              本日更新
            </Text>
            <Spacer height={Space * 2} />
            <Box maxWidth="100%" overflowX="scroll" overflowY="hidden">
              <Flex align="stretch" gap={Space * 2} justify="flex-start">
                {map(release.books, (book) => (
                  <BookCard key={book.id} bookId={book.id} />
                ))}
              </Flex>
            </Box>
          </Box>
        </Suspense>
      </Box>
    </Flex>
  );
};

const TopPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <TopPage />
    </Suspense>
  );
};

export { TopPageWithSuspense as TopPage };
