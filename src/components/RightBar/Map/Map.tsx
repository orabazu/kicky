import { sampleData } from 'const/sampleData';
import { google } from 'google-maps';
import useMaps from 'hooks/useMaps';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

import styles from './style.module.scss';

export const Map = () => {
  const { gmaps } = useMaps();
  const mapCenter = useSelector((state: RootState) => state.map.mapCenter);
  const passes = useSelector((state: RootState) => state.events.passes);
  const [map, setMap] = React.useState<google.maps.Map>();

  // 54.57861443976441, -1.217597210421821 riverside stadium

  useEffect(() => {
    if (gmaps && !map) {
      console.log('google', gmaps);
      console.log('sample', sampleData);
      // eslint-disable-next-line no-unused-vars
      const mapInstance = new gmaps.maps.Map(document.getElementById('map')!, {
        center: { lng: -0.2805, lat: 51.55637 },
        zoom: 17,
        heading: 320,
        tilt: 47.5,
        //@ts-ignore
        mapId: 'fb9023c973f94f3a',
      });

      mapInstance.addListener('click', (e) => {
        // 3 seconds after the center of the map has changed, pan back to the
        // marker.
        console.log('click', e.latLng.lat(), e.latLng.lng());
      });

      setMap(mapInstance);

      // sampleData.forEach((data) => {
      //   // eslint-disable-next-line no-unused-vars
      //   const marker = new gmaps.maps.Marker({
      //     position: {
      //       lat: data.startX,
      //       lng: data.startY,
      //     },
      //     map,
      //     title: data.passer.toString(),
      //   });
      // });
    }
  }, [gmaps, mapCenter]);

  useEffect(() => {
    if (map) {
      map.setCenter(mapCenter);
    }
  }, [mapCenter, map]);

  useEffect(() => {
    if (map && gmaps) {
      passes.forEach((pass) => {
        // eslint-disable-next-line no-unused-vars
        const marker = new gmaps.maps.Polyline({
          path: [
            {
              lat: pass.startX,
              lng: pass.startY,
            },
            {
              lat: pass.endX,
              lng: pass.endY,
            },
          ],
          map,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 2,
        });
      });
    }
  }, [passes, map]);

  return (
    <div id="map" className={styles.Map}>
      Map
    </div>
  );
};
