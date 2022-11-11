import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { PassTechnique } from 'src/utils';

import { FreezeFrame } from './eventDataApi';

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
  technique?: {
    name: string;
    id: PassTechnique;
  };
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
  outcome: number;
  freezeFrame: FreezeFrame[];
  id: string;
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

export type PlayerInPitchFilterType = {
  passes: boolean;
  shots: boolean;
  assists: boolean;
  goals: boolean;
  heatmap: boolean;
};

export type PlayerInPitch = {
  passer: number;
  passerName: string;
  teamId: number;
  color: string;
  filters: PlayerInPitchFilterType;
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
  activeShotFrame: ShotType | undefined;
  voronois: {
    [key: string]: any[][];
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
  kmeans: {},
  playersInPitch: [],
  activeShotFrame: undefined,
  movements: [],
  voronois: {},
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
    togglePlayerInPitchFilter: (
      state,
      action: PayloadAction<{ passer: number; filter: keyof PlayerInPitchFilterType }>,
    ) => {
      state.playersInPitch = state.playersInPitch.map((player) => {
        if (player.passer === action.payload.passer) {
          return {
            ...player,
            filters: {
              ...player.filters,
              [action.payload.filter]: !player.filters[action.payload.filter],
            },
          };
        }
        return player;
      });
    },

    setActiveShotFrame: (state, action: PayloadAction<ShotType | undefined>) => {
      state.activeShotFrame = action.payload;
    },
    setVoronoiLayer: (
      state,
      action: PayloadAction<{ eventId: string; dataSet: any[][] }>,
    ) => {
      state.voronois = {
        ...state.voronois,
        [action.payload.eventId]: action.payload.dataSet,
      };
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
  togglePlayerInPitchFilter,
  setActiveShotFrame,
  setVoronoiLayer,
} = eventsSlice.actions;

export default eventsSlice.reducer;
