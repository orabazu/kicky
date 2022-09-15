import './index.scss';

import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import { MapsProvider } from './contexts/mapContext';

console.log('import.meta.env.REACT_APP_GOOGLE_MAPS_KEY', import.meta.env);

ReactDOM.render(
  <React.StrictMode>
    <MapsProvider writeKey={import.meta.env.VITE_GOOGLE_MAPS_KEY}>
      <App />
    </MapsProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
