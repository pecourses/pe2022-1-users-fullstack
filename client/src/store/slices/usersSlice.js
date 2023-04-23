import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from './../../api';

const USERS_SLICE_NAME = 'users';

export const getUsersThunk = createAsyncThunk(
  `${USERS_SLICE_NAME}/get`,
  async (payload, thunkAPI) => {
    try {
      const response = await API.getUsers();
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

export const createUsersThunk = createAsyncThunk(
  `${USERS_SLICE_NAME}/create`,
  async (payload, thunkAPI) => {
    try {
      const response = await API.createUser(payload);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue({ message: err.message });
    }
  }
);

const initialState = {
  users: [],
  isFetching: false,
  error: null,
};

const usersSlice = createSlice({
  name: USERS_SLICE_NAME,
  initialState,
  extraReducers: builder => {
    // GET
    builder.addCase(getUsersThunk.pending, state => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(getUsersThunk.fulfilled, (state, action) => {
      state.isFetching = false;
      state.users = [...action.payload];
    });
    builder.addCase(getUsersThunk.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    });
    // CREATE
    builder.addCase(createUsersThunk.pending, state => {
      state.isFetching = true;
      state.error = null;
    });
    builder.addCase(createUsersThunk.fulfilled, (state, action) => {
      state.isFetching = false;
      state.users.push(action.payload);
    });
    builder.addCase(createUsersThunk.rejected, (state, action) => {
      state.isFetching = false;
      state.error = action.payload;
    });
  },
});

const { reducer } = usersSlice;

export default reducer;
