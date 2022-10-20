import { Match } from 'const/arsenalMatches';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'store/store';

import { MatchSummary } from './MatchSummary';

type MatchesProps = {};

export const Matches: React.FC<MatchesProps> = () => {
  const params = useParams();

  const matches = params.datasetId
    ? useSelector((state: RootState) => state.openData.data[params.datasetId as string])
    : [];

  console.log(matches);

  return (
    <>
      {matches?.map((match: Match) => (
        <MatchSummary
          key={match.match_id}
          homeTeamName={match.home_team.home_team_name}
          awayTeamName={match.away_team.away_team_name}
          homeScore={match.home_score}
          awayScore={match.away_score}
          date={match.match_date}
          matchId={match.match_id}
          stadium={match.stadium}
        />
      ))}
    </>
  );
};
