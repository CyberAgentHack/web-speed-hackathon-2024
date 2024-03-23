import styled from 'styled-components';

import { Color, Radius, Space } from '../../../foundation/styles/variables';

const _Input = styled.input`
  border-radius: ${Radius.X_LARGE};
  width: calc(100% - ${Space * 2}px);
  padding: ${Space * 1}px;
  border: 2px solid ${Color.MONO_60};
`;

type Props = JSX.IntrinsicElements['input'];

export const Input: React.FC<Props> = ({ ...rest }) => {
  return <_Input {...rest} placeholder="作品名を入力" />;
};
