import { Segmented, Tabs } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import { stadiums } from 'const/stadiumCoords';
import React, { useEffect } from 'react';
import { GiSoccerField } from 'react-icons/gi';
import { HiUser, HiUserGroup } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { useLazyGetEventByMatchIdQuery } from 'store/eventDataApi';
import { setActiveTeamId, setTeams, TeamsType } from 'store/eventsSlice';
import { setMapCenter } from 'store/mapSlice';
import { RootState } from 'store/store';

import { MatchDetailFrameAnalysis } from './MatchDetailFrameAnalysis';
import { MatchDetailPlayers } from './MatchDetailPlayers';
import { MatchDetailTeam } from './MatchDetailTeam';

export const MatchDetail = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const stadiumId = searchParams.get('stadiumId');
  const { away, home } = useSelector((state: RootState) => state.events.teams);

  const [fetchEventData, { data, isFetching }] = useLazyGetEventByMatchIdQuery();

  const dispatch = useDispatch();

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
      })
    );

    const teamsPayload: TeamsType = {
      home: {
        id: data?.events?.[0].team.id,
        name: data?.events?.[0].team.name,
        shortName: data?.events[0].team.name.substring(0, 3).toLocaleUpperCase(),
      },
      away: {
        id: data?.events?.[1].team.id,
        name: data?.events?.[1].team.name,
        shortName: data?.events[1].team.name.substring(0, 3).toLocaleUpperCase(),
      },
    };

    dispatch(setTeams(teamsPayload));
    dispatch(setActiveTeamId(data?.events?.[0].team.id));
  }, [data?.events]);

  const onCurrentTeamSelected = (val: SegmentedValue) => {
    dispatch(setActiveTeamId(val === 'Away' ? away.id : home.id));
  };

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
          <GiSoccerField /> Frame Analysis
        </span>
      ),
      key: 'FrameAnalysis',
      children: <MatchDetailFrameAnalysis />,
    },
  ];

  return (
    <>
      <div className="flex space-between">
        <h3>
          {home.shortName} - {away.shortName}
        </h3>
        <Segmented
          options={['Home', 'Away']}
          onChange={onCurrentTeamSelected}
          style={{ textAlign: 'center' }}
          onResize={undefined}
          onResizeCapture={undefined}
        />
      </div>
      {isFetching ? <div>Loading...</div> : <Tabs items={tabs} defaultActiveKey="1" />}
    </>
  );
};
