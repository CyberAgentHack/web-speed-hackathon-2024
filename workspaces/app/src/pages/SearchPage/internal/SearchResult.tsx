import { Suspense, useMemo } from 'react';

import type { GetBookListResponse } from '@wsh-2024/schema/src/api/books/GetBookListResponse';

import { BookListItem } from '../../../features/book/components/BookListItem';
import { Flex } from '../../../foundation/components/Flex';
import { Text } from '../../../foundation/components/Text';
import { Color, Typography } from '../../../foundation/styles/variables';
import { isContains } from '../../../lib/filter/isContains';

type Props = {
  books: GetBookListResponse;
  keyword: string;
};

export const SearchResult: React.FC<Props> = ({ books, keyword }) => {
  const relatedBooks = useMemo(() => {
    if (keyword === '') {
      return books;
    }
    return books.filter((book) => {
      return isContains({ query: keyword, target: book.name }) || isContains({ query: keyword, target: book.nameRuby });
    });
  }, [books, keyword]);

  return (
    <Flex align="center" as="ul" direction="column" justify="center">
      <Suspense
        fallback={
          <Text color={Color.MONO_100} typography={Typography.NORMAL14}>
            「{keyword}」を検索中...
          </Text>
        }
      >
        {relatedBooks.map((book) => (
          <BookListItem key={book.id} book={book} />
        ))}
        {relatedBooks.length === 0 && (
          <Text color={Color.MONO_100} typography={Typography.NORMAL14}>
            関連作品は見つかりませんでした
          </Text>
        )}
      </Suspense>
    </Flex>
  );
};
