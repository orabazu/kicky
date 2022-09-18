import { configureStore } from '@reduxjs/toolkit';

import openDataReducer from './openDataSlice';

export const store = configureStore({
  reducer: {
    openData: openDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
