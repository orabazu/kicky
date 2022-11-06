import { Avatar, Button, List } from 'antd';
import * as danfo from 'danfojs/dist/danfojs-browser/src';
import { FastAverageColor } from 'fast-average-color';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  PlayerInPitch,
  PlayerInPitchFilterType,
  removePlayerInPitchById,
  setPlayerInPitch,
  togglePlayerInPitchFilter,
} from 'store/eventsSlice';
import { resetAllLayers } from 'store/mapSlice';
import { RootState } from 'store/store';

type PassStateData = {
  passer: number;
  passerName: string;
  teamId: number;
};

type PassersState = {
  home: PassStateData[];
  away: PassStateData[];
  stats: {
    passes: any[];
    shots: any[];
    assists: any[];
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

  const [passers, setPassers] = React.useState<PassersState>({
    home: [],
    away: [],
    stats: {
      passes: [],
      shots: [],
      assists: [],
    },
  });

  const createUniquePassers = () => {
    console.log('createPassNetwork');
    Object.keys(eventDataQueries).forEach((key) => {
      //@ts-ignore
      if (key.includes(params.matchId!)) {
        const passDf = new danfo.DataFrame(
          //@ts-ignore
          eventDataQueries[key]?.data?.passes,
        );

        const shotDf = new danfo.DataFrame(
          //@ts-ignore
          eventDataQueries[key]?.data?.shots,
        );

        console.log(passDf);

        const passers = passDf.groupby(['passer']);
        // const allPasses = passers.apply((x) => x);

        const passCount = passDf
          .groupby(['passer', 'teamId'])
          .agg({ passer: ['count'] })
          .rename({ passer_count: 'pass_count' });

        const passStats = danfo.toJSON(passCount) as [];

        const passerNames = passers
          .first()
          .loc({ columns: ['passer', 'passerName', 'teamId'] })
          .setIndex({ column: 'passer' });

        let uniquePasserNames = danfo.toJSON(passerNames) as PassStateData[];

        // const shooters = shotDf.groupby(['shooter']);
        const shotCount = shotDf
          .groupby(['shooterId', 'teamId'])
          .agg({ shooterId: ['count'] })
          .rename({ shooter_count: 'shot_count' });

        const shotStats = danfo.toJSON(shotCount) as [];

        const assistCount = passDf
          .query(passDf['isAssist'].gt(0))
          .groupby(['passer', 'teamId', 'isAssist'])
          .agg({ passer: ['count'] })
          .rename({ passer_count: 'assist_count' });

        console.log(assistCount);
        const assistStats = danfo.toJSON(assistCount) as [];

        const homePassers = uniquePasserNames.filter((m) => m.teamId === teams.home.id);
        const awayPassers = uniquePasserNames.filter((m) => m.teamId === teams.away.id);

        setPassers({
          home: homePassers,
          away: awayPassers,
          stats: {
            passes: passStats,
            shots: shotStats,
            assists: assistStats,
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

  const toggleFilter = (passer: PassStateData, filter: keyof PlayerInPitchFilterType) => {
    if (playersInPitch?.find((p) => p.passer === passer.passer)?.filters) {
      dispatch(togglePlayerInPitchFilter({ passer: passer.passer, filter }));
    } else {
      onCheck(true, passer, filter);
    }
  };

  const onCheck = async (
    e: boolean,
    passer: PassStateData,
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
    e
      ? dispatch(setPlayerInPitch(payload))
      : dispatch(removePlayerInPitchById(passer.passer));
    console.log(passer);
  };

  const getClassName = (passer: number, filter: keyof PlayerInPitchFilterType) =>
    playersInPitch?.find((p) => p.passer === passer)?.filters?.[filter]
      ? 'playerButton-selected'
      : 'playerButton';

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={activeTeamId === teams.home.id ? passers?.home : passers?.away}
        renderItem={(player) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  src={`https://avatars.dicebear.com/api/bottts/${player.passer}.svg`}
                />
              }
              title={<a href="https://ant.design">{player.passerName}</a>}
              description={
                <div className="">
                  <Button
                    className={getClassName(player.passer, 'passes')}
                    onClick={() => toggleFilter(player, 'passes')}
                  >
                    Pass (
                    {
                      passers.stats.passes?.find((p: any) => p.passer === player.passer)
                        ?.pass_count
                    }
                    )
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'assists')}
                    onClick={() => toggleFilter(player, 'assists')}
                    disabled={
                      !passers.stats.assists?.find((p: any) => p.passer === player.passer)
                        ?.assist_count
                    }
                  >
                    Assist (
                    {passers.stats.assists?.find((p: any) => p.passer === player.passer)
                      ?.assist_count || 0}
                    )
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'shots')}
                    onClick={() => toggleFilter(player, 'shots')}
                  >
                    Shot
                  </Button>
                  <Button
                    className={getClassName(player.passer, 'goals')}
                    onClick={() => toggleFilter(player, 'goals')}
                  >
                    Goal
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
