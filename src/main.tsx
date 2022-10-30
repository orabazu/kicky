import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from 'store/store';

import App from './App';
import { MapsProvider } from './contexts/mapContext';

//@ts-ignore
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <MapsProvider writeKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
          <App />
        </MapsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
