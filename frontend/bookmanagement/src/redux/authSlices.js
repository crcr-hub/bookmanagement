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
//-------------------Changepassword------------------------
export const changePassword = createAsyncThunk('user/changePassword',async (data,{rejectWithValue}) =>{
  try{
      const response = await axiosInstance.post('/changepassword/',data)
      return response.data
  }catch(error){
      return rejectWithValue(error.response?.data || 'Failed to fetch details');
  }
})

// User details-------------------------

export const userDetails = createAsyncThunk('user/userDetails',async (_,{rejectWithValue}) =>{
    try{
        const response = await axiosInstance.get('/user_details')
        return response.data
    }catch(error){
        return rejectWithValue(error.response?.data || 'Failed to fetch details');
    }
})

// User profile------------------------
export const userProfile = createAsyncThunk('user/profile',async(_,{rejectWithValue})=>{
    try{
        const response = await axiosInstance.get('/user_profile')
        return response.data
    }catch(error){
        return rejectWithValue(error.response?.data || 'Failed to fetch details');
    }
})

export const updateUserProfile = createAsyncThunk('user/updateStudentProfile',
    async(updatedData,{rejectWithValue})=>{
     try{
    const response = await axiosInstance.put('/user_profile/',updatedData)
      return response.data
    }catch(error){
        return rejectWithValue(error.response?.data || 'Failed to updatedetails');
    }
  }
  )

  //---------------Adding Books -------------------------

  export const addBook = createAsyncThunk('books/addBooks',
    async(updatedBookData,{rejectWithValue}) =>{
        try{

            const formData = new FormData();
      
            // Append regular data
            formData.append('title', updatedBookData.title);
            formData.append('description', updatedBookData.description);
            formData.append('author', updatedBookData.author);
            formData.append('genre', updatedBookData.genre);
            formData.append('publicationDate',updatedBookData.publicationDate)
            formData.append('language', updatedBookData.language);
            if (!isNaN(parseInt(updatedBookData.nopages))) {
                formData.append('nopage', parseInt(updatedBookData.nopages));
            }
           
            
            // Append image (if any)
            if (updatedBookData.image) {
              formData.append('images', updatedBookData.image);
            }
          
        const response = await axiosInstance.post('/books/',formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Ensure the correct content type
            },
          });
          return response.data
      }catch(error){
            return rejectWithValue(error.response?.data || 'Failed add book')
        }
    }
  )


//----------Get my books--------------------
export const getMyBooks = createAsyncThunk('books/getMyBooks',
    async(_,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.get('/getbooks/')
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || 'Failed to fetcg the details')
        }
    }
)
//................update a book.................
export const updateBook =createAsyncThunk('book/updateBook',
    async(bid,{rejectWithValue}) =>{
        try{
            const response = await axiosInstance.get(`/update/${bid}`);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || 'Failed to get the book Details')
        }

    }
)

export const updateBookDetails =createAsyncThunk('book/updateBookDetails',
    async({ bid, updatedBookData },{rejectWithValue}) =>{
        try{
            const formData = new FormData();
      
            // Append regular data
            formData.append('title', updatedBookData.title);
            formData.append('description', updatedBookData.description);
            formData.append('author', updatedBookData.author);
            formData.append('genre', updatedBookData.genre);
            formData.append('publicationDate',updatedBookData.publicationDate)
            formData.append('language', updatedBookData.language);
            if (!isNaN(parseInt(updatedBookData.nopages))) {
                formData.append('nopage', parseInt(updatedBookData.nopages));
            }
           
            
            // Append image (if any)
            if (updatedBookData.images && updatedBookData.images instanceof File) {
                formData.append('images', updatedBookData.images);
              }
            const response = await axiosInstance.put(`/update/${bid}`,formData,{
                headers: {
                  'Content-Type': 'multipart/form-data', // Ensure the correct content type
                },
              });
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || 'Failed to get the book Details')
        }

    }
)
// -----------------------------------------Delete a book------------------------------

export const deleteBook = createAsyncThunk('book/deleteBook',
    async(bid,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.delete(`/update/${bid}`);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to delete book")
        }
    }
)
//.................Single Book Details..................
export const bookDetail = createAsyncThunk('book/bookDetail',
    async(bid,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.get(`/bookdetail/${bid}`);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to fetch book")
        }
    }
)
//.........................Subscribe Book............

export const subscribeBook = createAsyncThunk('book/subscribeBook',
    async(bid,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.post(`/bookdetail/${bid}`);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to subscribe book")
        }
    }
)


export const subscriptionList = createAsyncThunk('book/subscriptionList',
    async(_,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.get('/subscription/');
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to fetch subscription")
        }
    }
)

