import './setup';

import { Suspense } from 'react';

import { Dialog } from './foundation/components/Dialog';
import { GlobalStyle } from './foundation/styles/GlobalStyle';
import { Router } from './routes';

export const ClientApp: React.FC = () => {
  return (
    <Suspense fallback={<></>}>
      <GlobalStyle />
      <Dialog />
      <Router />
    </Suspense>
  );
};
