import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

import { eventDataApi } from './eventDataApi';
import eventsReducer from './eventsSlice';
import mapReducer from './mapSlice';
import openDataReducer from './openDataSlice';

export const store = configureStore({
  reducer: {
    map: mapReducer,
    openData: openDataReducer,
    events: eventsReducer,
    [eventDataApi.reducerPath]: eventDataApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(eventDataApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
