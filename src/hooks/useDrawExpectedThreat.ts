//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { Match } from 'const/arsenalMatches';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWeightedColor } from 'src/utils';
import { PassType } from 'store/eventsSlice';
import { RootState } from 'store/store';

type useDrawExpectedThreatType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
  activeMatch: Match | undefined;
};

const useDrawExpectedThreat = ({
  activeTeamId,
  activeMatch,
  forceRerender,
  gmaps,
  map,
}: useDrawExpectedThreatType) => {
  const isVisible = useSelector((state: RootState) => state.map.layers.xThreat);
  const xThreat = useSelector((state: RootState) => state.events.xThreat);

  const [overlay, setOverlay] = useState<google.maps.Polygon[]>();

  useEffect(() => {
    if (map && gmaps && activeTeamId) {
      const activeXThreat = xThreat?.[activeMatch?.match_id!]?.[activeTeamId!];

      if (activeXThreat && isVisible) {
        const polygonArray: google.maps.Polygon[] = [];
        const grid = activeXThreat.data.flatMap((bin: any) => bin);
        grid.forEach((bin: any) => {
          const polygon = new gmaps.maps.Polygon({
            paths: bin.geom,
            strokeColor: getWeightedColor(bin.probability),
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: getWeightedColor(bin.probability * 50),
            fillOpacity: 0.35,
          });
          polygonArray.push(polygon);
          polygon.setMap(map);
        });

        overlay?.forEach((o) => o.setMap(null));
        setOverlay(polygonArray);
        forceRerender();
      } else {
        overlay?.forEach((o) => o.setMap(null));
      }
    }
  }, [map, xThreat, isVisible, activeTeamId]);

  return [];
};

export default useDrawExpectedThreat;
