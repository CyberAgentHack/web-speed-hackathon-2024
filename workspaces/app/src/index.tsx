import './setup';

import { Dialog } from './foundation/components/Dialog';
import { GlobalStyle } from './foundation/styles/GlobalStyle';
import { Router } from './routes';

export const ClientApp: React.FC = () => {
  return (
    <>
      <GlobalStyle />
      <Dialog />
      <Router />
    </>
  );
};
