import type * as CSS from 'csstype';
import styled from 'styled-components';

import { addUnitIfNeeded } from '../../lib/css/addUnitIfNeeded';

const _Image = styled.img<{
  $height: number | string;
  $objectFit: string;
  $width: number | string;
}>`
  object-fit: ${({ $objectFit }) => $objectFit};
  width: ${({ $width }) => addUnitIfNeeded($width)};
  height: ${({ $height }) => addUnitIfNeeded($height)};
  display: block;
`;

type Props = {
  height: number | string;
  objectFit: CSS.Property.ObjectFit;
  width: number | string;
} & JSX.IntrinsicElements['img'];

export const Image: React.FC<Props> = ({ height, loading = 'lazy', objectFit, width, ...rest }) => {
  return <_Image {...rest} $height={height} $objectFit={objectFit} $width={width} loading={loading} />;
};
