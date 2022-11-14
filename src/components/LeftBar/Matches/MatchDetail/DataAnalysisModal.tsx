//@ts-ignore
import nj from '@d4c/numjs/build/module/numjs.min.js';
import { Avatar, Button, Card, Col, Modal, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ClusterImage from 'assets/cluster.png';
import PassNetworkImage from 'assets/passnetwork.png';
import VoronoiImage from 'assets/voronoi.png';
import xTImage from 'assets/xT.png';
import { Delaunay } from 'd3-delaunay';
import * as danfo from 'danfojs/dist/danfojs-browser/src';
import ml5 from 'ml5';
import React, { useState } from 'react';
import { BsPlusSquareDotted } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { getGeoCoordsFromUTM } from 'src/utils';
import {
  PassType,
  setKmeansLayer,
  setPassNetworkLayer,
  setVoronoiLayer,
  setXthreat,
} from 'store/eventsSlice';
import { LayerTypes, resetAllLayers, toggleLayer } from 'store/mapSlice';
import { RootState } from 'store/store';

import styles from './DataAnalysisModal.module.scss';

type DataAnalysisModalProps = {
  isFrameAnalysis?: boolean;
};

export const DataAnalysisModal: React.FC<DataAnalysisModalProps> = ({
  isFrameAnalysis = false,
}) => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventDataQueries = useSelector((state: RootState) => state.eventDataApi.queries);
  const activeShotFrame = useSelector((state: RootState) => state.events.activeShotFrame);
  const teams = useSelector((state: RootState) => state.events.teams);
  const [searchParams] = useSearchParams();
  const stadiumId = searchParams.get('stadiumId');
  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createPassNetwork = () => {
    Object.keys(eventDataQueries).forEach((key) => {
      //@ts-ignore
      if (key.includes(params.matchId!)) {
        const df = new danfo.DataFrame(
          //@ts-ignore
          eventDataQueries[key]?.data?.passesUntilSubstitution,
        );

        const avereagePositions = df
          .groupby(['passer', 'teamId'])
          .agg({ startX: 'mean', startY: ['mean', 'count'] })
          .rename({ startY_count: 'pass_count' });

        const passBetween = df
          .groupby(['passer', 'recipient', 'teamId', 'passerName'])
          .agg({ startY: ['count'] })
          .rename({ startY_count: 'count' });

        const merged = danfo.merge({
          left: passBetween,
          right: avereagePositions,
          on: ['passer'],
          how: 'left',
        });

        let mergedJson = danfo.toJSON(merged) as any[];
        const averagePositionsJSON = danfo.toJSON(avereagePositions) as any[];

        mergedJson = mergedJson.map((j) => ({
          endX: averagePositionsJSON.find((a) => j.recipient === a.passer)?.startX_mean,
          endY: averagePositionsJSON.find((a) => j.recipient === a.passer)?.startY_mean,
          startX: j.startX_mean,
          startY: j.startY_mean,
          ...j,
        }));

        const homePasses = mergedJson.filter((m) => m.teamId === teams.home.id);
        const awayPasses = mergedJson.filter((m) => m.teamId === teams.away.id);

        dispatch(
          setPassNetworkLayer({
            name: params.matchId!,
            dataSet: {
              [teams.home.id!.toString()]: homePasses,
              [teams.away.id!.toString()]: awayPasses,
            },
          }),
        );
      } else {
        console.log('Data is not provided');
      }
    });
    closeModal();
    dispatch(resetAllLayers());
    dispatch(toggleLayer(LayerTypes.PassNetwork));
  };

  const createKmeans = () => {
    Object.keys(eventDataQueries).forEach((key) => {
      //@ts-ignore
      if (key.includes(params.matchId!)) {
        //@ts-ignore
        const passes = eventDataQueries[key]?.data?.passes;
        const homePasses = passes.filter((p: any) => p.teamId === teams.home.id);
        const awayPasses = passes.filter((p: any) => p.teamId === teams.away.id);
        const filteredHomePasses = homePasses.map((p: any) => ({
          angle: p.angle,
          length: p.length,
        }));
        const filteredAwayPasses = awayPasses.map((p: any) => ({
          angle: p.angle,
          length: p.length,
        }));

        const options = {
          k: 7,
          maxIter: 20,
          threshold: 0.2,
        };
        // When the model is loaded

        const kmeansHome = ml5.kmeans(filteredHomePasses, options, () => {
          const kmeansArr: any[][] = Array.from(kmeansHome.dataset);
          const kmeansHomeResult = kmeansArr.map((kmean, idx) => ({
            //@ts-ignore
            cluster: kmean.centroid,
            ...homePasses[idx],
          }));

          const df = new danfo.DataFrame(kmeansHomeResult);

          const clusterStats = df
            .groupby(['cluster'])
            .agg({ length: 'mean', angle: ['mean', 'count'] })
            .rename({ angle_count: 'pass_count' });

          const clusterStatsJSON = danfo.toJSON(clusterStats);

          dispatch(
            setKmeansLayer({
              name: params.matchId!,
              dataSet: {
                [teams.home.id!.toString()]: {
                  data: kmeansHomeResult,
                  stats: clusterStatsJSON,
                },
              },
            }),
          );
        });

        const kmeansAway = ml5.kmeans(filteredAwayPasses, options, () => {
          const kmeansArr: any[][] = Array.from(kmeansAway.dataset);
          const kmeansAwayResult = kmeansArr.map((kmean, idx) => ({
            //@ts-ignore
            cluster: kmean.centroid,
            ...awayPasses[idx],
          }));

          const df = new danfo.DataFrame(kmeansAwayResult);

          const clusterStats = df
            .groupby(['cluster'])
            .agg({ length: 'mean', angle: ['mean', 'count'] })
            .rename({ angle_count: 'pass_count' });

          const clusterStatsJSON = danfo.toJSON(clusterStats);

          dispatch(
            setKmeansLayer({
              name: params.matchId!,
              dataSet: {
                [teams.away.id!.toString()]: {
                  data: kmeansAwayResult,
                  stats: clusterStatsJSON,
                },
              },
            }),
          );
        });
      }
    });

    closeModal();
    dispatch(resetAllLayers());
    dispatch(toggleLayer(LayerTypes.Kmeans));
  };

  const createVoronoiDiagram = () => {
    const points: any = [];
    activeShotFrame!.freezeFrame!.forEach((f) =>
      //@ts-ignore
      points.push([f.location[0], f.location[1]]),
    );

    const delaunay = Delaunay.from(points);
    const voronoi = delaunay.voronoi([
      52.59016292531434, -2.1308935294774534, 52.59073803892923, -2.130050429133774,
    ]);

    const voronoiArr: any[] = [];

    activeShotFrame!.freezeFrame!.forEach((c: any, idx: number) => {
      const cell = voronoi.cellPolygon(idx);
      const latLngCell = cell.map((c: any) => ({ lat: c[0], lng: c[1] }));
      voronoiArr.push(latLngCell);
    });

    dispatch(setVoronoiLayer({ eventId: activeShotFrame!.id, dataSet: voronoiArr }));
    dispatch(toggleLayer(LayerTypes.Voronoi));
    console.log(voronoiArr);
  };

  const calculateXt = () => {
    Object.keys(eventDataQueries).forEach((key) => {
      //@ts-ignore
      if (key.includes(params.matchId!)) {
        //@ts-ignore
        const passes = eventDataQueries[key]?.data?.passes;
        const homePasses = passes.filter(
          (p: any) => p.teamId === activeTeamId,
        ) as PassType[];

        const geoGrid = new Array(12);
        const stadId = parseInt(stadiumId!);
        for (let i = 0; i < 12; i++) {
          geoGrid[i] = new Array(8);
          for (let j = 0; j < 8; j++) {
            const [upperLeftLat, upperLeftLng] = getGeoCoordsFromUTM(
              i * 10,
              j * 10,
              stadId,
            );
            const [upperRightLat, upperRightLng] = getGeoCoordsFromUTM(
              i * 10,
              j * 10 + 10,
              stadId,
            );
            const [lowerLeftLat, lowerLeftLng] = getGeoCoordsFromUTM(
              i * 10 + 10,
              j * 10,
              stadId,
            );
            const [lowerRightLat, lowerRightLng] = getGeoCoordsFromUTM(
              i * 10 + 10,
              j * 10 + 10,
              stadId,
            );
            geoGrid[i][j] = {
              geom: [
                {
                  lat: upperLeftLat,
                  lng: upperLeftLng,
                },
                {
                  lat: lowerLeftLat,
                  lng: lowerLeftLng,
                },
                {
                  lat: lowerRightLat,
                  lng: lowerRightLng,
                },
                {
                  lat: upperRightLat,
                  lng: upperRightLng,
                },
              ],
            };
          }
        }

        const gridNp = nj.zeros([12, 8]) as nj.NdArray<number>;

        for (let i = 0; i < homePasses.length; i++) {
          const pass = homePasses[i];
          const xGrid = Math.floor(pass.originalStartX / 12);
          const yGrid = Math.floor(pass.originalStartY / 8);
          gridNp.set(xGrid, yGrid, gridNp.get(xGrid, yGrid) + 1);
        }
        const moveProbability = gridNp.multiply(1 / homePasses.length);

        const moveProbabilityList = moveProbability.tolist();
        moveProbabilityList.forEach((element: any, i: number) => {
          element.forEach((e: any, j: number) => {
            geoGrid[i][j] = { ...geoGrid[i][j], probability: e };
          });
        });

        dispatch(
          setXthreat({
            name: params.matchId!,
            dataSet: {
              [activeTeamId!.toString()]: {
                data: geoGrid,
              },
            },
          }),
        );
        dispatch(resetAllLayers());
        dispatch(toggleLayer(LayerTypes.xThreat));
        closeModal();
      }
    });
  };

  return (
    <div>
      <div className={styles.AnalysisButton}>
        <Button type="primary" onClick={openModal} icon={<BsPlusSquareDotted />}>
          {' '}
          Add Soccer Analysis{' '}
        </Button>
      </div>

      <Modal
        title="Add Soccer Analysis"
        open={isModalOpen}
        onCancel={closeModal}
        style={{ top: 20, minWidth: '60%' }}
        footer={null}
      >
        <Row gutter={[16, 16]}>
          {!isFrameAnalysis && (
            <>
              <Col span={12}>
                <Card
                  actions={[
                    <div className={styles.Provider} key="powered">
                      <span>Powered by: </span>
                      <img
                        src={
                          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXGy1t3tz6CJKda8Flq8RRZWiV34uIK6jB4um0OnaK&s'
                        }
                        alt="stats"
                        className={styles.ProviderImage}
                      />
                    </div>,
                    <Button key={'run'} onClick={createPassNetwork}>
                      Run
                    </Button>,
                  ]}
                  className={styles.ProviderCard}
                >
                  <Meta
                    avatar={<Avatar src={PassNetworkImage} />}
                    title="Pass Networks"
                    description="For passing networks we use only accurate/successful passes made by a team until the first substitution along with average postion of the players."
                  />
                  <div className={styles.ProviderWrapper}></div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  actions={[
                    <div className={styles.Provider} key="powered">
                      <span>Powered by: </span>
                      <img
                        src={
                          'https://ml5js.org/static/ml5_logo_purple-88e082b8dc81d8729f95bcc092db90c5.png'
                        }
                        alt="stats"
                        className={styles.ProviderImage}
                      />
                    </div>,
                    <Button key={'run'} onClick={createKmeans}>
                      Run
                    </Button>,
                  ]}
                  className={styles.ProviderCard}
                >
                  <Meta
                    avatar={<Avatar src={ClusterImage} />}
                    title="Clustering K-Means of Passes"
                    description="Find a custom number of geospatial clusters from a set of passes"
                  />
                  <div className={styles.ProviderWrapper}></div>
                </Card>
              </Col>
              <Col span={12}>
                <Card
                  actions={[
                    <Button key={'run'} onClick={calculateXt}>
                      Run
                    </Button>,
                  ]}
                  className={styles.ProviderCard}
                >
                  <Meta
                    avatar={<Avatar src={xTImage} />}
                    title="Calculate pass probability"
                    description="12x8 grid of pass probability shows where the teams are going to pass most likely. Each grid cell is approx.10x10 meters."
                  />
                  <div className={styles.ProviderWrapper}></div>
                </Card>
              </Col>
            </>
          )}
          {isFrameAnalysis && (
            <Col span={12}>
              <Card
                actions={[
                  <Button key={'run'} onClick={createVoronoiDiagram}>
                    Run
                  </Button>,
                ]}
                className={styles.ProviderCard}
              >
                <Meta
                  avatar={<Avatar src={VoronoiImage} />}
                  title="Voronoi Diagram"
                  description="Voronoi Diagrams are a way of partitioning a plane into regions based on distance to points in a specific subset of the plane. 
                  In this case tells about how well the team geometrically controls the pitch."
                />
                <div className={styles.ProviderWrapper}></div>
              </Card>
            </Col>
          )}
        </Row>
      </Modal>
    </div>
  );
};
