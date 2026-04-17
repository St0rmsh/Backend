import {createSlice } from "@reduxjs/toolkit";

const initialState = {
    products: [],
    product: null,
    loading: false,
    error: null
}

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setProducts:(state,action)=>{
            state.products = action.payload;
        },
        setProduct:(state,action)=>{
            state.product = action.payload;
        },
        removeProduct: (state, action) => {
            state.products = state.products.filter(p => p._id !== action.payload);
        },
        updateProductState: (state, action) => {
            const index = state.products.findIndex(p => p._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
            if (state.product && state.product._id === action.payload._id) {
                state.product = action.payload;
            }
        },
        setLoading:(state,action)=>{
            state.loading = action.payload;
        },
        setError:(state,action)=>{
            state.error = action.payload;
        }
    }
})

export const {setProducts,setProduct,removeProduct,updateProductState,setLoading,setError} = productSlice.actions;

export default productSlice.reducer;