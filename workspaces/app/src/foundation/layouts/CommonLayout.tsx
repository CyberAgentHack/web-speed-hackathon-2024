import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '../components/Container';
import { Footer } from '../components/Footer';
import { Space } from '../styles/variables';

const _Content = styled.div`
  height: 100%;
  padding: 0 ${Space * 2}px;
`;

export const CommonLayout: React.FC = () => {
  return (
    <Container>
      <_Content>
        <Outlet />
      </_Content>
      <Footer />
    </Container>
  );
};
