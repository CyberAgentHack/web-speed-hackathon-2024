'use strict';
import './side-effects';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { AdminApp } from '@wsh-2024/admin/src/index';
import { ClientApp } from '@wsh-2024/app/src/index';

// import { preloadImages } from './utils/preloadImages';
import { registerServiceWorker } from './utils/registerServiceWorker';

/**
 * 管理者用アプリケーションをレンダリング
 */
const renderAdminApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element not found for AdminApp");
    return;
  }
  ReactDOM.createRoot(rootElement).render(<AdminApp />);
};

/**
 * クライアント用アプリケーションをレンダリング
 */
const renderClientApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("Root element not found for ClientApp");
    return;
  }
  ReactDOM.hydrateRoot(
    rootElement,
    <SWRConfig
      value={{
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      <BrowserRouter>
        <ClientApp /> 
      </BrowserRouter>
    </SWRConfig>
  );
};

/**
 * アプリケーションの初期化処理を行う
 */
const main = async () => {
  console.log("Initializing app...");

  try {
    // 並列で非同期処理を実行
    // await Promise.all([registerServiceWorker(), preloadImages()]);
    await Promise.all([registerServiceWorker()]);

    console.log("App initialized");

    // URLパスによってレンダリングするアプリケーションを切り替え
    if (window.location.pathname.startsWith('/admin')) {
      renderAdminApp();
    } else {
      renderClientApp(); // very heavy
    }
    console.log("App rendered");
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
};

// メイン関数の実行
main();
