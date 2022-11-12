import React from 'react';
import { Link } from 'react-router-dom';

import HeaderLogo from '../../assets/logo.png';
import styles from './style.module.scss';

export const Header = () => {
  // header component
  return (
    <div className={styles.siteHeader}>
      <div className={styles.section}>
        <div className={styles.siteHeader}>
          <Link to={`/analytics/dataset`}>
            <img src={HeaderLogo} alt="logo" />
          </Link>
        </div>
        {/* <div className={styles.siteHeaderButton}>Analyzer</div> */}
      </div>
    </div>
  );
};
