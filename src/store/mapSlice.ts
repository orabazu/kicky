/* eslint-disable no-unused-vars */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export enum LayerTypes {
  Pass = 'pass',
  Shots = 'shots',
  PassNetwork = 'passNetwork',
  Kmeans = 'kmeans',
  Frames = 'frames',
  Voronoi = 'voronoi',
  xThreat = 'xThreat',
}

export interface MapState {
  mapCenter: {
    lat: number;
    lng: number;
  };
  layers: {
    [key in LayerTypes]: boolean;
  };
  passFilters: {
    assists: boolean;
    crosses: boolean;
  };
  kmeansFilters: {
    [k: string]: boolean;
  };
  isMobileMapOpen: boolean;
  mapTypeId: string;
}

const initialState: MapState = {
  mapCenter: {
    lng: -0.2805,
    lat: 51.55637,
  },
  layers: {
    [LayerTypes.Pass]: true,
    [LayerTypes.Shots]: false,
    [LayerTypes.PassNetwork]: false,
    [LayerTypes.Kmeans]: false,
    [LayerTypes.Frames]: false,
    [LayerTypes.Voronoi]: false,
    [LayerTypes.xThreat]: false,
  },
  passFilters: {
    assists: false,
    crosses: false,
  },
  kmeansFilters: {
    '0': true,
    '1': true,
    '2': true,
    '3': true,
    '4': true,
    '5': true,
    '6': true,
    '7': true,
  },
  isMobileMapOpen: false,
  mapTypeId: '',
};

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapCenter: (
      state,
      action: PayloadAction<{
        lat: number;
        lng: number;
      }>,
    ) => {
      state.mapCenter = {
        ...state.mapCenter,
        lat: action.payload.lat,
        lng: action.payload.lng,
      };
    },
    setMapTypeId: (state, action: PayloadAction<string>) => {
      state.mapTypeId = action.payload;
    },
    toggleLayer: (state, action: PayloadAction<LayerTypes>) => {
      state.layers[action.payload] = !state.layers[action.payload];
    },
    openLayer: (state, action: PayloadAction<LayerTypes>) => {
      state.layers[action.payload] = true;
    },
    resetAllLayers: (state) => {
      state.layers = {
        [LayerTypes.Pass]: false,
        [LayerTypes.Shots]: false,
        [LayerTypes.PassNetwork]: false,
        [LayerTypes.Kmeans]: false,
        [LayerTypes.Frames]: false,
        [LayerTypes.Voronoi]: false,
        [LayerTypes.xThreat]: false,
      };
    },
    toggleMobileMap: (state) => {
      state.isMobileMapOpen = !state.isMobileMapOpen;
    },
    togglePassFilter: (state, action: PayloadAction<'assists' | 'crosses'>) => {
      state.passFilters[action.payload] = !state.passFilters[action.payload];
    },
    toggleKmeansFilter: (state, action: PayloadAction<string>) => {
      state.kmeansFilters[action.payload] = !state.kmeansFilters[action.payload];
    },
  },
});

export const {
  setMapCenter,
  toggleLayer,
  toggleMobileMap,
  togglePassFilter,
  toggleKmeansFilter,
  resetAllLayers,
  openLayer,
  setMapTypeId,
} = mapSlice.actions;

export default mapSlice.reducer;
