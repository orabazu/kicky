import { Match } from 'const/arsenalMatches';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getWeightedColor } from 'utils/index';
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
      const activeXThreat = xThreat?.[activeMatch?.match_id]?.[activeTeamId!];

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

          polygon.addListener('mouseover', (e) => {
            const el = document.getElementById('tooltip');
            if (el) {
              el.innerHTML = `<p>Probability: ${Number(bin.probability).toFixed(3)}</p>`;
              el.style.display = 'block';
              el.style.opacity = '0.9';
              el.style.left = e.domEvent.x + 'px';
              el.style.top = e.domEvent.y - 70 + 'px';
              el.style.paddingLeft = '40%';
              el.style.opacity = '1';
            }
          });
          polygon.addListener('mouseout', () => {
            const el = document.getElementById('tooltip');
            if (el) {
              el.style.opacity = '0.0';
            }
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
