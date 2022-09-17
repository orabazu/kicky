import { Tabs } from 'antd';
import React from 'react';
import { FiDatabase, FiMap } from 'react-icons/fi';

import { AddSourceModal } from './AddSourceModal/AddSourceModal';
import styles from './style.module.scss';
export const LeftBar = () => {
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

  return (
    <div className={styles.LeftBar}>
      <Tabs defaultActiveKey="2" items={tabs} />
      <div className={styles.LeftBarFooter}>
        <AddSourceModal />
      </div>
    </div>
  );
};
