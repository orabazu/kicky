import { Avatar, Button, Card, Col, Modal, Row } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ClusterImage from 'assets/cluster.png';
import PassNetworkImage from 'assets/passnetwork.png';
import * as danfo from 'danfojs/dist/danfojs-browser/src';
import React, { useState } from 'react';
import { BsPlusSquareDotted } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPassNetworkLayer } from 'store/eventsSlice';
import { RootState } from 'store/store';

import styles from './DataAnalysisModal.module.scss';

export const DataAnalysisModal = () => {
  const dispatch = useDispatch();
  // const [searchParams] = useSearchParams();
  const params = useParams();
  // const stadiumId = searchParams.get('stadiumId');
  const eventDataQueries = useSelector((state: RootState) => state.eventDataApi.queries);
  const teams = useSelector((state: RootState) => state.events.teams);

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

        console.log(df);

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
        <Row gutter={16}>
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
                <Button key={'run'}> Run </Button>,
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
        </Row>
      </Modal>
    </div>
  );
};
