import { Button, Card } from 'antd';
import React from 'react';
import { FiChevronRight, FiChevronsLeft } from 'react-icons/fi';
import { GiSoccerField } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from 'store/store';

import styles from './style.module.scss';

export const DataSets = () => {
  const openData = useSelector((state: RootState) => state.openData.data);
  const dataKeys = Object.keys(openData);
  const navigate = useNavigate();

  const navigateGame = (key) => {
    navigate(`/analytics/dataset/${key}/matches`);
  };
  return (
    <>
      {!dataKeys.length ? (
        'no data'
      ) : (
        <>
          <div>
            <Button
              onClick={() => navigate(`/analytics/dataset/`)}
              type="link"
              icon={<FiChevronsLeft />}
            >
              Back
            </Button>
          </div>
          <div>
            {dataKeys.map((key) => (
              <Card
                onClick={() => navigateGame(key)}
                key={key}
                className={styles.DataCard}
              >
                <div className={styles.DataCardHeading}>
                  <GiSoccerField /> Results
                </div>
                <div className={styles.DataCardBody}>
                  <div>
                    <span>{key.toUpperCase()} - </span>
                    <span>{openData[key].length} games</span>
                  </div>
                  <div className={styles.DataCardExpand}>
                    <Link to={`matches`}>
                      <FiChevronRight />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
};
