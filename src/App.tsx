import './App.css';

import React, { useEffect } from 'react';

import useMaps from '../src/hooks/useMaps';

function App() {
  const { google } = useMaps();

  useEffect(() => {
    if (google) {
      console.log('google', google);
      // eslint-disable-next-line no-unused-vars
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
    }
  }, [google]);

  return <div id="map" style={{ width: '400px', height: '400px' }}></div>;
}

export default App;
