import { Segmented, Tabs } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import { stadiums } from 'const/stadiumCoords';
import React, { useEffect, useState } from 'react';
import { GiSoccerField } from 'react-icons/gi';
import { HiUser, HiUserGroup } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLazyGetEventByMatchIdQuery } from 'store/eventDataApi';
import { setMapCenter } from 'store/mapSlice';

import { MatchDetailPlayers } from './MatchDetailPlayers';
import { MatchDetailSummary } from './MatchDetailSummary';
import { MatchDetailTeam } from './MatchDetailTeam';

export const MatchDetail = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const [fetchEventData, { data, isFetching }] = useLazyGetEventByMatchIdQuery();

  const dispatch = useDispatch();
  const stadiumId = searchParams.get('stadiumId');

  const [isAway, setIsAway] = useState(false);
  const [teams, setTeams] = useState<{
    home?: number;
    away?: number;
  }>({
    home: undefined,
    away: undefined,
  });

  const getMatchData = async (matchId: string, stadiumId: string) => {
    fetchEventData({ matchId, stadiumId });
  };

  useEffect(() => {
    if (params.matchId && stadiumId) {
      getMatchData(params.matchId, stadiumId);
    }
  }, [params.matchId, stadiumId]);

  useEffect(() => {
    const stadium = stadiums.find((stadium) => stadium.id === parseInt(stadiumId!));

    dispatch(
      setMapCenter({
        lat: stadium?.coords.bottomLeft[0]!,
        lng: stadium?.coords.bottomLeft[1]!,
      }),
    );
    setTeams({
      home: data?.[0].team.id,
      away: data?.[1].team.id,
    });
  }, [data]);

  const onCurrentTeamSelected = (val: SegmentedValue) => {
    setIsAway(val === 'Away');
  };

  const tabs = [
    {
      label: (
        <span>
          <HiUserGroup /> Teams
        </span>
      ),
      key: 'teams',
      children: (
        <MatchDetailTeam matchData={data} teamId={isAway ? teams.away : teams.home} />
      ),
    },
    {
      label: (
        <span>
          <HiUser /> Players
        </span>
      ),
      key: 'players',
      children: <MatchDetailPlayers />,
    },
    {
      label: (
        <span>
          <GiSoccerField /> Summary
        </span>
      ),
      key: 'summary',
      children: <MatchDetailSummary matchId={params.matchId} stadiumId={stadiumId} />,
    },
  ];

  return (
    <>
      <div className="flex space-between">
        <h3>
          {data?.[0].team.name.substring(0, 3).toLocaleUpperCase()} -{' '}
          {data?.[1].team.name.substring(0, 3).toLocaleUpperCase()}
        </h3>
        <Segmented
          options={['Home', 'Away']}
          onChange={onCurrentTeamSelected}
          style={{ textAlign: 'center' }}
        />
      </div>
      {isFetching ? <div>Loading...</div> : <Tabs items={tabs} defaultActiveKey="1" />}
    </>
  );
};
