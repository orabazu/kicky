import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';

import { eventDataApi } from './eventDataApi';
import eventsReducer from './eventsSlice';
import mapReducer from './mapSlice';
import openDataReducer from './openDataSlice';
import { threeSixtyDataApi } from './threeSixtyDataApi';

const reducer = combineReducers({
  [eventDataApi.reducerPath]: eventDataApi.reducer,
  [threeSixtyDataApi.reducerPath]: threeSixtyDataApi.reducer,
  events: eventsReducer,
  map: mapReducer,
  openData: openDataReducer,
});

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(eventDataApi.middleware)
      .concat(threeSixtyDataApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
