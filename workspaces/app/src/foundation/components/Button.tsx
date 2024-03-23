import styled from 'styled-components';

import { Typography } from '../styles/variables';

const _Button = styled.button`
  ${Typography.NORMAL14}
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
`;

type Props = {
  children: React.ReactNode;
} & JSX.IntrinsicElements['button'];

export const Button: React.FC<Props> = ({ children, ...rest }) => {
  return <_Button {...rest}>{children}</_Button>;
};
