import React from 'react';

import styles from './MatchScore.module.scss';

type MatchScoreProps = {
  homeScore: number;
  awayScore: number;
  homeTeamName: string;
  awayTeamName: string;
};

export const MatchScore: React.FC<MatchScoreProps> = ({
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
}) => {
  return (
    <>
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
    </>
  );
};
