import { Match } from 'const/arsenalMatches';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

type useDrawPassNetworkType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
  activeMatch: Match | undefined;
  playerMarkerClassname: string;
};

const useDrawPassNetwork = ({
  map,
  gmaps,
  activeTeamId,
  activeMatch,
  playerMarkerClassname,
  forceRerender,
}: useDrawPassNetworkType) => {
  const passNetworks = useSelector((state: RootState) => state.events.passNetworks);
  const isPassNetworkOverlayVisible = useSelector(
    (state: RootState) => state.map.layers.passNetwork,
  );

  const [markerViewOverlay, setMarkerViewOverlay] = useState<any[]>([]);
  const [lineOverlay, setLineOverlay] = useState<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (map && gmaps && passNetworks && activeTeamId && activeMatch) {
      if (
        passNetworks &&
        markerViewOverlay &&
        lineOverlay &&
        !isPassNetworkOverlayVisible
      ) {
        markerViewOverlay?.forEach((o) => (o.map = null));
        lineOverlay?.forEach((l) => l.setMap(null));
        forceRerender();
      } else if (activeTeamId && activeMatch && isPassNetworkOverlayVisible) {
        const activePassNetwork = passNetworks?.[activeMatch?.match_id!]?.[activeTeamId!];

        markerViewOverlay?.forEach((o) => (o.map = null));
        lineOverlay?.forEach((l) => l.setMap(null));

        const lineArr: google.maps.Polyline[] = [];
        const markerArr: any[] = [];
        activePassNetwork?.forEach((passNetwork) => {
          const playerName = document.createElement('div');
          playerName.className = playerMarkerClassname;
          playerName.textContent =
            passNetwork.passerName
              .split(' ')
              .filter((p) => p)
              .pop() ?? null;

          //@ts-ignore
          // eslint-disable-next-line no-unused-vars
          const markerView = new gmaps.maps.marker.AdvancedMarkerView({
            map: map,
            position: { lng: passNetwork.startY, lat: passNetwork.startX, alt: 0 },
            content: playerName,
          });
          markerArr.push(markerView);

          const line = new gmaps.maps.Polyline({
            path: [
              { lng: passNetwork.endY, lat: passNetwork.endX },
              { lng: passNetwork.startY, lat: passNetwork.startX },
            ],
            geodesic: false,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: passNetwork.count,
          });

          line.setMap(map);
          lineArr.push(line);
        });
        setLineOverlay(lineArr);
        setMarkerViewOverlay(markerArr);
      }
    }
  }, [map, gmaps, passNetworks, activeTeamId, isPassNetworkOverlayVisible]);
};

export default useDrawPassNetwork;
