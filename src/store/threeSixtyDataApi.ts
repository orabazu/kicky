import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getGeoCoords } from 'src/utils';

export type FreezeFrame = {
  teammate: boolean;
  actor: boolean;
  keeper: boolean;
  location: number[];
};

export type ThreeSixtyEvent = {
  event_uuid: string;
  visible_area: any[];
  freeze_frame: FreezeFrame[];
};

type EventRequestType = {
  matchId: string;
  stadiumId: string;
};

// Define a service using a base URL and expected endpoints
export const threeSixtyDataApi = createApi({
  reducerPath: 'threeSixtyDataApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/',
  }),
  endpoints: (builder) => ({
    getThreeSixtyByMatchId: builder.query<ThreeSixtyEvent[], EventRequestType>({
      query: ({ matchId }) => `three-sixty/${matchId}.json`,
      transformResponse: (response, _, arg) => {
        const events = response as ThreeSixtyEvent[];
        events?.forEach((event) => {
          event.freeze_frame.forEach((frame) => {
            if (frame.location) {
              frame.location = getGeoCoords(
                frame.location[0],
                frame.location[1],
                Number(arg.stadiumId),
              );
            }
          });
        });
        return events;
      },
    }),
  }),
});

export const { useLazyGetThreeSixtyByMatchIdQuery } = threeSixtyDataApi;
