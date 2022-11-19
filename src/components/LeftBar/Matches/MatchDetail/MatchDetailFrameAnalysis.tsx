import { Button, Card } from 'antd';
import React, { useEffect, useState } from 'react';
import { FiChevronRight } from 'react-icons/fi/index.esm';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShotOutcome } from 'utils/index';
import { EventResponseType } from 'store/eventDataApi';
import { setActiveShotFrame, ShotType } from 'store/eventsSlice';
import { removeAllPlayersInPitch } from 'store/eventsSlice';
import { LayerTypes, openLayer, resetAllLayers, setMapCenter, toggleLayer } from 'store/mapSlice';
import { RootState } from 'store/store';

import styles from './MatchDetailFrameAnalysis.module.scss';

type MatchDetailFrameAnalysisProps = {};

export const MatchDetailFrameAnalysis: React.FC<MatchDetailFrameAnalysisProps> = () => {
  const params = useParams();
  const eventDataQueries = useSelector((state: RootState) => state.eventDataApi.queries);
  const dispatch = useDispatch();
  const [shots, setShots] = useState<ShotType[]>([]);
  const activeShotFrame = useSelector((state: RootState) => state.events.activeShotFrame);
  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);

  useEffect(() => {
    dispatch(resetAllLayers());
    dispatch(removeAllPlayersInPitch());
  }, []);

  useEffect(() => {
    dispatch(resetAllLayers());
    dispatch(toggleLayer(LayerTypes.Frames));
    Object.keys(eventDataQueries).forEach((key) => {
      if (params.matchId && key.includes(params.matchId)) {
        const shots = (eventDataQueries[key]?.data as EventResponseType).shots.filter(
          (shot) => shot.teamId == activeTeamId,
        );
        setShots(shots);
      }
    });
  }, [activeTeamId]);

  const onActiveShotFrameChange = (shot: ShotType) => {
    dispatch(setActiveShotFrame(shot));
    dispatch(openLayer(LayerTypes.Frames));
    dispatch(
      setMapCenter({
        lat: shot.startX,
        lng: shot.startY,
      }),
    );
  };

  return (
    <div>
      {shots.map((shot) => (
        <Card key={shot.id} className={shot.id === activeShotFrame?.id ? styles.Selected : ''}>
          <div className={styles.FrameAnalysis}>
            <div>
              <div>Player: {shot.shooterName}</div>
              <div>Scored: {shot.outcome === ShotOutcome.Goal ? `⚽️🤪` : `😕`}</div>
              <div>#Players in action: {shot.freezeFrame?.length}</div>
              <div>xG: {shot.xGoal}</div>
              {/* {shot.id === activeShotFrame?.id && <DataAnalysisModal isFrameAnalysis />} */}
            </div>
            <div className={styles.GoTo}>
              <Button type="link" onClick={() => onActiveShotFrameChange(shot)}>
                <FiChevronRight />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// useEffect(() => {
//   if (matchId && stadiumId) {
//     fetchThreeSixtyData({ matchId, stadiumId });
//   }
// }, [matchId, stadiumId]);

// useEffect(() => {
//   let movements: any[] = [
//     {
//       path: [],
//       timestamps: [],
//       players: [],
//     },
//   ];
//   if (threeSixty) {
//     threeSixty.forEach((event, idx) => {
//       movements[0].players.push([]);
//       event.freeze_frame.find((frame: FreezeFrame) => {
//         if (frame.actor === true) {
//           movements[0].path.push([frame.location[1], frame.location[0]]);
//         } else {
//           movements[0].players[idx] = [
//             ...movements[0].players[idx],
//             [frame.location[1], frame.location[0]],
//           ];
//         }
//       });
//       movements[0].timestamps.push(50 * idx);
//     });
//   }
//   dispatch(setMovements(movements));
//   // console.log(movements);
// }, [threeSixty]);

// return <div>{isThreeSixtyFetching || threeSixty?.[0]?.event_uuid}</div>;
