//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer, HeatmapLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { rgbToArray } from 'src/utils';
import { PassType } from 'store/eventsSlice';
import { RootState } from 'store/store';

type useDrawPlayerPassesType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  passes: PassType[] | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
};

const useDrawPlayerPasses = ({
  activeTeamId,
  forceRerender,
  gmaps,
  map,
  passes,
}: useDrawPlayerPassesType) => {
  const playersInPitch = useSelector((state: RootState) => state.events.playersInPitch);
  const [passOverlay, setPassOverlay] = useState<GoogleMapsOverlay>();
  const isPlayerPassOverlayVisible = true;
  useEffect(() => {
    if (map && gmaps) {
      if (passes && passOverlay && !isPlayerPassOverlayVisible) {
        passOverlay.setMap(null);
        forceRerender();
      } else if (activeTeamId && Boolean(playersInPitch.length)) {
        const filteredPasses = passes
          ?.filter((pass) => pass.teamId === activeTeamId)
          .filter((pass) => playersInPitch.some((p) => p.passer === pass.passer));

        const passData = filteredPasses?.map((pass) => {
          const playerInEpoch = playersInPitch.find((p) => p.passer === pass.passer);
          if (playerInEpoch) {
            if (playerInEpoch.filters.passes) {
              return {
                ...pass,
                color: playerInEpoch.color,
              };
            }
            if (playerInEpoch.filters.assists) {
              return {
                ...pass,
                color: playerInEpoch.color,
              };
            }
          }
          return false;
        });

        const heatmapPassData = filteredPasses?.filter((pass) => {
          const playerInEpoch = playersInPitch.find((p) => p.passer === pass.passer);
          if (playerInEpoch) {
            if (playerInEpoch.filters.heatmap) {
              return true;
            }
          }
          return false;
        });

        const passesLayer = new ArcLayer({
          id: 'playerPasses',
          data: passData,
          //@ts-ignore
          dataTransform: (d: PassType[]) => d.filter((f) => f),
          //@ts-ignore
          getSourcePosition: (f: PassType) => [f.startY, f.startX],
          //@ts-ignore
          getTargetPosition: (f: PassType) => [f.endY, f.endX],
          //@ts-ignore
          getSourceColor: (d: PassType) => rgbToArray(d.color),
          //@ts-ignore
          getTargetColor: (d: PassType) => rgbToArray(d.color),
          getWidth: 2,
          //@ts-ignore
          getHeight: (d: PassType) =>
            d.height === 1 ? 0.02 : d.height === 2 ? 0.2 : 0.3,
        });

        const heatmapLayer = new HeatmapLayer({
          id: 'heatmapLayer',
          data: heatmapPassData,
          getPosition: (d) => [d.startY, d.startX],
          // getWeight: (d) => 1,
          threshold: 0.01,
          aggregation: 'SUM',
          radiusPixels: 150,
          //@ts-ignore
          weightsTextureSize: 512,
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [passesLayer, heatmapLayer],
        });

        passOverlay?.setMap(null);
        overlayInstance.setMap(map);
        setPassOverlay(overlayInstance);
        forceRerender();
      }
    }
  }, [passes, map, activeTeamId, playersInPitch]);

  return [passOverlay];
};

export default useDrawPlayerPasses;
