import { Avatar, Button, Checkbox, List } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import * as danfo from 'danfojs/dist/danfojs-browser/src';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { removePlayerInPitchById, setPlayerInPitch } from 'store/eventsSlice';
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
  };
};

export const MatchDetailPlayers = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const eventDataQueries = useSelector((state: RootState) => state.eventDataApi.queries);
  const teams = useSelector((state: RootState) => state.events.teams);
  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);

  const [passers, setPassers] = React.useState<PassersState>({
    home: [],
    away: [],
    stats: {
      passes: [],
      shots: [],
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

        const homePassers = uniquePasserNames.filter((m) => m.teamId === teams.home.id);
        const awayPassers = uniquePasserNames.filter((m) => m.teamId === teams.away.id);

        setPassers({
          home: homePassers,
          away: awayPassers,
          stats: {
            passes: passStats,
            shots: shotStats,
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

  const onCheck = (e: CheckboxChangeEvent, passer: PassStateData) => {
    console.log(`checked = ${e.target.checked}`);
    e.target.checked
      ? dispatch(setPlayerInPitch(passer))
      : dispatch(removePlayerInPitchById(passer.passer));
    console.log(passer);
  };

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
                  <Button className="playerButton">
                    Pass (
                    {
                      passers.stats.passes?.find((p: any) => p.passer === player.passer)
                        ?.pass_count
                    }
                    )
                  </Button>
                  <Button className="playerButton">Assist</Button>
                  <Button className="playerButton">Shot</Button>
                  <Button className="playerButton">Goal</Button>
                  <Button className="playerButton">Heatmap</Button>
                </div>
              }
            />
            <span>
              <Checkbox onChange={(e) => onCheck(e, player)}></Checkbox>
            </span>
          </List.Item>
        )}
      />
    </div>
  );
};
