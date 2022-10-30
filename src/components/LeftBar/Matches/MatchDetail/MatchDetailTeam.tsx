import { Button, Timeline, Typography } from 'antd';
import React from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { LayerTypes, toggleFilter, toggleLayer } from 'store/mapSlice';
import { RootState } from 'store/store';

type MatchDetailTeamProps = {};

const { Title } = Typography;

export const MatchDetailTeam: React.FC<MatchDetailTeamProps> = () => {
  const dispatch = useDispatch();
  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);
  const isShotsOverlayVisible = useSelector((state: RootState) => state.map.layers.shots);
  const isAssistFilterVisible = useSelector(
    (state: RootState) => state.map.passFilters.assists,
  );
  const isCrossFilterVisible = useSelector(
    (state: RootState) => state.map.passFilters.crosses,
  );

  const toggle = (layerType: LayerTypes) => {
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
