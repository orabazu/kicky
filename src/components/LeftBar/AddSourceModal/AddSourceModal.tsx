/* eslint-disable no-unused-vars */
import { Button, Card, Col, Modal, Row, Tabs } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Arsenal from 'assets/arsenal-2004.png';
import Euro from 'assets/euro-2022.png';
import StatsBomb from 'assets/stats.png';
import { arsenalMatches } from 'const/arsenalMatches';
import React, { useEffect, useState } from 'react';
import { FiCloud, FiHardDrive } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addData, removeData } from 'store/openDataSlice';
import { RootState } from 'store/store';

import styles from './style.module.scss';

enum IndoorData {
  Euro = 'Euro',
  Arsenal = 'Arsenal',
}

export const AddSourceModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openData = useSelector((state: RootState) => state.openData);
  console.debug(openData);
  const dispatch = useDispatch();
  const params = useParams();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (params.datasetId) {
      dispatch(addData({ name: params.datasetId, dataSet: arsenalMatches }));
    }
  }, [params.datasetId]);

  const renderProvider = () => (
    <div className={styles.ProviderWrapper}>
      <div className={styles.Provider}>
        <span>Source: </span>
        <img src={StatsBomb} alt="stats" className={styles.ProviderImage} />
      </div>
    </div>
  );

  const importData = (selectedData: IndoorData) => {
    switch (selectedData) {
      case IndoorData.Arsenal:
        dispatch(addData({ name: 'arsenal', dataSet: arsenalMatches }));
        break;
      case IndoorData.Euro:
        dispatch(removeData({ name: 'arsenal' }));
        break;
      default:
        break;
    }
    setIsModalOpen(false);
  };

  const renderOpenData = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card hoverable cover={<img alt="example" src={Euro} />}>
          <Meta
            title="360 Data: Women’s Euro 2022"
            description="360 data captures a freeze-frame showing the location of all players in the
             frame for every event we collect and allows us to uncover a host of new information about 
             the game that was either difficult to see or completely hidden in standard event data."
          />
          {renderProvider()}
          <Button
            block
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={() => importData(IndoorData.Euro)}
          >
            Import
          </Button>
        </Card>
      </Col>
      <Col span={12}>
        <Card hoverable cover={<img alt="example" src={Arsenal} />}>
          <Meta
            title="The Invincibles: Arsenal’s 2003/04 Season"
            description="Historical data of Arsenal’s 2003/04 season, 
            evaluate the performance of the Thiery Henry-led team."
          />
          {renderProvider()}
          <Button
            block
            type="primary"
            style={{ marginTop: '10px' }}
            onClick={() => importData(IndoorData.Arsenal)}
          >
            Import
          </Button>
        </Card>
      </Col>
    </Row>
  );

  const renderIntegrations = () => (
    <Row gutter={16}>
      <Col className="gutter-row" span={6}>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src={StatsBomb} />}
        >
          <Meta title="Europe Street beat" description="www.instagram.com" />
        </Card>
      </Col>
    </Row>
  );

  const tabs = [
    {
      label: (
        <span>
          <FiHardDrive /> Open Data
        </span>
      ),
      key: 'open',
      children: renderOpenData(),
    },
    {
      label: (
        <span>
          <FiCloud /> Integrations
        </span>
      ),
      key: 'integrations',
      children: renderIntegrations(),
    },
  ];

  return (
    <>
      <Button type="primary" block onClick={openModal}>
        Add Data Source{' '}
      </Button>
      <Modal
        title="Add Data Source"
        open={isModalOpen}
        onOk={closeModal}
        onCancel={closeModal}
        width={`60%`}
      >
        <div>
          <Tabs defaultActiveKey="2" items={tabs} />
        </div>
      </Modal>
    </>
  );
};
