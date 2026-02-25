import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  theme: 'light' | 'dark';
  language: 'ru' | 'en';
  pageSize: number;
}

const initialState: SettingsState = {
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  language: (localStorage.getItem('language') as 'ru' | 'en') || 'ru',
  pageSize: Number(localStorage.getItem('pageSize')) || 10,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLanguage: (state, action: PayloadAction<'ru' | 'en'>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      localStorage.setItem('pageSize', String(action.payload));
    },
  },
});

export const { setTheme, setLanguage, setPageSize } = settingsSlice.actions;
export default settingsSlice.reducer;
