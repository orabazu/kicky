import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface OpenDataState {
  data: {
    [id: string]: any;
  };
}

const initialState: OpenDataState = {
  data: {},
};

export const openDataSlice = createSlice({
  name: 'openData',
  initialState,
  reducers: {
    addData: (state, action: PayloadAction<{ name: string; dataSet: any }>) => {
      state.data = {
        ...state.data,
        [action.payload.name]: { ...action.payload.dataSet },
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
