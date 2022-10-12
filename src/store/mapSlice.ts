import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { google } from 'google-maps';

export interface MapState {
  mapCenter: {
    lat: number;
    lng: number;
  };
  mapInstance: google.maps.Map | null;
}

const initialState: MapState = {
  mapCenter: {
    lng: -0.2805,
    lat: 51.55637,
  },
  mapInstance: null,
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
  },
});

export const { setMapCenter } = mapSlice.actions;

export default mapSlice.reducer;
