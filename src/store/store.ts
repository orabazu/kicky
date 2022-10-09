import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

import { eventDataApi } from './eventDataApi';
import mapReducer from './mapSlice';
import openDataReducer from './openDataSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    openData: openDataReducer,
    [eventDataApi.reducerPath]: eventDataApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(eventDataApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
