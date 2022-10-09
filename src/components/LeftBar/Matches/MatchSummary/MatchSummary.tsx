import { Button, Card } from 'antd';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import styles from './style.module.scss';

type MatchSummaryProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  date: string;
  stadium: string;
  matchId: number;
};

export const MatchSummary: React.FC<MatchSummaryProps> = ({
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  matchId,
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
        <span className={styles.GoTo}>
          <Button type="link">
            <Link to={`${matchId}`}>
              <FiChevronRight />
            </Link>
          </Button>
        </span>
      </div>
    </Card>
  );
};
