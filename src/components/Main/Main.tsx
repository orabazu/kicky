import { RightBar } from 'components/RightBar';
import React from 'react';

import { Header } from '../Header';
import { LeftBar } from '../LeftBar';
import styles from './style.module.scss';

export const Main = () => {
  return (
    <>
      <Header />
      <div className={styles.SideBar}>
        <LeftBar />
      </div>
      <div>
        <RightBar />
      </div>
    </>
  );
};
