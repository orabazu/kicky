import { Button, Card } from 'antd';
import React from 'react';
import { FiChevronRight } from 'react-icons/fi/index.esm';
import { Link } from 'react-router-dom';

import { MatchScore } from './MatchScore';
import styles from './style.module.scss';

type MatchSummaryProps = {
  homeTeamName: string;
  awayTeamName: string;
  homeScore: number;
  awayScore: number;
  date: string;
  stadium: {
    id: number;
    name: string;
    country: {
      id: number;
      name: string;
    };
  };
  matchId: number;
};

export const MatchSummary: React.FC<MatchSummaryProps> = ({
  homeTeamName,
  awayTeamName,
  homeScore,
  awayScore,
  matchId,
  stadium,
}) => {
  return (
    <Card>
      <div className={styles.MatchResult}>
        <MatchScore
          awayScore={awayScore}
          homeScore={homeScore}
          awayTeamName={awayTeamName}
          homeTeamName={homeTeamName}
        />
        <span className={styles.GoTo}>
          <Button type="link">
            <Link to={`${matchId}?stadiumId=${stadium.id}`}>
              <FiChevronRight />
            </Link>
          </Button>
        </span>
      </div>
    </Card>
  );
};
