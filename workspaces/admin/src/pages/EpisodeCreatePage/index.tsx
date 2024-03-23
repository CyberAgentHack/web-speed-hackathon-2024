import { CircularProgress, Flex } from '@chakra-ui/react';

import { useBook } from '../../features/books/hooks/useBook';
import { EpisodeDetailEditor } from '../../features/episodes/components/EpisodeDetailEditor';
import { episodeCreateRoute } from '../../routes';

export const EpisodeCreatePage: React.FC = () => {
  const { bookId } = episodeCreateRoute.useParams();

  const { data: book } = useBook({ bookId });

  if (book == null) {
    return (
      <Flex align="center" height="100%" justify="center" width="100%">
        <CircularProgress isIndeterminate flexGrow={0} flexShrink={0} size={120} />
      </Flex>
    );
  }

  return <EpisodeDetailEditor book={book} />;
};
