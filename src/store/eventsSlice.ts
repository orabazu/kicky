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
  teamId: number;
  isHome: boolean;
};

export type ShotType = {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  xGoal: number;
  teamId: number;
  isHome: boolean;
};

export type MovementType = {
  path: number[][] | number[];
  timestamps: number[];
  players?: number[][];
};

export type TeamsType = {
  home: {
    id?: number;
    name?: string;
    shortName?: string;
  };
  away: {
    id?: number;
    name?: string;
    shortName?: string;
  };
};

export interface MapState {
  activeTeamId: number | undefined;
  teams: TeamsType;
  passNetworks: {
    [key: string]: any;
  };
  movements: MovementType[];
}

const initialState: MapState = {
  activeTeamId: undefined,
  teams: {
    home: {
      name: '',
      id: 0,
      shortName: '',
    },
    away: {
      name: '',
      id: 0,
      shortName: '',
    },
  },
  passNetworks: {},
  movements: [],
};

export const eventsSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setActiveTeamId: (state, action: PayloadAction<number | undefined>) => {
      state.activeTeamId = action.payload;
    },
    setTeams: (state, action: PayloadAction<TeamsType>) => {
      state.teams.home = action.payload.home;
      state.teams.away = action.payload.away;
    },
    setMovements: (state, action: PayloadAction<MovementType[]>) => {
      state.movements = action.payload;
    },
    setPassNetworkLayer: (
      state,
      action: PayloadAction<{ name: string; dataSet: any }>,
    ) => {
      state.passNetworks = {
        ...state.passNetworks,
        [action.payload.name]: { ...action.payload.dataSet },
      };
    },
  },
});

export const { setMovements, setActiveTeamId, setTeams, setPassNetworkLayer } =
  eventsSlice.actions;

export default eventsSlice.reducer;
