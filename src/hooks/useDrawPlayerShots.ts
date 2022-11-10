//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { rgbToArray, ShotOutcome } from 'src/utils';
import { ShotType } from 'store/eventsSlice';
import { RootState } from 'store/store';

type useDrawPlayerShotsType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  shots: ShotType[] | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
};

const useDrawPlayerShots = ({
  activeTeamId,
  forceRerender,
  gmaps,
  map,
  shots,
}: useDrawPlayerShotsType) => {
  const playersInPitch = useSelector((state: RootState) => state.events.playersInPitch);
  const [shotOverlay, setPassOverlay] = useState<GoogleMapsOverlay>();
  const isPlayerPassOverlayVisible = true;
  useEffect(() => {
    if (map && gmaps) {
      if (shots && shotOverlay && !isPlayerPassOverlayVisible) {
        shotOverlay.setMap(null);
        forceRerender();
      } else if (activeTeamId && Boolean(playersInPitch.length)) {
        const filteredPasses = shots
          ?.filter((shot) => shot.teamId === activeTeamId)
          .filter((shot) => playersInPitch.some((p) => p.passer === shot.shooterId));

        const shotData = filteredPasses?.map((shot) => {
          const playerInEpoch = playersInPitch.find((p) => p.passer === shot.shooterId);
          if (playerInEpoch) {
            if (playerInEpoch.filters.shots) {
              return {
                ...shot,
                color: playerInEpoch.color,
              };
            }
            if (playerInEpoch.filters.goals && shot.outcome === ShotOutcome.Goal) {
              return {
                ...shot,
                color: playerInEpoch.color,
              };
            }
          }
          return false;
        });

        const shotsLayer = new ArcLayer({
          id: 'playerShots',
          data: shotData,
          //@ts-ignore
          dataTransform: (d: ShotType[]) => d.filter((f) => f),
          //@ts-ignore
          getSourcePosition: (f: ShotType) => [f.startY, f.startX],
          //@ts-ignore
          getTargetPosition: (f: ShotType) => [f.endY, f.endX],
          //@ts-ignore
          getSourceColor: (d: ShotType) => rgbToArray(d.color),
          //@ts-ignore
          getTargetColor: (d: ShotType) => rgbToArray(d.color),
          getWidth: 4,
          //@ts-ignore
          getHeight: () => 0.02,
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [shotsLayer],
        });

        // shotOverlay?.setMap(null);
        overlayInstance.setMap(map);
        setPassOverlay(overlayInstance);
        forceRerender();
      }
    }
  }, [shots, map, activeTeamId, playersInPitch]);

  return [shotOverlay];
};

export default useDrawPlayerShots;
