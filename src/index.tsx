import './index.scss';

import React from 'react';
import { Provider } from 'react-redux';
import { createRoot } from 'react-dom/client';

import { store } from 'store/store';

import App from './App';
import { MapsProvider } from './contexts/mapContext';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <MapsProvider writeKey={'AIzaSyDI5xMgEfYEvmyTun_GuSAtdetEuAIxoy0'}>
          <App />
        </MapsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
