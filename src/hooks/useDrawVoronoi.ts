//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PassType } from 'store/eventsSlice';
import { RootState } from 'store/store';

type useDrawVoronoiType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
};

const useDrawVoronoi = ({
  activeTeamId,
  forceRerender,
  gmaps,
  map,
}: useDrawVoronoiType) => {
  const isVoronoiVisible = useSelector((state: RootState) => state.map.layers.voronoi);
  const voronoiLayer = useSelector((state: RootState) => state.events.voronois);
  const activeShotFrame = useSelector((state: RootState) => state.events.activeShotFrame);

  const [voronoiOverlay, setVoronoiOverlay] = useState<GoogleMapsOverlay>();

  useEffect(() => {
    if (map && gmaps) {
      if (activeTeamId && activeShotFrame?.id) {
        if (voronoiLayer && voronoiLayer[activeShotFrame.id]) {
          const voronoiOverlayInstance = new gmaps.maps.Polygon({
            paths: [...voronoiLayer[activeShotFrame?.id]],
          });

          // map.data.add({
          //   id: activeShotFrame.id,
          //   geometry: new gmaps.maps.Data.Polygon([...voronoiLayer[activeShotFrame?.id]]),
          // });

          voronoiOverlay?.setMap(null);
          voronoiOverlayInstance.setMap(map);
          setVoronoiOverlay(voronoiOverlayInstance);
          forceRerender();
        } else {
          voronoiOverlay?.setMap(null);
        }
      }
    }
  }, [activeShotFrame?.id, map, voronoiLayer, isVoronoiVisible, activeTeamId]);

  return [];
};

export default useDrawVoronoi;
