import styled from 'styled-components';

import { SvgIcon } from '../../../features/icons/components/SvgIcon';
import { Color, Space } from '../../../foundation/styles/variables';

const _Button = styled.button<{ $outlined: boolean }>`
  border-radius: 50%;
  background-color: ${({ $outlined }) => ($outlined ? `${Color.MONO_0}` : `${Color.SubFavorite}`)};
  border: none;
  padding: ${Space * 1}px;
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

type Props = {
  enabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & JSX.IntrinsicElements['button'];

export const FavButton: React.FC<Props> = ({ enabled, onClick }) => {
  return (
    <_Button
      $outlined={!enabled}
      aria-label={enabled ? 'お気に入りを解除する' : 'お気に入りに追加する'}
      onClick={onClick}
    >
      <SvgIcon
        color={enabled ? Color.Favorite : Color.MONO_40}
        height={24}
        type={enabled ? 'Favorite' : 'FavoriteBorder'}
        width={24}
      />
    </_Button>
  );
};
