import useMaps from 'hooks/useMaps';
import React from 'react';
import { useEffect } from 'react';

import { Header } from '../Header';
import { LeftBar } from '../LeftBar';
import styles from './style.module.scss';

export const Main = () => {
  const { gmaps } = useMaps();

  useEffect(() => {
    if (gmaps) {
      console.log('google', gmaps);
      // eslint-disable-next-line no-unused-vars
      const map = new gmaps.maps.Map(document.getElementById('map')!, {
        center: { lng: -0.27873587, lat: 51.5562963 },
        zoom: 17,
        heading: 320,
        tilt: 47.5,
        //@ts-ignore
        mapId: 'fb9023c973f94f3a',
      });
    }
  }, [gmaps]);

  return (
    <>
      <Header />
      <div className={styles.SideBar}>
        <LeftBar />
      </div>
      <div className={styles.Main} id="map"></div>
    </>
  );
};
