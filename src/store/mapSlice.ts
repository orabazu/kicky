/* eslint-disable no-unused-vars */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export enum LayerTypes {
  Pass = 'pass',
}

export interface MapState {
  mapCenter: {
    lat: number;
    lng: number;
  };
  layers: {
    [key in LayerTypes]: boolean;
  };
}

const initialState: MapState = {
  mapCenter: {
    lng: -0.2805,
    lat: 51.55637,
  },
  layers: {
    [LayerTypes.Pass]: true,
  },
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
  },
});

export const { setMapCenter, toggleLayer } = mapSlice.actions;

export default mapSlice.reducer;
