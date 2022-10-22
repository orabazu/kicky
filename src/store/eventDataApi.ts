import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGeoCoordsFromUTM } from 'src/utils';

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
  pass: Pass;
};

type Pass = {
  recipient: PlayPattern;
  length: number;
  angle: number;
  height: PlayPattern;
  end_location: number[];
  type: PlayPattern;
  aerial_won: boolean;
};

type PlayPattern = {
  id: number;
  name: string;
};

type EventRequestType = {
  matchId: string;
  stadiumId: string;
};

// Define a service using a base URL and expected endpoints
export const eventDataApi = createApi({
  reducerPath: 'eventDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/',
  }),
  endpoints: (builder) => ({
    getEventByMatchId: builder.query<Event[], EventRequestType>({
      query: ({ matchId }) => `events/${matchId}.json`,
      transformResponse: (response, _, arg) => {
        const events = response as Event[];
        events?.forEach((event) => {
          if (event.location) {
            event.location = getGeoCoordsFromUTM(
              event.location[0],
              event.location[1],
              Number(arg.stadiumId),
            );
          }
          if (event.pass?.end_location) {
            event.pass.end_location = getGeoCoordsFromUTM(
              event.pass.end_location[0],
              event.pass.end_location[1],
              Number(arg.stadiumId),
            );
          }
        });
        return events;
      },
    }),
  }),
});

export const { useGetEventByMatchIdQuery, useLazyGetEventByMatchIdQuery } = eventDataApi;
