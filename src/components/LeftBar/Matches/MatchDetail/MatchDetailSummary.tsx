import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setMovements } from 'store/eventsSlice';
import { LayerTypes, toggleLayer } from 'store/mapSlice';
import { FreezeFrame, useLazyGetThreeSixtyByMatchIdQuery } from 'store/threeSixtyDataApi';

type MatchDetailSummaryProps = {
  matchId?: string;
  stadiumId: string | null;
};

export const MatchDetailSummary: React.FC<MatchDetailSummaryProps> = ({
  matchId,
  stadiumId,
}) => {
  const [fetchThreeSixtyData, { data: threeSixty, isFetching: isThreeSixtyFetching }] =
    useLazyGetThreeSixtyByMatchIdQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('dispatch');
    dispatch(toggleLayer(LayerTypes.Pass));
  }, []);

  useEffect(() => {
    if (matchId && stadiumId) {
      fetchThreeSixtyData({ matchId, stadiumId });
    }
  }, [matchId, stadiumId]);

  useEffect(() => {
    let movements: any[] = [
      {
        path: [],
        timestamps: [],
        players: [],
      },
    ];
    if (threeSixty) {
      threeSixty.forEach((event, idx) => {
        movements[0].players.push([]);
        event.freeze_frame.find((frame: FreezeFrame) => {
          if (frame.actor === true) {
            movements[0].path.push([frame.location[1], frame.location[0]]);
          } else {
            movements[0].players[idx] = [
              ...movements[0].players[idx],
              [frame.location[1], frame.location[0]],
            ];
          }
        });
        movements[0].timestamps.push(50 * idx);
      });
    }
    dispatch(setMovements(movements));
    console.log(movements);
  }, [threeSixty]);

  console.log(threeSixty);

  return <div>{isThreeSixtyFetching || threeSixty?.[0]?.event_uuid}</div>;
};
