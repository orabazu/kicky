import { Button, Modal, Tabs } from 'antd';
import React from 'react';
import { FiDatabase, FiMap } from 'react-icons/fi';

import styles from './style.module.scss';
export const LeftBar = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const tabs = [
    {
      label: (
        <span>
          <FiDatabase />
        </span>
      ),
      key: 'layers',
      children: `Layers`,
    },
    {
      label: (
        <span>
          <FiMap />
        </span>
      ),
      key: 'map',
      children: `Map`,
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.LeftBar}>
      <Tabs defaultActiveKey="2" items={tabs} />
      <div className={styles.LeftBarFooter}>
        <Button type="primary" block onClick={openModal} className={styles.ImportButton}>
          Add Layer{' '}
        </Button>
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onOk={closeModal}
          onCancel={closeModal}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    </div>
  );
};
