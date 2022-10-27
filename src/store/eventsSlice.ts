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

export type ShotType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  xGoal: number;
};

export type MovementType = {
  path: number[][] | number[];
  timestamps: number[];
  players?: number[][];
};

export interface MapState {
  passes: PassType[];
  shots: ShotType[];
  movements: MovementType[];
}

const initialState: MapState = {
  passes: [],
  shots: [],
  movements: [],
};

export const eventsSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setPasses: (state, action: PayloadAction<PassType[]>) => {
      state.passes = action.payload;
    },
    setShots: (state, action: PayloadAction<ShotType[]>) => {
      state.shots = action.payload;
    },
    setMovements: (state, action: PayloadAction<MovementType[]>) => {
      state.movements = action.payload;
    },
  },
});

export const { setPasses, setMovements, setShots } = eventsSlice.actions;

export default eventsSlice.reducer;
