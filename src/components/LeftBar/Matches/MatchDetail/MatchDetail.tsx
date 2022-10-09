import { Tabs } from 'antd';
import { stadiums } from 'const/stadiumCoords';
import React, { useEffect } from 'react';
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

  const getMatchData = async (matchId: string, stadiumId: string) => {
    fetchEventData({ matchId, stadiumId });
  };

  useEffect(() => {
    if (params.matchId && stadiumId) {
      getMatchData(params.matchId, stadiumId);
    }
  }, [params.matchId, stadiumId]);

  useEffect(() => {
    console.log(data);
    if (data) {
      console.log({ converted: data });
    }
    const stadium = stadiums.find((stadium) => stadium.id === parseInt(stadiumId!));

    dispatch(
      setMapCenter({
        lat: stadium?.coords.bottomLeft[0]!,
        lng: stadium?.coords.bottomLeft[1]!,
      }),
    );
  }, [data]);

  console.log(data, isFetching);

  const tabs = [
    {
      label: (
        <span>
          <HiUserGroup /> Teams
        </span>
      ),
      key: 'teams',
      children: <MatchDetailTeam />,
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
      children: <MatchDetailSummary />,
    },
  ];

  return (
    <>
      <h3>MatchDetail</h3>
      <Tabs items={tabs} defaultActiveKey="1" />
    </>
  );
};
