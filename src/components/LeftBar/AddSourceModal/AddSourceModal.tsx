/* eslint-disable no-unused-vars */
import { Button, Card, Col, Modal, Row, Tabs } from 'antd';
import Meta from 'antd/lib/card/Meta';
import Arsenal from 'assets/arsenal-2004.png';
import Euro from 'assets/euro-2022.png';
import StatsBomb from 'assets/stats.png';
import { arsenalMatches } from 'const/arsenalMatches';
import { womenEuroMatches } from 'const/womenEuroMatches';
import React, { useEffect, useState } from 'react';
import { FiCloud, FiHardDrive } from 'react-icons/fi/index.esm';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { addData } from 'store/openDataSlice';

import styles from './style.module.scss';

enum IndoorData {
  Euro = 'Euro',
  Arsenal = 'Arsenal',
}

export const AddSourceModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      switch (params.datasetId) {
        case IndoorData.Arsenal.toLowerCase():
          dispatch(addData({ name: 'arsenal', dataSet: arsenalMatches }));
          break;
        case IndoorData.Euro.toLowerCase():
          dispatch(addData({ name: 'euro', dataSet: womenEuroMatches }));
          break;
        default:
          break;
      }
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
        dispatch(addData({ name: 'euro', dataSet: womenEuroMatches }));
        break;
      default:
        break;
    }
    setIsModalOpen(false);
  };

  const renderOpenData = () => (
    <Row gutter={16}>
      <Col sm={24} md={12}>
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
      <Col sm={24} md={12}>
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
        <Card hoverable style={{ width: 240 }} cover={<img alt="example" src={StatsBomb} />}>
          <Meta title="Soccer data provider" description="" />
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
        style={{ top: 20, minWidth: '60%' }}
      >
        <div>
          <Tabs defaultActiveKey="2" items={tabs} />
        </div>
      </Modal>
    </>
  );
};
