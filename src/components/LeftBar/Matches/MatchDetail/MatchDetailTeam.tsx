import { Button, Typography } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Event } from 'store/eventDataApi';
import { PassType, setPasses } from 'store/eventsSlice';
import { LayerTypes, toggleLayer } from 'store/mapSlice';
import { RootState } from 'store/store';

type MatchDetailTeamProps = {
  matchData?: Event[];
  isAway: boolean;
  teams: {
    home?: number;
    away?: number;
  };
};

const { Title } = Typography;

export const MatchDetailTeam: React.FC<MatchDetailTeamProps> = ({ matchData }) => {
  const dispatch = useDispatch();
  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);

  const passData = useMemo(() => {
    if (matchData) {
      let passes: PassType[] = [];

      for (let index = 0; index < matchData?.length; index++) {
        const event = matchData[index];
        if (
          event.type.name === 'Pass' &&
          !!event.pass.recipient?.id
          // event.team.id == currentTeamAndEvents.teamId
        ) {
          passes.push({
            // startX: isAway ? mirror(event.location[0], pitch) : event.location[0],
            startX: event.location![0],
            startY: event.location![1],
            // endX: isAway ? mirror(event.pass.end_location[0], pitch)  : event.pass.end_location[0],
            endX: event.pass.end_location[0],
            endY: event.pass.end_location[1],
            length: event.pass.length,
            angle: event.pass.angle,
            passer: event.player?.id,
            passerName: event.player?.name,
            recipient: event.pass.recipient?.id,
            type: event.type.name,
            height: event.pass.height.id,
          });
          // console.log('event', event);
        }
      }

      return passes;
    }

    return [];
  }, [matchData]);

  useEffect(() => {
    if (passData) {
      // const passes = getPassData(matchData);
      console.log('SET PASSES', passData);

      dispatch(setPasses(passData));
    }
  }, [passData]);

  const toggle = (layerType: LayerTypes) => {
    dispatch(setPasses(isPassOverlayVisible ? [] : passData));
    dispatch(toggleLayer(layerType));
  };

  return (
    <div className="flex space-between">
      <Title level={5}>Passes</Title>
      <Button
        onClick={() => toggle(LayerTypes.Pass)}
        icon={isPassOverlayVisible ? <IoIosEye /> : <IoIosEyeOff />}
      />
    </div>
  );
};
