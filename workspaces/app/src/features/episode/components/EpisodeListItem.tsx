import styled from 'styled-components';

import { Box } from '../../../foundation/components/Box';
import { Flex } from '../../../foundation/components/Flex';
import { Image } from '../../../foundation/components/Image';
import { Link } from '../../../foundation/components/Link';
import { Separator } from '../../../foundation/components/Separator';
import { Spacer } from '../../../foundation/components/Spacer';
import { Text } from '../../../foundation/components/Text';
import { useImage } from '../../../foundation/hooks/useImage';
import { Color, Radius, Space, Typography } from '../../../foundation/styles/variables';
import { useEpisode } from '../hooks/useEpisode';

const _Wrapper = styled.li`
  width: 100%;
`;

const _Link = styled(Link)`
  width: 100%;
`;

const _ImgWrapper = styled.div`
  width: 96px;
  height: 96px;
  > img {
    border-radius: ${Radius.SMALL};
  }
`;

type Props = {
  bookId: string;
  episodeId: string;
};

export const EpisodeListItem: React.FC<Props> = ({ bookId, episodeId }) => {
  const { data: episode } = useEpisode({ params: { episodeId } });

  const imageUrl = useImage({ height: 96, imageId: episode.image.id, width: 96 });

  return (
    <_Wrapper>
      <_Link href={`/books/${bookId}/episodes/${episode.id}`}>
        <Spacer height={Space * 1.5} />
        <Flex align="flex-start" gap={Space * 2.5} justify="flex-start">
          {imageUrl != null && (
            <_ImgWrapper>
              <Image alt={episode.name} height={96} objectFit="cover" src={imageUrl} width={96} />
            </_ImgWrapper>
          )}
          <Box width="100%">
            <Flex align="flex-start" direction="column" gap={Space * 1} justify="flex-start">
              <Flex align="center" justify="flex-start">
                <Text color={Color.MONO_100} flexShrink={0} typography={Typography.NORMAL16} weight="bold">
                  第{episode.chapter}話
                </Text>
                <Spacer width={Space * 2} />
                <Text color={Color.MONO_80} typography={Typography.NORMAL14} weight="bold">
                  {`- ${episode.name} -`}
                </Text>
              </Flex>
              <Text as="p" color={Color.MONO_80} typography={Typography.NORMAL12}>
                {episode.description}
              </Text>
            </Flex>
          </Box>
        </Flex>
        <Spacer height={Space * 1.5} />
        <Separator />
      </_Link>
    </_Wrapper>
  );
};
