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
  height: number;
  isAssist: boolean;
  isCross: boolean;
};

export type MovementType = {
  path: number[][] | number[];
  timestamps: number[];
  players?: number[][];
};

export interface MapState {
  passes: PassType[];
  movements: MovementType[];
}

const initialState: MapState = {
  passes: [],
  movements: [],
};

export const eventsSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setPasses: (state, action: PayloadAction<PassType[]>) => {
      state.passes = action.payload;
    },
    setMovements: (state, action: PayloadAction<MovementType[]>) => {
      state.movements = action.payload;
    },
  },
});

export const { setPasses, setMovements } = eventsSlice.actions;

export default eventsSlice.reducer;
