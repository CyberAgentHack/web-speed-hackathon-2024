// import './side-effects';

import $ from 'jquery';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { AdminApp } from '@wsh-2024/admin/src/index';
import { ClientApp } from '@wsh-2024/app/src/index';

import { preloadImages } from './utils/preloadImages';
import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  await registerServiceWorker();
  // await preloadImages();

  $(document).ready(() => {
    if (window.location.pathname.startsWith('/admin')) {
      ReactDOM.createRoot($('#root').get(0)!).render(<AdminApp />);
    } else {
      ReactDOM.hydrateRoot(
        $('#root').get(0)!,
        <SWRConfig value={{ revalidateIfStale: true, revalidateOnFocus: false, revalidateOnReconnect: false }}>
          <BrowserRouter>
            <ClientApp />
          </BrowserRouter>
        </SWRConfig>,
      );
    }
  });
};

main().catch(console.error);
