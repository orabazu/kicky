import { Button, Timeline, Typography } from 'antd';
import React from 'react';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getClusterColor, radToDeg, rgbToHex } from 'utils/index';
import { KmeansStatsType } from 'store/eventsSlice';
import { LayerTypes, toggleKmeansFilter, toggleLayer, togglePassFilter } from 'store/mapSlice';
import { RootState } from 'store/store';

import { DataAnalysisModal } from './DataAnalysisModal';

type MatchDetailTeamProps = {};

const { Title } = Typography;

export const MatchDetailTeam: React.FC<MatchDetailTeamProps> = () => {
  const dispatch = useDispatch();
  const params = useParams();

  const isPassOverlayVisible = useSelector((state: RootState) => state.map.layers.pass);
  const isShotsOverlayVisible = useSelector((state: RootState) => state.map.layers.shots);
  const isAssistFilterVisible = useSelector((state: RootState) => state.map.passFilters.assists);
  const isCrossFilterVisible = useSelector((state: RootState) => state.map.passFilters.crosses);
  const isPassNetworOverlayVisible = useSelector(
    (state: RootState) => state.map.layers.passNetwork,
  );
  const isXTFilterVisible = useSelector((state: RootState) => state.map.layers.xThreat);

  const kmeansFilters = useSelector((state: RootState) => state.map.kmeansFilters);

  const passNetworks = useSelector((state: RootState) => state.events.passNetworks);
  const kmeans = useSelector((state: RootState) => state.events.kmeans);
  const xt = useSelector((state: RootState) => state.events.xThreat);

  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);
  const matches = useSelector(
    (state: RootState) => state.openData.data[params.datasetId as string],
  );
  const activeMatch =
    params && matches?.find((match) => match.match_id.toString() === params.matchId);

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
                onClick={() => dispatch(togglePassFilter('assists'))}
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
                onClick={() => dispatch(togglePassFilter('crosses'))}
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
      {Object.keys(passNetworks).length > 0 && (
        <div className="flex space-between">
          <Title level={5}>Pass Network</Title>
          <Button
            onClick={() => toggle(LayerTypes.PassNetwork)}
            icon={isPassNetworOverlayVisible ? <IoIosEye /> : <IoIosEyeOff />}
          />
        </div>
      )}
      {Object.keys(kmeans).length > 0 && (
        <>
          <div className="flex space-between">
            <Title level={5}>Pass Clusters</Title>
            <Button
              onClick={() => toggle(LayerTypes.Kmeans)}
              icon={isPassNetworOverlayVisible ? <IoIosEye /> : <IoIosEyeOff />}
            />
          </div>
          <div className="flex mt-20">
            <Timeline style={{ width: '100%' }}>
              {kmeans?.[activeMatch?.match_id]?.[activeTeamId!].stats.map(
                (stat: KmeansStatsType) => (
                  <Timeline.Item key={stat.cluster} color={rgbToHex(getClusterColor(stat.cluster))}>
                    <div className="flex space-between">
                      <span>Class: {stat.cluster} </span>
                      <span>Mean Angle: {Math.round(radToDeg(stat.angle_mean))} °</span>
                      <span>Mean Length: {Math.round(stat.length_mean)} m</span>
                      <span># of passes: {stat.pass_count}</span>
                      <Button
                        className="skinny-button"
                        type="link"
                        onClick={() => dispatch(toggleKmeansFilter(stat.cluster.toString()))}
                        icon={
                          kmeansFilters[stat.cluster.toString()] ? <IoIosEye /> : <IoIosEyeOff />
                        }
                      />
                    </div>
                  </Timeline.Item>
                ),
              )}
            </Timeline>
          </div>
        </>
      )}

      {Object.keys(xt).length > 0 && (
        <div className="flex space-between">
          <Title level={5}>Pass Probability </Title>
          <Button
            onClick={() => toggle(LayerTypes.xThreat)}
            icon={isXTFilterVisible ? <IoIosEye /> : <IoIosEyeOff />}
          />
        </div>
      )}

      <DataAnalysisModal />
    </>
  );
};
