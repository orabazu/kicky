import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import useMaps from 'hooks/useMaps';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PassType } from 'store/eventsSlice';
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
      const style = [
        {
          featureType: 'all',
          elementType: 'icon',
          stylers: [{ visibility: 'off' }],
        },
      ];
      // eslint-disable-next-line no-unused-vars
      const mapInstance = new gmaps.maps.Map(document.getElementById('map')!, {
        center: { lng: -0.2805, lat: 51.55637 },
        zoom: 17,
        heading: 320,
        tilt: 47.5,
        //@ts-ignore
        mapId: 'fb9023c973f94f3a',
      });

      mapInstance.set('styles', style);
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
      const flightsLayer = new ArcLayer({
        id: 'flights',
        data: passes,
        //@ts-ignore
        dataTransform: (d: PassType[]) => d.filter((f) => f),
        //@ts-ignore
        getSourcePosition: (f: PassType) => [f.startY, f.startX], // Prague
        //@ts-ignore
        getTargetPosition: (f: PassType) => [f.endY, f.endX],
        //@ts-ignore
        getSourceColor: (d: PassType) => (d.height === 1 ? [255, 0, 0] : [0, 128, 200]),
        //@ts-ignore
        getTargetColor: (d: PassType) => (d.height === 1 ? [255, 0, 0] : [0, 0, 80]),
        getWidth: 2,
        //@ts-ignore
        getHeight: (d: PassType) => (d.height === 1 || d.height === 2 ? 0.02 : 0.3),
      });

      const overlay = new GoogleMapsOverlay({
        layers: [flightsLayer],
      });

      overlay.setMap(map);
    }
    //   passes.forEach((pass) => {
    //     // eslint-disable-next-line no-unused-vars
    //     const marker = new gmaps.maps.Polyline({
    //       path: [
    //         {
    //           lat: pass.startX,
    //           lng: pass.startY,
    //         },
    //         {
    //           lat: pass.endX,
    //           lng: pass.endY,
    //         },
    //       ],
    //       map,
    //       strokeColor: '#FF0000',
    //       strokeOpacity: 1.0,
    //       strokeWeight: 2,
    //     });
    //   });
    // }
  }, [passes, map]);

  return (
    <div id="map" className={styles.Map}>
      Map
    </div>
  );
};
