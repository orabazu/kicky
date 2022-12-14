import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type SearchResponse = {
  params: string;
};

type SearchResult = string;

// Define a service using a base URL and expected endpoints
export const imageSearchApi = createApi({
  reducerPath: 'imageSearchApi',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://yb6is4z7hh.execute-api.eu-central-1.amazonaws.com/prod'
        : 'http://localhost:8080/image',
    method: 'GET',
  }),
  endpoints: (builder) => ({
    getImage: builder.query<SearchResult, string>({
      query: (search) => encodeURI(`?search=${search}`),
      transformResponse: (response) => {
        const url = response as SearchResponse;
        return url.params;
      },
    }),
  }),
});

export const { useLazyGetImageQuery } = imageSearchApi;
