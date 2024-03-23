import React from 'react';
import styled from 'styled-components';

import { BreakPoint, Color } from '../styles/variables';

const _Container = styled.div`
  min-height: 100vh;
  width: 100%;
  margin: 0 auto;
  max-width: ${BreakPoint.MOBILE}px;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: auto 1fr auto;
  background-color: ${Color.MONO_A};
  border-left: 1px solid ${Color.MONO_30};
  border-right: 1px solid ${Color.MONO_30};
`;

type Props = {
  children: React.ReactNode;
};

export const Container: React.FC<Props> = ({ children }) => {
  return <_Container>{children}</_Container>;
};
