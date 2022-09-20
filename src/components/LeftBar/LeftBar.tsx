import { Tabs } from 'antd';
import { Match } from 'const/arsenalMatches';
import React from 'react';
import { FiDatabase, FiMap } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

import { AddSourceModal } from './AddSourceModal/AddSourceModal';
import { MatchResult } from './MatchResult/MatchResult';
import styles from './style.module.scss';
export const LeftBar = () => {
  const openData = useSelector((state: RootState) => state.openData.data);
  const dataKeys = Object.keys(openData);

  const renderOpenData = () => (
    <div>
      <div>
        <div>
          <FiDatabase className={styles.OpenDataIcon} />
          <span>Open Data </span>
        </div>
        <div>
          {dataKeys.length ? (
            dataKeys.map((key) => {
              console.log(openData, key, openData[key]);
              return (
                openData[key] &&
                openData[key].map((data: Match) => (
                  <MatchResult
                    key={data.match_id}
                    homeTeamName={data.home_team.home_team_name}
                    awayTeamName={data.away_team.away_team_name}
                    homeScore={data.home_score}
                    awayScore={data.away_score}
                    date={data.match_date}
                    matchId={data.match_id}
                    stadium={data.stadium.name}
                  />
                  // <div className={styles.OpenDataItem} key={data.match_id}>
                  //   <span className={styles.OpenDataItemName}>
                  //     {data.home_team.home_team_name}
                  //   </span>
                  //   <span className={styles.OpenDataItemSize}>
                  //     {data.away_team.away_team_name}
                  //   </span>
                  // </div>
                ))
              );
            })
          ) : (
            <div>
              <span>No data</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    {
      label: (
        <span>
          <FiDatabase />
        </span>
      ),
      key: 'layers',
      children: renderOpenData(),
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
