import React from 'react';

import HeaderLogo from '../../assets/logo.png';
import styles from './style.module.scss';

export const Header = () => {
  // header component
  return (
    <div className={styles.siteHeader}>
      <div className={styles.section}>
        <div className={styles.siteHeader}>
          <img src={HeaderLogo} alt="logo" />
        </div>
        <div className={styles.siteHeaderButton}>Analyzer</div>
        <div className={styles.siteHeaderButton}>Discover</div>
      </div>
      <div className={styles.section}>
        <div className={styles.siteHeaderButton}>Settings</div>
        <div className={styles.siteHeaderButton}>Log out</div>
      </div>
    </div>
  );
};
