import { latLngToVector3, ThreeJSOverlayView } from '@googlemaps/three';
import { Match } from 'const/arsenalMatches';
import { stadiums } from 'const/stadiumCoords';
import { google } from 'google-maps';
import { useEffect } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import daFont from 'assets/helvetiker_regular.typeface.json';

type useDrawThreeMatchSummaryType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  activeMatch: Match | undefined;
  mapCenter: {
    lat: number;
    lng: number;
  };
};

const useThreeMatchSummary = ({
  map,
  gmaps,
  activeMatch,
  mapCenter,
}: useDrawThreeMatchSummaryType) => {
  useEffect(() => {
    if (map && gmaps && activeMatch) {
      const scene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
      directionalLight.position.set(0, 10, 50);
      scene.add(directionalLight);

      const fontLoader = new FontLoader();

      const title = `${activeMatch.home_team.home_team_name.substring(0, 3).toLocaleUpperCase()} ${
        activeMatch.home_score
      } - ${activeMatch.away_score} ${activeMatch.away_team.away_team_name
        .substring(0, 3)
        .toLocaleUpperCase()}`;

      const stadium = `${activeMatch.stadium.name}`;

      const matchDate = new Date(activeMatch.match_date);

      const activeStadium = stadiums.find((stadium) => stadium.id === activeMatch.stadium.id);

      fontLoader.load(
        '../../../../../fonts/helvetiker_regular.typeface.json',
        function (font) {
          const titleGeo = new TextGeometry(title, {
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

          const textMaterial = new THREE.MeshPhongMaterial({
            color: 0xff0000,
            specular: 0xffffff,
          });

          const titleMesh = new THREE.Mesh(titleGeo, textMaterial);
          // titleMesh.position.x = centerOffset;
          // titleMesh.position.y = FLOOR + 67;

          // set position at center of map
          titleMesh.position.copy(
            latLngToVector3({
              lat: activeStadium!.coords.bottomRight[0] + 0.002,
              lng: activeStadium!.coords.bottomRight[1] - 0.002,
            }),
          );
          // set position vertically
          titleMesh.position.setY(50);
          titleMesh.scale.set(0.5, 0.5, 0.5);
          titleMesh.castShadow = true;
          titleMesh.receiveShadow = true;
          // titleMesh.rotation.y = -Math.PI / 4;

          scene.add(titleMesh);

          const stadiumGeo = new TextGeometry(stadium, {
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

          const stadiumMesh = new THREE.Mesh(
            stadiumGeo,
            new THREE.MeshPhongMaterial({
              color: 0x3462297,
              specular: 0xffffff,
            }),
          );

          stadiumMesh.position.copy(
            latLngToVector3({
              lat: activeStadium!.coords.bottomRight[0] + 0.002,
              lng: activeStadium!.coords.bottomRight[1] - 0.002,
            }),
          );
          stadiumMesh.position.setY(110);
          stadiumMesh.scale.set(0.2, 0.2, 0.2);
          stadiumMesh.castShadow = true;
          stadiumMesh.receiveShadow = true;

          scene.add(stadiumMesh);

          const dateGeo = new TextGeometry(
            matchDate.toLocaleDateString('en-US', {
              day: 'numeric',
              year: 'numeric',
              month: 'long',
            }),
            {
              font: font,
              size: 40,
              height: 5,
              curveSegments: 12,
              bevelEnabled: true,
              bevelThickness: 10,
              bevelSize: 8,
              bevelOffset: 0,
              bevelSegments: 5,
            },
          );

          const dateMesh = new THREE.Mesh(
            dateGeo,
            new THREE.MeshPhongMaterial({
              color: 3462297,
              specular: 0xffffff,
            }),
          );

          dateMesh.position.copy(
            latLngToVector3({
              lat: activeStadium!.coords.bottomRight[0] + 0.002,
              lng: activeStadium!.coords.bottomRight[1] - 0.002,
            }),
          );
          dateMesh.position.setY(140);
          dateMesh.scale.set(0.2, 0.2, 0.2);
          dateMesh.castShadow = true;
          dateMesh.receiveShadow = true;

          scene.add(dateMesh);
        },

        // onProgress callback
        function (xhr) {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        // onError callback
        function (err: any) {
          console.log('An error happened');
          console.error(err);
        },
      );

      new ThreeJSOverlayView({
        map,
        scene,
        // anchor: { ...map?.getCenter(), altitude: 100 },
        THREE,
      });
    }
  }, [map, gmaps, activeMatch, mapCenter]);
};

export default useThreeMatchSummary;
