import { sampleData } from 'const/sampleData';
import useMaps from 'hooks/useMaps';
import React, { useEffect } from 'react';

import styles from './style.module.scss';

export const Map = () => {
  const { gmaps } = useMaps();

  // 54.57861443976441, -1.217597210421821 riverside stadium

  useEffect(() => {
    if (gmaps) {
      console.log('google', gmaps);
      console.log('sample', sampleData);
      // eslint-disable-next-line no-unused-vars
      const map = new gmaps.maps.Map(document.getElementById('map')!, {
        center: { lng: -0.2805, lat: 51.55637 },
        zoom: 17,
        heading: 320,
        tilt: 47.5,
        //@ts-ignore
        mapId: 'fb9023c973f94f3a',
      });

      map.addListener('click', (e) => {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        console.log('click', e.latLng.lat(), e.latLng.lng());
      });

      sampleData.forEach((data) => {
        // eslint-disable-next-line no-unused-vars
        const marker = new gmaps.maps.Marker({
          position: {
            lat: data.startX,
            lng: data.startY,
          },
          map,
          title: data.passer.toString(),
        });
      });
    }
  }, [gmaps]);
  return (
    <div id="map" className={styles.Map}>
      Map
    </div>
  );
};
