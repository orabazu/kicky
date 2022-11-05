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
  shooterName: string;
  shooterId: number;
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

export type PassNetwork = {
  endX: number;
  endY: number;
  startX: number;
  startY: number;
  passer: number;
  recipient: number;
  teamId: number;
  passerName: string;
  count: number;
  teamId_1: number;
  startX_mean: number;
  startY_mean: number;
  pass_count: number;
};

export type KmeansType = PassNetwork & {
  cluster: number;
};

export type KmeansStatsType = {
  cluster: number;
  length_mean: number;
  angle_mean: number;
  pass_count: number;
};

export type PlayerInPitch = {
  passer: number;
  passerName: string;
  teamId: number;
};

export interface MapState {
  activeTeamId: number | undefined;
  teams: TeamsType;
  passNetworks: {
    [key: string]: {
      [key: string]: PassNetwork[];
    };
  };
  kmeans: {
    [key: string]: {
      [key: string]: {
        data: KmeansType[];
        stats: KmeansStatsType[];
      };
    };
  };
  playersInPitch: PlayerInPitch[];
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
  kmeans: {},
  playersInPitch: [],
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
    setKmeansLayer: (
      state,
      action: PayloadAction<{
        name: string;
        dataSet: {
          [key: string]: {
            data: KmeansType[];
            stats: any;
          };
        };
      }>,
    ) => {
      state.kmeans = {
        ...state.kmeans,
        [action.payload.name]: {
          ...state.kmeans?.[action.payload.name],
          ...action.payload.dataSet,
        },
      };
    },
    setPlayersInPitch: (state, action: PayloadAction<PlayerInPitch[]>) => {
      state.playersInPitch = action.payload;
    },
    setPlayerInPitch: (state, action: PayloadAction<PlayerInPitch>) => {
      state.playersInPitch.push(action.payload);
    },
    removeAllPlayersInPitch: (state) => {
      state.playersInPitch = [];
    },
    removePlayerInPitchById: (state, action: PayloadAction<number>) => {
      state.playersInPitch = state.playersInPitch.filter(
        (player) => player.passer !== action.payload,
      );
    },
  },
});

export const {
  setMovements,
  setActiveTeamId,
  setTeams,
  setPassNetworkLayer,
  setKmeansLayer,
  setPlayersInPitch,
  removeAllPlayersInPitch,
  removePlayerInPitchById,
  setPlayerInPitch,
} = eventsSlice.actions;

export default eventsSlice.reducer;
