//@ts-ignore
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ArcLayer } from 'deck.gl';
import { google } from 'google-maps';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ShotOutcome } from 'src/utils';
import { FreezeFrame } from 'store/eventDataApi';
import { ShotType } from 'store/eventsSlice';
import { useLazyGetImageQuery } from 'store/imageSearchApi';
import { RootState } from 'store/store';

type useDrawFramesType = {
  map: google.maps.Map<Element> | undefined;
  gmaps: google | undefined;
  forceRerender: () => void;
  activeTeamId: number | undefined;
  playerMarkerClassnames: { [key: string]: string };
};

const useDrawFrames = ({
  activeTeamId,
  forceRerender,
  gmaps,
  map,
  playerMarkerClassnames,
}: useDrawFramesType) => {
  const [markerViewOverlay, setMarkerViewOverlay] = useState<any[]>([]);
  const [fetchImage] = useLazyGetImageQuery();
  const activeShotFrame = useSelector((state: RootState) => state.events.activeShotFrame);
  const [shotOverlay, setShotOverlay] = useState<GoogleMapsOverlay>();

  const isFramesOverlayVisible = useSelector(
    (state: RootState) => state.map.layers.frames,
  );

  const highlight = (markerView: any) => {
    markerView.content.classList.add(playerMarkerClassnames.Highlight);
    markerView.element.style.zIndex = 1;
  };

  const unhighlight = (markerView: any) => {
    markerView.content.classList.remove(playerMarkerClassnames.Highlight);
    markerView.element.style.zIndex = '';
  };

  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('drop');
        intersectionObserver.unobserve(entry.target);
      }
    }
  });

  const generatePlayerMarker = (
    player: FreezeFrame,
    image: string,
    activeShotFrame: ShotType,
    markerArr: any[],
  ) => {
    const playerContent = document.createElement('div');

    playerContent.className =
      playerMarkerClassnames.FramePlayer +
      ' ' +
      (player.teammate ? playerMarkerClassnames.Home : playerMarkerClassnames.Away);
    playerContent.innerHTML = `
      <div>
        <image src=${image} width="20px" />
      </div> 
      <div class=${playerMarkerClassnames.Details}>
        <div>${player.player.name}</div>
        <div class="address">xG: ${activeShotFrame.xGoal}</div>
      </div>
    `;

    //@ts-ignore
    const playerMarker = new gmaps.maps.marker.AdvancedMarkerView({
      map,
      position: {
        lng: player.location[1],
        lat: player.location[0],
        alt: 0,
      },
      content: playerContent,
    });

    const element = playerMarker.element;

    ['focus', 'pointerenter'].forEach((event) => {
      element.addEventListener(event, () => {
        highlight(playerMarker);
      });
    });
    ['blur', 'pointerleave'].forEach((event) => {
      element.addEventListener(event, () => {
        unhighlight(playerMarker);
      });
    });

    playerMarker.addListener('click', () => {
      unhighlight(playerMarker);
    });

    //animate
    element.style.opacity = '0';
    element.addEventListener('animationend', () => {
      element.classList.remove('drop');
      element.style.opacity = '1';
    });
    const time = 0.5 + Math.random(); // 2s delay for easy to see the animation
    element.style.setProperty('--delay-time', time + 's');
    intersectionObserver.observe(element);

    markerArr.push(playerMarker);
  };

  useEffect(() => {
    if (map && gmaps) {
      if (activeShotFrame && markerViewOverlay && !isFramesOverlayVisible) {
        markerViewOverlay?.forEach((o) => (o.map = null));
        shotOverlay?.setMap(null);
        forceRerender();
      } else if (activeTeamId && isFramesOverlayVisible) {
        markerViewOverlay?.forEach((o) => (o.map = null));
        shotOverlay?.setMap(null);
        const markerArr: any[] = [];

        if (activeShotFrame) {
          Promise.all(
            activeShotFrame?.freezeFrame.map(async (player) => {
              console.log(player);
              let image = '';
              try {
                image = await fetchImage(player.player.name + ' transfermarkt').unwrap();
              } catch (e) {
                image = `https://avatars.dicebear.com/api/bottts/${player.player.id}.svg`;
              }

              generatePlayerMarker(player, image, activeShotFrame, markerArr);
            }),
          )
            .catch((err) => {
              err.message; // Oops!
            })
            .finally(() => {
              const player: FreezeFrame = {
                location: [activeShotFrame.startX, activeShotFrame.startY],
                player: {
                  id: activeShotFrame.shooterId,
                  name: activeShotFrame.shooterName,
                },
                teammate: true,
                position: {
                  id: 0,
                  name: '',
                },
              };
              fetchImage(activeShotFrame.shooterName + ' transfermarkt')
                .unwrap()
                .then((image) => {
                  generatePlayerMarker(player, image, activeShotFrame, markerArr);
                });
            });
        }

        const shotsLayer = new ArcLayer({
          id: 'playerShots',
          data: [activeShotFrame],
          //@ts-ignore
          dataTransform: (d: ShotType[]) => d.filter((f) => f),
          //@ts-ignore
          getSourcePosition: (f: ShotType) => [f.startY, f.startX],
          //@ts-ignore
          getTargetPosition: (f: ShotType) => [f.endY, f.endX],
          //@ts-ignore
          getSourceColor: (d: ShotType) =>
            d.outcome === ShotOutcome.Goal ? [0, 255, 0] : [255, 0, 0],
          //@ts-ignore
          getTargetColor: (d: ShotType) =>
            d.outcome === ShotOutcome.Goal ? [0, 255, 0] : [255, 0, 0],
          getWidth: 4,
          //@ts-ignore
          getHeight: () => 0.15,
        });

        const overlayInstance = new GoogleMapsOverlay({
          layers: [shotsLayer],
        });

        overlayInstance.setMap(map);
        setShotOverlay(overlayInstance);
        setMarkerViewOverlay(markerArr);
        forceRerender();
      }
    }
  }, [map, isFramesOverlayVisible, activeShotFrame, activeTeamId]);

  return [];
};
export default useDrawFrames;
