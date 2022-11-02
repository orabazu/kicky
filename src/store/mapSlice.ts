/* eslint-disable no-unused-vars */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export enum LayerTypes {
  Pass = 'pass',
  Shots = 'shots',
  PassNetwork = 'passNetwork',
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
  isMobileMapOpen: boolean;
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
  },
  passFilters: {
    assists: false,
    crosses: false,
  },
  isMobileMapOpen: false,
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
    toggleLayer: (state, action: PayloadAction<LayerTypes>) => {
      state.layers[action.payload] = !state.layers[action.payload];
    },
    resetAllLayers: (state) => {
      state.layers = {
        [LayerTypes.Pass]: false,
        [LayerTypes.Shots]: false,
        [LayerTypes.PassNetwork]: false,
      };
    },
    toggleMobileMap: (state) => {
      state.isMobileMapOpen = !state.isMobileMapOpen;
    },
    toggleFilter: (state, action: PayloadAction<'assists' | 'crosses'>) => {
      state.passFilters[action.payload] = !state.passFilters[action.payload];
    },
  },
});

export const {
  setMapCenter,
  toggleLayer,
  toggleMobileMap,
  toggleFilter,
  resetAllLayers,
} = mapSlice.actions;

export default mapSlice.reducer;