//------------------ Get add and update  readlist -  ---------------------------

export const getReadlistTitle = createAsyncThunk('book/getReadlistTitle',
  async(_,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.get('/handlereadlistTitle/');
      return response.data
    }catch(error){
      return rejectWithValue(error.response?.data || "failed to get ReadlistTitle");
    }
  }
)


export const addReadlistTitle = createAsyncThunk('book/addReadlistTitle',
  async(newItem,{rejectWithValue})=>{
    try{
      const response = await axiosInstance.post('/handlereadlistTitle/',newItem);
      return response.data
    }catch(error){
      return rejectWithValue(error.response?.data || "failed to add ReadlistTitle");
    }
  }
)
//getSingleReadList

export const getSingleReadList = createAsyncThunk('book/getSingleReadList',
  async(tid,{rejectWithValue})=>{
      try{
          const response = await axiosInstance.get(`/singleReadlist/${tid}`);
          return response.data
      }catch(error){
          return rejectWithValue(error.response?.data || "Failed to fetch readlist")
      }
  }
)

//------------delete entire reading list

export const deleteReadList = createAsyncThunk('book/deleteReadList',
  async(tid,{rejectWithValue})=>{
      try{
          const response = await axiosInstance.delete(`/singleReadlist/${tid}`);
          return response.data
      }catch(error){
          return rejectWithValue(error.response?.data || "Failed to fetch readlist")
      }
  }
)

//------------update reading list name
export const updateReadList = createAsyncThunk('book/updateReadList',
  async(newItem,{rejectWithValue})=>{
      try{
          const response = await axiosInstance.patch(`/singleReadlist/${newItem.titleId}`,newItem);
          return response.data
      }catch(error){
          return rejectWithValue(error.response?.data || "Failed to fetch readlist")
      }
  }
)


export const getReadList = createAsyncThunk('book/getReadList',
    async(_,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.get('/read/');
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to fetch readlist")
        }
    }
)

export const addToReadlist = createAsyncThunk('book/addToReadlist',
    async(newItem,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.post(`/readlist/${newItem.bid}`,newItem);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to add books")
        }
    }
)

export const removeReadlist = createAsyncThunk('book/removeFromReadlist',
    async(bid,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.delete(`/readlist/${bid}`);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to remove books")
        }
    }
)

export const moveUp = createAsyncThunk('book/moveUp',
    async(newItem,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.post(`/readlist/${newItem.bid}/moveup/`,newItem);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to  update")
        }
    }
)
export const moveDown = createAsyncThunk('book/moveDown',
    async(newItem,{rejectWithValue})=>{
        try{
            const response = await axiosInstance.post(`/readlist/${newItem.bid}/movedown/`,newItem);
            return response.data
        }catch(error){
            return rejectWithValue(error.response?.data || "Failed to  update")
        }
    }
)


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
    user_profile : null,
    mybooks : null,
    bookdetails:null,
    singlebook : [],
    subscriptionBooks : [],
    readList : [],
    readlistTitle : null,
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
     

      .addCase(getReadlistTitle.pending,(state)=>{
        state.pending = true;
        state.error = null;
      }) 
      .addCase(getReadlistTitle.rejected,(state,action)=>{
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getReadlistTitle.fulfilled,(state,action)=>{
        state.loading = false;
        state.error = null;
        state.readlistTitle = action.payload;
      })

      //getSingleReadList
      


      .addCase(getSingleReadList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSingleReadList.fulfilled, (state, action) => {
        state.loading = false;
        state.readList = action.payload;
      })
      .addCase(getSingleReadList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.readList = null;
      })





      .addCase(getReadList.pending,(state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(getReadList.fulfilled,(state,action)=>{
        state.loading = false;
        state.readList = action.payload;
      })
      
      .addCase(subscriptionList.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(subscriptionList.fulfilled,(state,action)=>{
        state.loading = false;
        state.subscriptionBooks = action.payload
      })
      .addCase(bookDetail.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(bookDetail.fulfilled,(state,action)=>{
        state.loading = false;
        state.singlebook = action.payload;
      })
      .addCase(updateBook.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBook.fulfilled,(state,action)=>{
        state.loading = false;
        state.bookdetails = action.payload;
      })
      .addCase(getMyBooks.pending,(state)=>{
        state.loading = true;
        state.error = null
      })
      .addCase(getMyBooks.fulfilled,(state,action)=>{
        state.loading = false;
        state.mybooks = action.payload;
      })

      .addCase(userProfile.pending,(state)=>{
        state.loading = true;
        state.error = null;
      })
      .addCase(userProfile.fulfilled,(state,action)=>{
        state.loading = false;
        state.user_profile = action.payload;
      })
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

