import { configureStore } from '@reduxjs/toolkit';
import authReducer from './redux/authSlices';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
