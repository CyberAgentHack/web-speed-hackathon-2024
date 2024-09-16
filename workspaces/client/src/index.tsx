import './side-effects';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { AdminApp } from '@wsh-2024/admin/src/index';
import { ClientApp } from '@wsh-2024/app/src/index';

import { preloadImages } from './utils/preloadImages';
import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  await registerServiceWorker();
  await preloadImages();

  document.addEventListener('DOMContentLoaded', () => {
    const rootElement = document.getElementById('root');

    if (rootElement) {
      if (window.location.pathname.startsWith('/admin')) {
        ReactDOM.createRoot(rootElement).render(<AdminApp />);
      } else {
        ReactDOM.hydrateRoot(
          rootElement,
          <SWRConfig value={{ revalidateIfStale: true, revalidateOnFocus: false, revalidateOnReconnect: false }}>
            <BrowserRouter>
              <ClientApp />
            </BrowserRouter>
          </SWRConfig>,
        );
      }
    }
  });
};

main().catch(console.error);
