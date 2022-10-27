//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { latLngToVector3, ThreeJSOverlayView } from '@googlemaps/three';
import { ArcLayer, IconLayer, TripsLayer } from 'deck.gl';
import { google } from 'google-maps';
import useMaps from 'hooks/useMaps';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MovementType, PassType } from 'store/eventsSlice';
import { setMapCenter } from 'store/mapSlice';
import { RootState } from 'store/store';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import styles from './style.module.scss';

export const Map = () => {
  const { gmaps } = useMaps();
  const mapCenter = useSelector((state: RootState) => state.map.mapCenter);
  const passes = useSelector((state: RootState) => state.events.passes);
  const shots = useSelector((state: RootState) => state.events.shots);
  const movements = useSelector((state: RootState) => state.events.movements);
  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);
  const isShotsOverlayVisible = useSelector((state: RootState) => state.map.layers.shots);
  const isMobileMapOpen = useSelector((state: RootState) => state.map.isMobileMapOpen);
  const passFilters = useSelector((state: RootState) => state.map.passFilters);

  const dispatch = useDispatch();

  const [map, setMap] = React.useState<google.maps.Map>();
  const [passOverlay, setPassOverlay] = React.useState<GoogleMapsOverlay>();
  const [shotsOverlay, setShotsOverlay] = React.useState<GoogleMapsOverlay>();

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
      if (passes && passOverlay) {
        console.log('removing pass overlay');
        passOverlay.setMap(null);
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

      console.log(passes.length);

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
      setPassOverlay(overlayInstance);
      dispatch(
        setMapCenter({
          lat: map.getCenter().lat() + 0.000001,
          lng: map.getCenter().lng() + 0.000001,
        }),
      );
    }
  }, [passes, map, passFilters]);

  useEffect(() => {
    if (map && gmaps) {
      // TODO: overlays remove each other
      // if (shots && shotsOverlay) {
      //   console.log('removing shots overlay');
      //   shotsOverlay.setMap(null);
      // }

      const shotsLayer = new ArcLayer({
        id: 'shots',
        data: shots,
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
        layers: [shotsLayer],
      });

      overlayInstance.setMap(map);
      setShotsOverlay(overlayInstance);
      dispatch(
        setMapCenter({
          lat: map.getCenter().lat() + 0.000001,
          lng: map.getCenter().lng() + 0.000001,
        }),
      );
    }
  }, [shots, map, passFilters]);

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

  useEffect(() => {
    if (map && gmaps) {
      const scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);

      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);

      directionalLight.position.set(0, 10, 50);
      scene.add(directionalLight);

      // Load the model.
      // const loader = new GLTFLoader();
      // const url =
      //   'https://raw.githubusercontent.com/googlemaps/js-samples/main/assets/pin.gltf';

      let mapOptions = {
        tilt: map?.getTilt() || 0,
        heading: map?.getHeading() || 0,
        zoom: map?.getZoom() || 0,
      };

      // loader.load(url, (gltf) => {
      //   gltf.scene.scale.set(10, 10, 10);
      //   gltf.scene.rotation.x = Math.PI / 2;
      //   scene.add(gltf.scene);

      //   const animate = () => {
      //     if (mapOptions.tilt < 67.5) {
      //       mapOptions.tilt += 0.5;
      //     } else if (mapOptions.heading <= 360) {
      //       mapOptions.heading += 0.2;
      //       mapOptions.zoom -= 0.0005;
      //     } else {
      //       // exit animation loop
      //       return;
      //     }

      //     let { tilt, heading, zoom } = mapOptions;
      //     //@ts-ignore
      //     map.moveCamera({ tilt, heading, zoom });

      //     requestAnimationFrame(animate);
      //   };

      //   requestAnimationFrame(animate);
      // });

      const fontLoader = new FontLoader();

      fontLoader.load(
        '../../../../resources/helvetiker_regular.typeface.json',
        function (font) {
          const textGeo = new TextGeometry('Arsenal 3 - 0 Wolves', {
            font: font,
            size: 80,
            height: 5,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 10,
            bevelSize: 8,
            bevelOffset: 0,
            bevelSegments: 5,
          });

          textGeo.computeBoundingBox();
          // const centerOffset =
          //   -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);

          const textMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            specular: 0xffffff,
          });

          const mesh = new THREE.Mesh(textGeo, textMaterial);
          // mesh.position.x = centerOffset;
          // mesh.position.y = FLOOR + 67;

          // set position at center of map
          mesh.position.copy(
            latLngToVector3({
              lat: map.getCenter().lat() + 0.002,
              lng: map.getCenter().lng() - 0.003,
            }),
          );
          // set position vertically
          mesh.position.setY(10);
          mesh.scale.set(0.5, 0.5, 0.5);

          mesh.castShadow = true;
          mesh.receiveShadow = true;
          // mesh.rotation.y = -Math.PI / 4;

          scene.add(mesh);

          const animate = () => {
            if (mapOptions.tilt < 67.5) {
              mapOptions.tilt += 0.5;
            } else if (mapOptions.heading <= 360) {
              mapOptions.heading += 0.2;
              mapOptions.zoom += 0.005;
            } else {
              // exit animation loop
              return;
            }

            let { tilt, heading, zoom } = mapOptions;
            //@ts-ignore
            map.moveCamera({ tilt, heading, zoom });

            requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        },
      );

      new ThreeJSOverlayView({
        map,
        scene,
        // anchor: { ...map?.getCenter(), altitude: 100 },
        THREE,
      });
    }
  }, [map, gmaps]);

  useEffect(() => {
    if (passOverlay) {
      console.log('removing pass overlay from effect');
      passOverlay.setMap(isPassOverlayVisible === false ? null : map);
    }
  }, [isPassOverlayVisible, map]);

  useEffect(() => {
    if (shotsOverlay) {
      console.log('removing shot overlay from effect');
      shotsOverlay.setMap(isShotsOverlayVisible === false ? null : map);
    }
  }, [isShotsOverlayVisible, map]);

  return (
    <div
      id="map"
      className={isMobileMapOpen ? `${styles.Map} ${styles.MapOpen}` : styles.Map}
    >
      Map
    </div>
  );
};
