import { Card } from 'antd';
import React from 'react';

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
}) => {
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
      </div>
    </Card>
  );
};
