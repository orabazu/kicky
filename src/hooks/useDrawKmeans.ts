//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { Match } from 'const/arsenalMatches';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

type useDrawKmeansType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
  activeMatch: Match | undefined;
};

export const getClusterColor = (cluster: number) => {
  if (cluster === 0) {
    return [228, 26, 28];
  } else if (cluster === 1) {
    return [55, 126, 184];
  } else if (cluster === 2) {
    return [77, 175, 74];
  } else if (cluster === 3) {
    return [152, 78, 163];
  } else if (cluster === 4) {
    return [255, 127, 0];
  } else if (cluster === 5) {
    return [255, 255, 51];
  } else if (cluster === 6) {
    return [166, 86, 40];
  } else if (cluster === 7) {
    return [247, 129, 191];
  } else {
    return [128, 128, 128];
  }
};

const useDrawKmeans = ({
  map,
  gmaps,
  forceRerender,
  activeMatch,
  activeTeamId,
}: useDrawKmeansType) => {
  const kmeans = useSelector((state: RootState) => state.events.kmeans);
  const isKmeansOverlayVisible = useSelector(
    (state: RootState) => state.map.layers.kmeans,
  );

  const [kmeansOverlay, setKmeansOverlay] = useState<GoogleMapsOverlay>();

  useEffect(() => {
    console.log('SET PASSES OVERLAY');
    if (map && gmaps) {
      if (kmeans && kmeansOverlay && !isKmeansOverlayVisible) {
        kmeansOverlay.setMap(null);
        forceRerender();
      } else if (
        activeTeamId &&
        isKmeansOverlayVisible &&
        kmeans?.[activeMatch?.match_id!]?.[activeTeamId!]
      ) {
        const activeKmeansCluster = kmeans?.[activeMatch?.match_id!]?.[activeTeamId!];

        const passesLayer = new ArcLayer({
          id: 'kmeans',
          data: activeKmeansCluster.data,
          //@ts-ignore
          dataTransform: (d: any[]) => d.filter((f) => f),
          //@ts-ignore
          getSourcePosition: (f: any) => [f.startY, f.startX],
          //@ts-ignore
          getTargetPosition: (f: any) => [f.endY, f.endX],
          //@ts-ignore

          getSourceColor: (d: any) => getClusterColor(d.cluster),
          //@ts-ignore
          getTargetColor: (d: any) => getClusterColor(d.cluster),
          getWidth: 2,
          //@ts-ignore
          getHeight: (d: any) => (d.height === 1 ? 0.02 : d.height === 2 ? 0.2 : 0.3),
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [passesLayer],
        });

        kmeansOverlay?.setMap(null);
        overlayInstance.setMap(map);
        setKmeansOverlay(overlayInstance);
        forceRerender();
      }
    }
  }, [kmeans, isKmeansOverlayVisible, map, gmaps, activeTeamId]);
};

export default useDrawKmeans;
