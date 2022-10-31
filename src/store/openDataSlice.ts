import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Match } from 'const/arsenalMatches';

export interface OpenDataState {
  data: {
    [id: string]: Match[];
  };
}

const initialState: OpenDataState = {
  data: {},
};

export const openDataSlice = createSlice({
  name: 'openData',
  initialState,
  reducers: {
    addData: (state, action: PayloadAction<{ name: string; dataSet: Match[] }>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: [...action.payload.dataSet],
      };
    },
    removeData: (state, action: PayloadAction<{ name: string }>) => {
      const stateCopy = { ...state.data };
      delete stateCopy?.[action.payload.name];
      state.data = {
        ...stateCopy,
      };
    },
  },
});

export const { addData, removeData } = openDataSlice.actions;

export default openDataSlice.reducer;
