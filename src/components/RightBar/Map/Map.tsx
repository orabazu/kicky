//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer, IconLayer, TripsLayer } from 'deck.gl';
import { google } from 'google-maps';
import useMaps from 'hooks/useMaps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MovementType, PassType } from 'store/eventsSlice';
import { setMapCenter } from 'store/mapSlice';
import { RootState } from 'store/store';

import styles from './style.module.scss';

export const Map = () => {
  const { gmaps } = useMaps();
  const mapCenter = useSelector((state: RootState) => state.map.mapCenter);
  const passes = useSelector((state: RootState) => state.events.passes);
  const movements = useSelector((state: RootState) => state.events.movements);
  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);
  const isMobileMapOpen = useSelector((state: RootState) => state.map.isMobileMapOpen);
  const passFilters = useSelector((state: RootState) => state.map.passFilters);

  const dispatch = useDispatch();

  const [map, setMap] = React.useState<google.maps.Map>();
  const [overlay, setOverlay] = React.useState<GoogleMapsOverlay>();

  // 54.57861443976441, -1.217597210421821 riverside stadium

  const ICON_MAPPING = {
    marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
  };

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
      console.log(`passes`, passes);
      if (passes && overlay) {
        console.log(`passes`, passes);
        overlay.setMap(null);
      }

      const filteredPasses = passes.filter((pass) => {
        if (!passFilters.assists && !passFilters.crosses) {
          return true;
        }
        if (passFilters.assists && passFilters.crosses) {
          return pass.isAssist || pass.isCross;
        } else if (passFilters.assists) {
          return pass.isAssist;
        } else if (passFilters.crosses) {
          return pass.isCross;
        }
      });

      console.log('filterePAsses', filteredPasses);

      const flightsLayer = new ArcLayer({
        id: 'flights',
        data: filteredPasses,
        //@ts-ignore
        dataTransform: (d: PassType[]) => d.filter((f) => f),
        //@ts-ignore
        getSourcePosition: (f: PassType) => [f.startY, f.startX], // Prague
        //@ts-ignore
        getTargetPosition: (f: PassType) => [f.endY, f.endX],
        //@ts-ignore
        getSourceColor: (d: PassType) =>
          d.height === 1 ? [255, 179, 179] : [0, 128, 200],
        //@ts-ignore
        getTargetColor: (d: PassType) =>
          d.height === 1 ? [255, 0, 0] : d.height === 2 ? [166, 130, 255] : [0, 0, 80],
        getWidth: 2,
        //@ts-ignore
        getHeight: (d: PassType) => (d.height === 1 ? 0.02 : d.height === 2 ? 0.2 : 0.3),
      });

      const overlayInstance = new GoogleMapsOverlay({
        layers: [flightsLayer],
      });

      overlayInstance.setMap(map);
      setOverlay(overlayInstance);
      dispatch(
        setMapCenter({
          lat: map.getCenter().lat() + 0.000001,
          lng: map.getCenter().lng() + 0.000001,
        }),
      );
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
  }, [passes, map, passFilters]);

  //@ts-ignore
  const normalizeBetweenTwoRanges = (val, minVal, maxVal, newMin, newMax) => {
    return Math.round(newMin + ((val - minVal) * (newMax - newMin)) / (maxVal - minVal));
  };

  useEffect(() => {
    if (movements.length) {
      console.log(`movements`, movements);

      let currentTime = 0;

      const overlay = new GoogleMapsOverlay({});

      // const DATA_URL =
      //   'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/trips/trips-v7.json';

      const animate = () => {
        currentTime = (currentTime + 1) % 13000;

        const tripsLayer = new TripsLayer({
          id: 'trips',
          data: movements,
          //@ts-ignore
          getPath: (d: MovementType & { players: [] }) => d.path,
          //@ts-ignore
          getTimestamps: (d: MovementType) => d.timestamps,
          getColor: () => [255, 0, 0],
          opacity: 0.5,
          widthMinPixels: 1,
          trailLength: 180,
          currentTime,
          shadowEnabled: false,
        });

        const step = normalizeBetweenTwoRanges(currentTime, 0, 13000, 0, 260);
        console.log(step);

        const iconLayer = new IconLayer({
          id: 'icon-layer',
          data: movements[0].players![step],
          pickable: true,
          // iconAtlas and iconMapping are required
          // getIcon: return a string
          iconAtlas:
            'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
          iconMapping: ICON_MAPPING,
          getIcon: () => 'marker',

          sizeScale: 15,
          //@ts-ignore
          getPosition: (d) => d,
          getSize: () => 3,
          getColor: () => [0, 140, 0],
        });

        overlay.setProps({
          layers: [tripsLayer, iconLayer],
        });
        overlay.setMap(map);

        // movements.forEach((movement) => {
        //   movement.path.forEach((path, idx) => {
        //     const players = movement?.players?.[idx];
        //     players?.forEach((player) => {
        //       // eslint-disable-next-line no-unused-vars
        //       const marker = new gmaps!.maps.Marker({
        //         position: {
        //           // @ts-ignore
        //           lat: player[1],
        //           // @ts-ignore
        //           lng: player[0],
        //         },
        //         map,
        //       });
        //     });
        //   });
        // });
        // const fps = 2;

        // setTimeout(() => {
        //   window.requestAnimationFrame(animate);
        // }, 1000 / fps);
        window.requestAnimationFrame(animate);
      };

      window.requestAnimationFrame(animate);

      overlay.setMap(map);
    }
  }, [movements, map]);

  useEffect(() => {
    if (overlay) {
      overlay.setMap(isPassOverlayVisible === false ? null : map);
    }
  }, [isPassOverlayVisible, map]);

  return (
    <div
      id="map"
      className={isMobileMapOpen ? `${styles.Map} ${styles.MapOpen}` : styles.Map}
    >
      Map
    </div>
  );
};
