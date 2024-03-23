import { animated, useSpring } from '@react-spring/web';
import { useCallback } from 'react';
import { styled } from 'styled-components';

import { Link } from '../../../foundation/components/Link';
import { Color, Radius, Space } from '../../../foundation/styles/variables';

import { FavButton } from './FavButton';

const _Wrapper = styled.div`
  position: fixed;
  bottom: ${Space * 4}px;
  left: 50%;
  transform: translateX(-50%);
`;

const _Content = styled.div`
  display: flex;
  gap: ${Space * 1}px;
  justify-content: center;
  min-width: 296px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  padding: ${Space * 1}px;
  border-radius: calc(${Radius.X_LARGE} + ${Space * 1}px);
  background-color: ${Color.MONO_A};
`;

const _ReadLink = styled(Link)`
  display: block;
  border-radius: ${Radius.X_LARGE};
  background-color: ${Color.Primary};
  padding: ${Space * 2}px ${Space * 8}px;
  font-weight: bold;
  color: ${Color.MONO_100};
  flex-shrink: 0;
`;

type Props = {
  bookId: string;
  isFavorite: boolean;
  latestEpisodeId: string;
  onClickFav: () => void;
};

export const BottomNavigator: React.FC<Props> = ({ bookId, isFavorite, latestEpisodeId, onClickFav }) => {
  const props = useSpring({
    from: { transform: 'translateY(100%)' },
    to: { transform: 'translateY(0)' },
  });

  const handleFavClick = useCallback(() => {
    onClickFav();
  }, [onClickFav]);

  return (
    <_Wrapper>
      <animated.div style={props}>
        <_Content>
          <FavButton enabled={isFavorite} onClick={handleFavClick} />
          <_ReadLink to={`/books/${bookId}/episodes/${latestEpisodeId}`}>最新話を読む</_ReadLink>
        </_Content>
      </animated.div>
    </_Wrapper>
  );
};
