import { Card, Tabs } from 'antd';
import { Match } from 'const/arsenalMatches';
import React from 'react';
import { FiChevronRight, FiDatabase, FiMap } from 'react-icons/fi';
import { GiSoccerField } from 'react-icons/gi';
import { useSelector } from 'react-redux';
import { RootState } from 'store/store';

import { AddSourceModal } from './AddSourceModal/AddSourceModal';
import { MatchResult } from './MatchResult/MatchResult';
import styles from './style.module.scss';
export const LeftBar = () => {
  const openData = useSelector((state: RootState) => state.openData.data);
  const dataKeys = Object.keys(openData);
  const [isGamesOpen, setIsGamesOpen] = React.useState<{ [x: string]: boolean }>({});

  const toggleGames = (key: string) => {
    setIsGamesOpen({
      ...isGamesOpen,
      [key]: !isGamesOpen[key],
    });
  };

  const renderOpenData = () => (
    <div>
      {dataKeys.map((key) => (
        <>
          <Card onClick={() => toggleGames(key)} key={key}>
            <div className={styles.DataCardHeading}>
              <GiSoccerField /> Results
            </div>
            <div className={styles.DataCardBody}>
              <div>
                <span>{key.toUpperCase()} - </span>
                <span>{openData[key].length} games</span>
              </div>
              <div className={styles.DataCardExpand}>
                <FiChevronRight />
              </div>
            </div>
          </Card>

          {openData[key] &&
            isGamesOpen[key] &&
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
            ))}
        </>
      ))}
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
