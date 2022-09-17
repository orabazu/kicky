import { Button, Card, Col, Modal, Row, Tabs } from 'antd';
import Meta from 'antd/lib/card/Meta';
import StatsBomb from 'assets/stats.png';
import React from 'react';
import { FiCloud, FiHardDrive } from 'react-icons/fi';

export const AddSourceModal = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const renderOpenData = () => (
    <Row gutter={16}>
      <Col className="gutter-row" span={6}>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={<img alt="example" src={StatsBomb} />}
        >
          <Meta
            title="StatsBomb"
            description="Certain leagues of 
            StatsBomb Data freely available for public use for research projects 
            and genuine interest in football analytics."
          />
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
      >
        <div>
          <Tabs defaultActiveKey="2" items={tabs} />
        </div>
      </Modal>
    </>
  );
};
