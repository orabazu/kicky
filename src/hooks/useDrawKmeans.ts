//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { Match } from 'const/arsenalMatches';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getClusterColor } from 'src/utils';
import { RootState } from 'store/store';

type useDrawKmeansType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
  activeMatch: Match | undefined;
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
  const kmeansFilters = useSelector((state: RootState) => state.map.kmeansFilters);

  const [kmeansOverlay, setKmeansOverlay] = useState<GoogleMapsOverlay>();

  useEffect(() => {
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

        const data = activeKmeansCluster.data.filter((d) => {
          if (kmeansFilters[d.cluster.toString()]) {
            return true;
          }
        });

        const passesLayer = new ArcLayer({
          id: 'kmeans',
          data: data,
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
  }, [kmeans, isKmeansOverlayVisible, map, gmaps, activeTeamId, kmeansFilters]);
};

export default useDrawKmeans;
