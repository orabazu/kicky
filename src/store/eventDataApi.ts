import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
  location: number[];
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

// Define a service using a base URL and expected endpoints
export const eventDataApi = createApi({
  reducerPath: 'eventDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/',
  }),
  endpoints: (builder) => ({
    getEventByMatchId: builder.query<Event[], string>({
      query: (id) => `events/${id}.json`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetEventByMatchIdQuery, useLazyGetEventByMatchIdQuery } = eventDataApi;
