import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { store } from 'store/store';

import App from './App';
import { MapsProvider } from './contexts/mapContext';

console.log('import.meta.env.REACT_APP_GOOGLE_MAPS_KEY', import.meta.env);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MapsProvider writeKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
        <App />
      </MapsProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
