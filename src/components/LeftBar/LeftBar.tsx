import { Button, Tabs } from 'antd';
import React from 'react';
import { FiDatabase, FiMap, FiSidebar } from 'react-icons/fi';
import { FiChevronsLeft } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { toggleMobileMap } from 'store/mapSlice';
import { RootState } from 'store/store';

import { AddSourceModal } from './AddSourceModal/AddSourceModal';
import styles from './style.module.scss';
export const LeftBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobileMapOpen = useSelector((state: RootState) => state.map.isMobileMapOpen);

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

  const toggleMap = () => {
    dispatch(toggleMobileMap());
  };

  return (
    <div className={styles.LeftBar}>
      <Tabs
        items={tabs}
        onChange={onTabsChanged}
        activeKey={window.location.href.includes('dataset') ? 'dataset' : 'map'}
      />
      {
        <div>
          <Button onClick={() => navigate(-1)} type="link" icon={<FiChevronsLeft />}>
            Back
          </Button>
        </div>
      }

      <Outlet />
      <div className={styles.LeftBarFooter}>
        <AddSourceModal />
      </div>
      <div className={styles.ToggleMap}>
        <Button onClick={toggleMap} type="primary" shape="round">
          <div className={styles.ButtonWrapper}>
            Toggle {isMobileMapOpen ? 'Dashboard' : 'Map'}
            <div className={styles.ButtonLogo}>
              {isMobileMapOpen ? <FiSidebar /> : <FiMap />}
            </div>
          </div>
        </Button>
      </div>
    </div>
  );
};
