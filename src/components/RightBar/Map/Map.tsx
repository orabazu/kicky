//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
// import { latLngToVector3, ThreeJSOverlayView } from '@googlemaps/three';
import { IconLayer, TripsLayer } from 'deck.gl';
import { google } from 'google-maps';
import useDrawPasses from 'hooks/useDrawPasses';
import useDrawShots from 'hooks/useDrawShots';
import useMaps from 'hooks/useMaps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLazyGetEventByMatchIdQuery } from 'store/eventDataApi';
import { MovementType } from 'store/eventsSlice';
import { setMapCenter } from 'store/mapSlice';
import { RootState } from 'store/store';

// import * as THREE from 'three';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styles from './style.module.scss';

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

export const Map = () => {
  const { gmaps } = useMaps();
  const mapCenter = useSelector((state: RootState) => state.map.mapCenter);
  const movements = useSelector((state: RootState) => state.events.movements);
  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);

  const isMobileMapOpen = useSelector((state: RootState) => state.map.isMobileMapOpen);

  const dispatch = useDispatch();

  const [map, setMap] = React.useState<google.maps.Map>();

  const forceRerender = () => {
    dispatch(
      setMapCenter({
        lat: map!.getCenter().lat() + 0.000001,
        lng: map!.getCenter().lng() + 0.000001,
      }),
    );
  };

  const params = useParams();
  const [searchParams] = useSearchParams();
  const stadiumId = searchParams.get('stadiumId');

  const [fetchEventData, { data: eventsData }] = useLazyGetEventByMatchIdQuery();

  const getMatchData = async (matchId: string, stadiumId: string) => {
    fetchEventData({ matchId, stadiumId });
  };

  useEffect(() => {
    if (params.matchId && stadiumId) {
      getMatchData(params.matchId, stadiumId);
    }
  }, [params.matchId, stadiumId]);

  useDrawPasses({
    gmaps,
    map,
    passes: eventsData?.passes,
    activeTeamId,
    forceRerender,
  });

  useDrawShots({
    gmaps,
    map,
    shots: eventsData?.shots,
    activeTeamId,
    forceRerender,
  });

  // SET MAP
  useEffect(() => {
    if (gmaps && !map) {
      const style = [
        {
          featureType: 'all',
          elementType: 'icon',
          stylers: [{ visibility: 'off' }],
        },
      ];
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
        console.log('click', e.latLng.lat(), e.latLng.lng());
      });

      setMap(mapInstance);
    }
  }, [gmaps, mapCenter]);

  // SET CENTER
  useEffect(() => {
    console.log(mapCenter);
    if (map) {
      map.setCenter(mapCenter);
    }
  }, [mapCenter, map]);

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
        // console.log(step);

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

  // useEffect(() => {
  //   if (shotsOverlay) {
  //     console.log('removing shot overlay from effect');
  //     shotsOverlay.setMap(isShotsOverlayVisible === false ? null : map);
  //   }
  // }, [isShotsOverlayVisible, map]);

  return (
    <div
      id="map"
      className={isMobileMapOpen ? `${styles.Map} ${styles.MapOpen}` : styles.Map}
    >
      Map
    </div>
  );
};
