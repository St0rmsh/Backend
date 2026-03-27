import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name:"auth",
  initialState:{
    user:null,
    isAuthenticated:false,
    loading:false,
    error:null,
  },
  reducers:{
   setUser:(state,action)=> {
    state.user=action.payload;
    state.isAuthenticated=true;
   },
   setLoading:(state,action)=> {
    state.loading=action.payload;
   },
   setError:(state,action)=> {
    state.error=action.payload;
   }
  }
})

export const {setUser,setLoading,setError}=authSlice.actions;
export default authSlice.reducer
    