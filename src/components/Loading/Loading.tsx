import Logo from 'assets/logo.png';
import React from 'react';

import styles from './style.module.scss';

export const Loading = () => {
  return (
    <div className={styles.Loading}>
      <img src={Logo} alt="logo" className={styles.LoadingImage} />
    </div>
  );
};
