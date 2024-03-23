import { CircularProgress, Flex } from '@chakra-ui/react';

import { useBook } from '../../features/books/hooks/useBook';
import { EpisodeDetailEditor } from '../../features/episodes/components/EpisodeDetailEditor';
import { useEpisode } from '../../features/episodes/hooks/useEpisode';
import { episodeDetailRoute } from '../../routes';

export const EpisodeDetailPage: React.FC = () => {
  const { bookId, episodeId } = episodeDetailRoute.useParams();

  const { data: book } = useBook({ bookId });
  const { data: episode } = useEpisode({ episodeId });

  if (book == null || episode == null) {
    return (
      <Flex align="center" height="100%" justify="center" width="100%">
        <CircularProgress isIndeterminate flexGrow={0} flexShrink={0} size={120} />
      </Flex>
    );
  }

  return <EpisodeDetailEditor book={book} episode={episode} />;
};
