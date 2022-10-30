//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ShotType } from 'store/eventsSlice';
import { RootState } from 'store/store';

type useDrawShotsType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  shots: ShotType[] | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
};

const useDrawShots = ({
  activeTeamId,
  forceRerender,
  gmaps,
  map,
  shots,
}: useDrawShotsType) => {
  const [shotsOverlay, setShotsOverlay] = useState<GoogleMapsOverlay>();

  const isShotsOverlayVisible = useSelector((state: RootState) => state.map.layers.shots);

  useEffect(() => {
    console.log('SET SHOTS OVERLAY');
    if (map && gmaps) {
      if (shots && shotsOverlay && !isShotsOverlayVisible) {
        console.log('REMOVE SHOTS OVERLAY');
        console.log(shotsOverlay);

        shotsOverlay.setMap(null);
        forceRerender();
      } else if (activeTeamId && isShotsOverlayVisible) {
        console.log('RENDER SHOTS OVERLAY');

        const shotsLayer = new ArcLayer({
          id: 'shots',
          data: shots,
          //@ts-ignore
          dataTransform: (d: ShotType[]) => d.filter((f) => f),
          //@ts-ignore
          getSourcePosition: (f: ShotType) => [f.startY, f.startX], // Prague
          //@ts-ignore
          getTargetPosition: (f: ShotType) => [f.endY, f.endX],
          //@ts-ignore
          getSourceColor: (d) => (d.height === 1 ? [255, 179, 179] : [0, 128, 200]),
          //@ts-ignore
          getTargetColor: (d) =>
            //@ts-ignore
            d.height === 1 ? [255, 0, 0] : d.height === 2 ? [166, 130, 255] : [0, 0, 80],
          getWidth: 2,
          //@ts-ignore
          getHeight: (d) => (d.height === 1 ? 0.02 : d.height === 2 ? 0.2 : 0.3),
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [shotsLayer],
        });

        console.log(map.overlayMapTypes);
        shotsOverlay?.setMap(null);
        overlayInstance.setMap(map);
        setShotsOverlay(overlayInstance);
        forceRerender();
      }
    }
  }, [shots, map, isShotsOverlayVisible, activeTeamId]);

  return [shotsOverlay];
};
export default useDrawShots;
