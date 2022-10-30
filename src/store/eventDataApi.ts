import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGeoCoordsFromUTM } from 'src/utils';

import { PassType, ShotType } from './eventsSlice';

type EventRequestType = {
  matchId: string;
  stadiumId: string;
};

export type EventResponseType = {
  events: Event[];
  passes: PassType[];
  shots: ShotType[];
};

export type Event = {
  id: string;
  index: number;
  period: number;
  timestamp: string;
  minute: number;
  second: number;
  type: PlayPattern;
  possession: number;
  possession_team: PlayPattern;
  play_pattern: PlayPattern;
  team: PlayPattern;
  player: PlayPattern;
  position: PlayPattern;
  location?: number[];
  duration: number;
  under_pressure: boolean;
  related_events: string[];
  pass?: Pass;
  shot?: Shot;
};

type Pass = {
  recipient: PlayPattern;
  length: number;
  angle: number;
  height: PlayPattern;
  end_location: number[];
  type: PlayPattern;
  aerial_won: boolean;
  goal_assist: boolean;
  cross: boolean;
};

type PlayPattern = {
  id: number;
  name: string;
};

export type FreezeFrame = {
  location: number[];
  player: PlayPattern;
  position: PlayPattern;
  teammate: boolean;
};

export interface Shot {
  statsbomb_xg: number;
  end_location: number[];
  key_pass_id: string;
  body_part: PlayPattern;
  type: PlayPattern;
  outcome: PlayPattern;
  first_time: boolean;
  technique: PlayPattern;
  freeze_frame: FreezeFrame[];
}

// Define a service using a base URL and expected endpoints
export const eventDataApi = createApi({
  reducerPath: 'eventDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/',
  }),
  endpoints: (builder) => ({
    getEventByMatchId: builder.query<EventResponseType, EventRequestType>({
      query: ({ matchId }) => `events/${matchId}.json`,
      transformResponse: (response, _, arg) => {
        const events = response as Event[];
        console.log(events);
        const homeTeamId = events[0].possession_team.id;
        let passes: PassType[] = [];
        let shots: ShotType[] = [];

        events?.forEach((event) => {
          if (event.location) {
            event.location = getGeoCoordsFromUTM(
              event.possession_team.id !== homeTeamId
                ? 120 - event.location[0]
                : event.location[0],
              event.location[1],
              Number(arg.stadiumId),
            );
          }
          if (event.pass?.end_location) {
            event.pass.end_location = getGeoCoordsFromUTM(
              event.possession_team.id !== homeTeamId
                ? 120 - event.pass.end_location[0]
                : event.pass.end_location[0],
              event.pass.end_location[1],
              Number(arg.stadiumId),
            );
          }
          if (event.shot?.end_location) {
            event.shot.end_location = getGeoCoordsFromUTM(
              event.possession_team.id !== homeTeamId
                ? 120 - event.shot.end_location[0]
                : event.shot.end_location[0],
              event.shot.end_location[1],
              Number(arg.stadiumId),
            );
          }
          // create passes
          if (event.type.name === 'Pass' && !!event.pass?.recipient?.id) {
            passes.push({
              startX: event.location![0],
              startY: event.location![1],
              endX: event.pass.end_location[0],
              endY: event.pass.end_location[1],
              length: event.pass.length,
              angle: event.pass.angle,
              passer: event.player?.id,
              passerName: event.player?.name,
              recipient: event.pass.recipient?.id,
              type: event.type.name,
              height: event.pass.height.id,
              isAssist: !!event.pass['goal_assist'],
              isCross: !!event.pass.cross,
              teamId: event.team.id,
              isHome: event.team.id === homeTeamId,
            });
          }

          if (event.type.name === 'Shot' && event.shot) {
            shots.push({
              startX: event.location![0],
              startY: event.location![1],
              endX: event.shot.end_location[0],
              endY: event.shot.end_location[1],
              xGoal: event.shot.statsbomb_xg,
              teamId: event.team.id,
              isHome: event.team.id === homeTeamId,
            });
          }
        });

        return { events, passes, shots };
      },
    }),
  }),
});

export const { useGetEventByMatchIdQuery, useLazyGetEventByMatchIdQuery } = eventDataApi;
