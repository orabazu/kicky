import { Avatar, Button, List } from 'antd';
import { DataFrame, toJSON } from 'danfojs/dist/danfojs-browser/src';
import { FastAverageColor } from 'fast-average-color';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { ShotOutcome } from 'utils/index';
import {
  PlayerInPitch,
  PlayerInPitchFilterType,
  removePlayerInPitchById,
  setPlayerInPitch,
  togglePlayerInPitchFilter,
} from 'store/eventsSlice';
import { resetAllLayers } from 'store/mapSlice';
import { RootState } from 'store/store';

type EventStateData = {
  passer: number;
  passerName: string;
  teamId: number;
};

type EventState = {
  home: EventStateData[];
  away: EventStateData[];
  stats: {
    passes: any[];
    shots: any[];
    assists: any[];
    goals: any[];
  };
};

export const MatchDetailPlayers = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventDataQueries = useSelector((state: RootState) => state.eventDataApi.queries);
  const teams = useSelector((state: RootState) => state.events.teams);
  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);
  const playersInPitch = useSelector((state: RootState) => state.events.playersInPitch);
  const fac = new FastAverageColor();

  const [events, setEvents] = React.useState<EventState>({
    home: [],
    away: [],
    stats: {
      passes: [],
      shots: [],
      assists: [],
      goals: [],
    },
  });

  const createUniquePassers = () => {
    Object.keys(eventDataQueries).forEach((key) => {
      if (params.matchId && key.includes(params.matchId)) {
        const passDf = new DataFrame(
          //@ts-ignore
          eventDataQueries[key]?.data?.passes,
        );

        const shotDf = new DataFrame(
          //@ts-ignore
          eventDataQueries[key]?.data?.shots,
        );

        const passers = passDf.groupby(['passer']);
        // const allPasses = passers.apply((x) => x);

        const passCount = passDf
          .groupby(['passer', 'teamId'])
          .agg({ passer: ['count'] })
          .rename({ passer_count: 'pass_count' });

        const passStats = toJSON(passCount) as [];

        const passerNames = passers
          .first()
          .loc({ columns: ['passer', 'passerName', 'teamId'] })
          .setIndex({ column: 'passer' });

        const uniquePasserNames = toJSON(passerNames) as EventStateData[];

        const shotCount = shotDf
          .groupby(['shooterId', 'teamId'])
          .agg({ shooterId: ['count'] })
          .rename({ shooterId_count: 'shot_count' });
        const shotStats = toJSON(shotCount) as [];

        let assistStats: any;
        try {
          const assistCount = passDf
            .query(passDf['isAssist'].gt(0))
            ?.groupby(['passer', 'teamId', 'isAssist'])
            ?.agg({ passer: ['count'] })
            ?.rename({ passer_count: 'assist_count' });
          assistStats = toJSON(assistCount) as [];
        } catch {
          assistStats = [];
        }

        let goalStats: any;
        try {
          const goalCount = shotDf
            .query(shotDf['outcome'].eq(ShotOutcome.Goal))
            .groupby(['shooterId', 'teamId'])
            .agg({ shooterId: ['count'] })
            .rename({ shooterId_count: 'goal_count' });
          goalStats = toJSON(goalCount) as [];
        } catch (error) {
          goalStats = [];
        }

        const homePassers = uniquePasserNames.filter((m) => m.teamId === teams.home.id);
        const awayPassers = uniquePasserNames.filter((m) => m.teamId === teams.away.id);

        setEvents({
          home: homePassers,
          away: awayPassers,
          stats: {
            passes: passStats,
            shots: shotStats,
            assists: assistStats,
            goals: goalStats,
          },
        });
      } else {
        console.log('Data is not provided');
      }
    });
  };

  useEffect(() => {
    createUniquePassers();
    dispatch(resetAllLayers());
  }, [eventDataQueries]);

  const toggleFilter = (passer: EventStateData, filter: keyof PlayerInPitchFilterType) => {
    if (playersInPitch?.find((p) => p.passer === passer.passer)?.filters) {
      dispatch(togglePlayerInPitchFilter({ passer: passer.passer, filter }));
    } else {
      onCheck(true, passer, filter);
    }
  };

  const onCheck = async (
    e: boolean,
    passer: EventStateData,
    filter: keyof PlayerInPitchFilterType,
  ) => {
    const color = await fac.getColorAsync(
      `https://avatars.dicebear.com/api/bottts/${passer.passer}.svg`,
    );
    const payload: PlayerInPitch = {
      ...passer,
      color: color.rgb,
      filters: {
        assists: false,
        goals: false,
        passes: false,
        shots: false,
        heatmap: false,
        ...{ [filter]: true },
      },
    };
    e ? dispatch(setPlayerInPitch(payload)) : dispatch(removePlayerInPitchById(passer.passer));
  };

  const getClassName = (passer: number, filter: keyof PlayerInPitchFilterType) =>
    playersInPitch?.find((p) => p.passer === passer)?.filters?.[filter]
      ? 'playerButton-selected'
      : 'playerButton';

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={activeTeamId === teams.home.id ? events?.home : events?.away}
        renderItem={(player) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src={`https://avatars.dicebear.com/api/bottts/${player.passer}.svg`} />
              }
              title={<a href="https://ant.design">{player.passerName}</a>}
              description={
                <div className="">
                  <Button
                    className={getClassName(player.passer, 'passes')}
                    onClick={() => toggleFilter(player, 'passes')}
                  >
                    Pass (
                    {events.stats.passes?.find((p: any) => p.passer === player.passer)?.pass_count})
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'assists')}
                    onClick={() => toggleFilter(player, 'assists')}
                    disabled={
                      !events.stats.assists?.find((p: any) => p.passer === player.passer)
                        ?.assist_count
                    }
                  >
                    Assist (
                    {events.stats.assists?.find((p: any) => p.passer === player.passer)
                      ?.assist_count || 0}
                    )
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'shots')}
                    onClick={() => toggleFilter(player, 'shots')}
                    disabled={
                      !events.stats.shots?.find((s: any) => s.shooterId === player.passer)
                        ?.shot_count
                    }
                  >
                    Shot (
                    {events.stats.shots?.find((shooter: any) => shooter.shooterId === player.passer)
                      ?.shot_count || 0}
                    )
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'goals')}
                    onClick={() => toggleFilter(player, 'goals')}
                  >
                    Goal (
                    {events.stats.goals?.find((shooter: any) => shooter.shooterId === player.passer)
                      ?.goal_count || 0}
                    )
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'heatmap')}
                    onClick={() => toggleFilter(player, 'heatmap')}
                  >
                    Heatmap
                  </Button>
                </div>
              }
            />

            {/* <span> TODO: Add eye icon to show/hide player in pitch</span>
              <Checkbox onChange={(e) => onCheck(e.target.checked, player)}></Checkbox>
            </span> */}
          </List.Item>
        )}
      />
    </div>
  );
};
