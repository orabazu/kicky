import { Tabs } from 'antd';
import React from 'react';
import { FiDatabase, FiMap } from 'react-icons/fi';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { AddSourceModal } from './AddSourceModal/AddSourceModal';
import styles from './style.module.scss';
export const LeftBar = () => {
  const navigate = useNavigate();

  const tabs = [
    {
      label: (
        <span>
          <FiDatabase />
        </span>
      ),
      key: 'dataset',
    },
    {
      label: (
        <span>
          <FiMap />
        </span>
      ),
      key: 'map',
    },
  ];

  const onTabsChanged = (activeTab: string) => {
    navigate(`/analytics/${activeTab}`);
  };

  return (
    <div className={styles.LeftBar}>
      <Tabs
        activeKey={window.location.href.includes('dataset') ? 'dataset' : 'map'}
        items={tabs}
        onChange={onTabsChanged}
      />
      <Outlet />
      <div className={styles.LeftBarFooter}>
        <AddSourceModal />
      </div>
    </div>
  );
};
