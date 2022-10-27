import { Button, Timeline, Typography } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Event } from 'store/eventDataApi';
import { PassType, setPasses, setShots } from 'store/eventsSlice';
import { LayerTypes, toggleFilter, toggleLayer } from 'store/mapSlice';
import { RootState } from 'store/store';

type MatchDetailTeamProps = {
  matchData?: Event[];
  teamId?: number;
};

const { Title } = Typography;

export const MatchDetailTeam: React.FC<MatchDetailTeamProps> = ({
  matchData,
  teamId,
}) => {
  const dispatch = useDispatch();
  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);
  const isShotsOverlayVisible = useSelector((state: RootState) => state.map.layers.shots);
  const isAssistFilterVisible = useSelector(
    (state: RootState) => state.map.passFilters.assists,
  );
  const isCrossFilterVisible = useSelector(
    (state: RootState) => state.map.passFilters.crosses,
  );

  const eventsFormatted = useMemo(() => {
    if (matchData) {
      let passes: PassType[] = [];
      let shots = [];

      for (let index = 0; index < matchData?.length; index++) {
        const event = matchData[index];
        if (
          event.type.name === 'Pass' &&
          !!event.pass?.recipient?.id &&
          event.team.id == teamId
        ) {
          passes.push({
            startX: event.location![0],
            startY: event.location![1],
            endX: event.pass.end_location[0],
            endY: event.pass.end_location[1],
            length: event.pass.length,
            angle: event.pass.angle,
            passer: event.player?.id,
            passerName: event.player?.name,
            recipient: event.pass.recipient?.id,
            type: event.type.name,
            height: event.pass.height.id,
            isAssist: !!event.pass['goal_assist'],
            isCross: !!event.pass.cross,
          });
        } else if (event.type.name === 'Shot' && event.shot && event.team.id == teamId) {
          shots.push({
            startX: event.location![0],
            startY: event.location![1],
            endX: event.shot.end_location[0],
            endY: event.shot.end_location[1],
            xGoal: event.shot.statsbomb_xg,
          });
          // console.log(event);
        }
      }

      return { passes, shots };
    }

    return {
      passes: [],
      shots: [],
    };
  }, [matchData, teamId]);

  useEffect(() => {
    if (eventsFormatted?.passes.length > 0) {
      console.log('SET PASS', eventsFormatted.passes);
      if (isPassOverlayVisible) {
        dispatch(setPasses(eventsFormatted.passes));
      } else {
        dispatch(setPasses([]));
      }
    } else {
      dispatch(setPasses([]));
    }
  }, [eventsFormatted?.passes, isPassOverlayVisible]);

  useEffect(() => {
    if (eventsFormatted?.shots.length > 0) {
      console.log('SET SHOTS', eventsFormatted.shots);
      if (isShotsOverlayVisible) {
        dispatch(setShots(eventsFormatted.shots));
      } else {
        dispatch(setShots([]));
      }
    } else {
      dispatch(setShots([]));
    }
  }, [eventsFormatted?.passes, isShotsOverlayVisible]);

  const toggle = (layerType: LayerTypes) => {
    // dispatch(setPasses(isPassOverlayVisible ? [] : passData));
    dispatch(toggleLayer(layerType));
  };

  return (
    <>
      <div className="flex space-between">
        <Title level={5}>Passes</Title>
        <Button
          onClick={() => toggle(LayerTypes.Pass)}
          icon={isPassOverlayVisible ? <IoIosEye /> : <IoIosEyeOff />}
        />
      </div>
      <div className="flex mt-20">
        <Timeline style={{ width: '100%' }}>
          <Timeline.Item>
            <div className="flex space-between">
              <span>Assists </span>
              <Button
                className="skinny-button"
                type="link"
                onClick={() => dispatch(toggleFilter('assists'))}
                icon={isAssistFilterVisible ? <IoIosEye /> : <IoIosEyeOff />}
              />
            </div>
          </Timeline.Item>
          <Timeline.Item>
            <div className="flex space-between">
              Crosses{' '}
              <Button
                className="skinny-button"
                type="link"
                onClick={() => dispatch(toggleFilter('crosses'))}
                icon={isCrossFilterVisible ? <IoIosEye /> : <IoIosEyeOff />}
              />
            </div>
          </Timeline.Item>
        </Timeline>
      </div>
      <div className="flex space-between">
        <Title level={5}>Shots</Title>
        <Button
          onClick={() => toggle(LayerTypes.Shots)}
          icon={isShotsOverlayVisible ? <IoIosEye /> : <IoIosEyeOff />}
        />
      </div>
    </>
  );
};
