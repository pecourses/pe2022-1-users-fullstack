import { combineReducers } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';

const rootReducer = combineReducers({
  usersData: usersReducer,
});

export default rootReducer;
