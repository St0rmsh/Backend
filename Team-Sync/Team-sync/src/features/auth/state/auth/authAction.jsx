import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiInstance } from "../../../../config/ApiInstance";

export const loginEmployee = createAsyncThunk(

    "auth/login",
    
    async(credentials,thunkApi) =>{
        try {

            const response = await ApiInstance.post("/auth/login", credentials);
            console.log("Login Response : ",response);
            
            return response.data.data
            
        } catch(error) {
            return thunkApi.rejectWithValue(error)
        }
    }

)


export const currentLoggedInEmployee = createAsyncThunk(
    "auth/me",
    async (_,thunkApi)=>{
        try {
            const response = await ApiInstance.get("/auth/me",
                {
                    withCredentials:true
                }
            );
            console.log("Me Response : ",response);
            return response.data.user;
        } catch (error) {
             return thunkApi.rejectWithValue(
                error.response?.data?.message || error.message
                );
        }
    }
)