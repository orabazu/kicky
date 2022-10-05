import { Button, Card } from 'antd';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useLazyGetEventByMatchIdQuery } from 'store/eventDataApi';

import styles from './style.module.scss';

type MatchResultProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  date: string;
  stadium: string;
  matchId: number;
};

export const MatchResult: React.FC<MatchResultProps> = ({
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  matchId,
}) => {
  const [fetchEventData, { data, isFetching }] = useLazyGetEventByMatchIdQuery();

  const getMatchData = async () => {
    fetchEventData(matchId.toString());
  };
  console.log(data, isFetching);

  return (
    <Card>
      <div className={styles.MatchResult}>
        <span className={styles.TeamName}>
          {homeTeamName.substring(0, 3).toLocaleUpperCase()}
        </span>
        <div className={styles.Score}>
          <div className={styles.TeamScore}>{homeScore}</div>
          <span className={styles.TeamScore}>{awayScore}</span>
        </div>
        <span className={styles.TeamName}>
          {awayTeamName.substring(0, 3).toLocaleUpperCase()}
        </span>
        <span className={styles.GoTo}>
          <Button onClick={getMatchData} type="link">
            <FiChevronRight />
          </Button>
        </span>
      </div>
    </Card>
  );
};
