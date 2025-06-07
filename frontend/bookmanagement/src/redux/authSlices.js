import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from './utils/axiosInstance';

export const loginUser = createAsyncThunk('auth/loginUser', async ({username,password,navigate}, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post('/token/', {username,password});
    localStorage.setItem('access', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    navigate('/userhome')
    return response.data;
    
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});


export const registerUser = createAsyncThunk('auth/register',
    async(userData,thunkAPI)=>{
        try{
            const response = await axiosInstance.post('/register/',userData);
            return response.data
        }catch(error){
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
)

// User details-------------------------

export const userDetails = createAsyncThunk('user/userDetails',async (_,{rejectWithValue}) =>{
    try{
        const response = await axiosInstance.get('/user_details')
        return response.data
    }catch(error){
        return rejectWithValue(error.response?.data || 'Failed to fetch details');
    }
})



export const logoutUser = (navigate) => async (dispatch) => {
    try {
        const refreshToken = localStorage.getItem('refresh');
        if (refreshToken) {
          await axiosInstance.post('/logout/', { refresh: refreshToken });
          
        }
      } catch (error) {
      console.error("Logout API failed", error);
    } finally {
      dispatch(logout()); // Dispatch the logout action
      navigate('/loginpage');
    }
  };
  


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    access: localStorage.getItem('access') || null,
    refresh: localStorage.getItem('refresh') || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('access'),
    user_details : null,
  },
  reducers: {
    logout: (state) => {
        state.access = null;
        state.refresh = null;
        state.isAuthenticated = false;
        state.user_details = null;
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      },
  },
  extraReducers: (builder) => {
    builder

      .addCase(userDetails.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(userDetails.fulfilled,(state, action)=>{
        state.loading= false;
        state.user_details = action.payload
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.access = action.payload.access;
        state.refresh = action.payload.refresh;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.detail || 'Login failed';
      })
      
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

