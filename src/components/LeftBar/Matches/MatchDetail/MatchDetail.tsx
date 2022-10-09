import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { GiSoccerField } from 'react-icons/gi';
import { HiUser, HiUserGroup } from 'react-icons/hi';
import { useParams } from 'react-router-dom';
import { useLazyGetEventByMatchIdQuery } from 'store/eventDataApi';

import { MatchDetailPlayers } from './MatchDetailPlayers';
import { MatchDetailSummary } from './MatchDetailSummary';
import { MatchDetailTeam } from './MatchDetailTeam';

export const MatchDetail = () => {
  const params = useParams();
  const [fetchEventData, { data, isFetching }] = useLazyGetEventByMatchIdQuery();

  const getMatchData = async (matchId: string) => {
    fetchEventData(matchId);
  };

  useEffect(() => {
    if (params.matchId) {
      getMatchData(params.matchId);
    }
  }, [params.matchId]);

  useEffect(() => {
    console.log(data);
    if (data) {
      console.log({ converted: data });
    }
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
