import { createSlice } from "@reduxjs/toolkit";
import { loginEmployee,currentLoggedInEmployee } from "./authAction";


const authSlice = createSlice({
    name:"auth",
    initialState:{
        employee:null,
        isLoading:false,
        error:null
    },

    reducers:{
        addEmployee(state,action){
            state.employee = action.payload
            state.isLoading = false
        },
        removeEmployee(state){
            state.employee = null
            state.isLoading = false
        }
        

    },

    extraReducers: (builder)=>{
        builder
        .addCase(loginEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(loginEmployee.fulfilled,(state,action)=>{
            state.employee = action.payload
            state.isLoading = false
        })
        .addCase(loginEmployee.rejected,(state)=>{
            state.isLoading = false
        })
        .addCase(currentLoggedInEmployee.pending,(state)=>{
            state.isLoading = true
        })
        .addCase(currentLoggedInEmployee.fulfilled,(state,action)=>{
            state.employee = action.payload
            state.isLoading = false
        })
        .addCase(currentLoggedInEmployee.rejected,(state)=>{
            state.isLoading = false
        })

    }


})

export const {addEmployee,removeEmployee} = authSlice.actions;

export default authSlice.reducer;