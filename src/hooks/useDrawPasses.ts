//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PassType } from 'store/eventsSlice';
import { RootState } from 'store/store';

export type useDrawPassesType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  passes: PassType[] | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
};

const useDrawPasses = ({
  activeTeamId,
  forceRerender,
  gmaps,
  map,
  passes,
}: useDrawPassesType) => {
  const passFilters = useSelector((state: RootState) => state.map.passFilters);
  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);

  const [passOverlay, setPassOverlay] = useState<GoogleMapsOverlay>();

  useEffect(() => {
    console.log('SET PASSES OVERLAY');
    if (map && gmaps) {
      if (passes && passOverlay && !isPassOverlayVisible) {
        console.log('REMOVE PASSES OVERLAY');
        passOverlay.setMap(null);
        forceRerender();
      } else if (activeTeamId && isPassOverlayVisible) {
        console.log('RENDER PASS OVERLAY');
        const filteredPasses = passes
          ?.filter((pass) => pass.teamId === activeTeamId)
          .filter((pass) => {
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

        const passesLayer = new ArcLayer({
          id: 'passes',
          data: filteredPasses,
          //@ts-ignore
          dataTransform: (d: PassType[]) => d.filter((f) => f),
          //@ts-ignore
          getSourcePosition: (f: PassType) => [f.startY, f.startX],
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
          getHeight: (d: PassType) =>
            d.height === 1 ? 0.02 : d.height === 2 ? 0.2 : 0.3,
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [passesLayer],
        });

        passOverlay?.setMap(null);
        overlayInstance.setMap(map);
        setPassOverlay(overlayInstance);
        forceRerender();
      }
    }
  }, [passes, map, passFilters, isPassOverlayVisible, activeTeamId]);

  return [passOverlay];
};

export default useDrawPasses;
