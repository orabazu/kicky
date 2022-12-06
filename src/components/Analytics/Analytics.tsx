import { RightBar } from 'components/RightBar';
import React from 'react';

import { LeftBar } from '../LeftBar';
import styles from './style.module.scss';

export const Analytics = () => {
  // const navigate = useNavigate();
  // useEffect(() => {
  //   navigate('/analytics/dataset');
  // }, []);

  return (
    <>
      <div className={styles.SideBar}>
        <LeftBar />
      </div>
      <div>
        <RightBar />
      </div>
    </>
  );
};

export default Analytics;
