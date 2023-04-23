import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as API from './../../api';

const USERS_SLICE_NAME = 'users';

export const getUsersThunk = createAsyncThunk(
  `${USERS_SLICE_NAME}/get`,
  async (payload, thunkAPI) => {
    try {
      const response = await API.getUsers();
      console.log('response :>> ', response);
      return response.data.data;
    } catch (err) {
      console.log('err :>> ', err);
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
});

const { reducer } = usersSlice;

export default reducer;
