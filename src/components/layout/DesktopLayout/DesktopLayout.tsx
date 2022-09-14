import { Button } from 'antd';
import React from 'react';

import { Header } from '../Header';
import styles from './style.module.scss';
export const DesktopLayout = () => {
  return (
    <>
      <Header />
      <div className={styles.SideBar}>side</div>
      <div className={styles.Main}>
        <Button type="primary">Primary Button</Button>
      </div>
    </>
  );
};
