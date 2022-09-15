import './App.less';

import React, { useEffect } from 'react';

import useMaps from '../src/hooks/useMaps';
import { Main } from './components/Main';

function App() {
  const { google } = useMaps();

  useEffect(() => {
    if (google) {
      console.log('google', google);
      // eslint-disable-next-line no-unused-vars
      // const map = new google.maps.Map(document.getElementById('map'), {
      //   center: { lat: -34.397, lng: 150.644 },
      //   zoom: 8,
      // });
    }
  }, [google]);

  return <Main></Main>;
}

export default App;
