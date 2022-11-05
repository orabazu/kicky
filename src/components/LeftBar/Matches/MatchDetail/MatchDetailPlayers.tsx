import { Avatar, List } from 'antd';
import * as danfo from 'danfojs/dist/danfojs-browser/src';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'store/store';

type PassStateData = {
  passer: number;
  passerName: string;
  teamId: number;
};

type PassersState = {
  home: PassStateData[];
  away: PassStateData[];
};

export const MatchDetailPlayers = () => {
  // const dispatch = useDispatch();
  const params = useParams();
  const eventDataQueries = useSelector((state: RootState) => state.eventDataApi.queries);
  const teams = useSelector((state: RootState) => state.events.teams);
  const activeTeamId = useSelector((state: RootState) => state.events.activeTeamId);

  const [passers, setPassers] = React.useState<PassersState>({
    home: [],
    away: [],
  });

  const createUniquePassers = () => {
    console.log('createPassNetwork');
    Object.keys(eventDataQueries).forEach((key) => {
      //@ts-ignore
      if (key.includes(params.matchId!)) {
        const df = new danfo.DataFrame(
          //@ts-ignore
          eventDataQueries[key]?.data?.passes,
        );

        console.log(df);

        const passers = df.groupby(['passer']);
        // const allPasses = passers.apply((x) => x);

        const passerNames = passers
          .first()
          .loc({ columns: ['passer', 'passerName', 'teamId'] })
          .setIndex({ column: 'passer' });

        let uniquePasserNames = danfo.toJSON(passerNames) as PassStateData[];

        const homePassers = uniquePasserNames.filter((m) => m.teamId === teams.home.id);
        const awayPassers = uniquePasserNames.filter((m) => m.teamId === teams.away.id);

        setPassers({
          home: homePassers,
          away: awayPassers,
        });

        console.log(homePassers, awayPassers);
      } else {
        console.log('Data is not provided');
      }
    });
  };

  useEffect(() => {
    createUniquePassers();
  }, [eventDataQueries]);

  return (
    <div>
      <List
        itemLayout="horizontal"
        dataSource={activeTeamId === teams.home.id ? passers?.home : passers?.away}
        renderItem={(player) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
              title={<a href="https://ant.design">{player.passerName}</a>}
              description="30 passes"
            />
          </List.Item>
        )}
      />
    </div>
  );
};
