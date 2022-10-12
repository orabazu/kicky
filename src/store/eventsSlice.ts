import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export type PassType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  length: number;
  angle: number;
  passer: number;
  passerName: string;
  recipient: number;
  type: string;
};

export interface MapState {
  passes: PassType[];
}

const initialState: MapState = {
  passes: [],
};

export const eventsSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setPasses: (state, action: PayloadAction<PassType[]>) => {
      state.passes = action.payload;
    },
  },
});

export const { setPasses } = eventsSlice.actions;

export default eventsSlice.reducer;
