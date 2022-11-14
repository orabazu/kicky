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
    if (map && gmaps) {
      if (shots && shotsOverlay && !isShotsOverlayVisible) {
        shotsOverlay.setMap(null);
        forceRerender();
      } else if (activeTeamId && isShotsOverlayVisible) {
        const filteredShots = shots?.filter((shot) => shot.teamId === activeTeamId);

        const shotsLayer = new ArcLayer({
          id: 'shots',
          data: filteredShots,
          dataTransform: (d: any) => d.filter((f: ShotType[]) => f),
          getSourcePosition: (f: any) => [(f as ShotType).startY, (f as ShotType).startX],
          getTargetPosition: (f: any) => [f.endY, f.endX],
          getSourceColor: (d: any) => (d.height === 1 ? [255, 179, 179] : [0, 128, 200]),
          getTargetColor: (d: any) =>
            d.height === 1 ? [255, 0, 0] : d.height === 2 ? [166, 130, 255] : [0, 0, 80],
          getWidth: 2,
          getHeight: (d: any) => (d.height === 1 ? 0.02 : d.height === 2 ? 0.2 : 0.3),
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [shotsLayer],
        });

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
