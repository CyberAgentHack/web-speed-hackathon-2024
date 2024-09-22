// import React from 'react';
// import { Route, Routes } from 'react-router-dom';
// import { styled } from 'styled-components';

// import { SvgIcon } from './features/icons/components/SvgIcon';
// import { Link } from './foundation/components/Link';
// import { Text } from './foundation/components/Text';
// import { ActionLayout } from './foundation/layouts/ActionLayout';
// import { CommonLayout } from './foundation/layouts/CommonLayout';
// import { Color, Space, Typography } from './foundation/styles/variables';
// import { AuthorDetailPage } from './pages/AuthorDetailPage';
// import { BookDetailPage } from './pages/BookDetailPage';
// import { EpisodeDetailPage } from './pages/EpisodeDetailPage';
// import { SearchPage } from './pages/SearchPage';
// import { TopPage } from './pages/TopPage';

// const _BackToTopButton = styled(Link)`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   gap: ${Space * 1}px;
//   border: none;
//   background-color: transparent;
// `;

// export const Router: React.FC = () => {
//   console.log('Router');
//   return (
//     <Routes>
//       <Route element={<CommonLayout />} path={'/'}>
//         <Route element={<TopPage />} path={''} />
//       </Route>
//       <Route
//         element={
//           <ActionLayout
//             leftContent={
//               <_BackToTopButton href={'/'}>
//                 <SvgIcon color={Color.MONO_100} height={32} type="ArrowBack" width={32} />
//                 <Text color={Color.MONO_100} typography={Typography.NORMAL16} weight="bold">
//                   トップへ戻る
//                 </Text>
//               </_BackToTopButton>
//             }
//           />
//         }
//         path={'/'}
//       >
//         <Route element={<BookDetailPage />} path={'books/:bookId'} />
//         <Route element={<EpisodeDetailPage />} path={'books/:bookId/episodes/:episodeId'} />
//         <Route element={<AuthorDetailPage />} path={'authors/:authorId'} />
//         <Route element={<SearchPage />} path={'search'} />
//       </Route>
//     </Routes>
//   );
// };


import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { styled } from 'styled-components';

import { SvgIcon } from './features/icons/components/SvgIcon';
import { Link } from './foundation/components/Link';
import { Text } from './foundation/components/Text';
import { ActionLayout } from './foundation/layouts/ActionLayout';
import { CommonLayout } from './foundation/layouts/CommonLayout';
import { Color, Space, Typography } from './foundation/styles/variables';

// ページコンポーネントを lazy() を使って動的にインポート
const TopPage = lazy(() => import('./pages/TopPage').then(module => ({ default: module.TopPage })));
const BookDetailPage = lazy(() => import('./pages/BookDetailPage').then(module => ({ default: module.BookDetailPage })));
const EpisodeDetailPage = lazy(() => import('./pages/EpisodeDetailPage').then(module => ({ default: module.EpisodeDetailPage })));
const AuthorDetailPage = lazy(() => import('./pages/AuthorDetailPage').then(module => ({ default: module.AuthorDetailPage })));
const SearchPage = lazy(() => import('./pages/SearchPage').then(module => ({ default: module.SearchPage })));

const _BackToTopButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: ${Space * 1}px;
  border: none;
  background-color: transparent;
`;

export const Router: React.FC = () => {
  return (
    <Routes>
      <Route element={<CommonLayout />} path={'/'}>
        <Route
          element={
            <Suspense fallback={null}>
              <TopPage />
            </Suspense>
          }
          path={''}
        />
      </Route>
      <Route
        element={
          <ActionLayout
            leftContent={
              <_BackToTopButton href={'/'}>
                <SvgIcon color={Color.MONO_100} height={32} type="ArrowBack" width={32} />
                <Text color={Color.MONO_100} typography={Typography.NORMAL16} weight="bold">
                  トップへ戻る
                </Text>
              </_BackToTopButton>
            }
          />
        }
        path={'/'}
      >
        <Route
          element={
            <Suspense fallback={null}>
              <BookDetailPage />
            </Suspense>
          }
          path={'books/:bookId'}
        />
        <Route
          element={
            <Suspense fallback={null}>
              <EpisodeDetailPage />
            </Suspense>
          }
          path={'books/:bookId/episodes/:episodeId'}
        />
        <Route
          element={
            <Suspense fallback={null}>
              <AuthorDetailPage />
            </Suspense>
          }
          path={'authors/:authorId'}
        />
        <Route
          element={
            <Suspense fallback={null}>
              <SearchPage />
            </Suspense>
          }
          path={'search'}
        />
      </Route>
    </Routes>
  );
};
