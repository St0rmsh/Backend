import { useDispatch } from "react-redux";
import { setUser,setLoading,setError } from "../authSlice";
import { loginUser,registerUser,getMe,logoutUser,verifyOTP } from "../services/api.service";



export const useAuth = ()=>{

    const dispatch = useDispatch();


   const handleRegister = async ({username,email,password})=>{
    try {
        dispatch(setLoading(true));
        const response = await registerUser({username,email,password});

        return response;
    } catch (error) {
        dispatch(setError(error.response?.data?.message || "Registration failed"));
        throw error;
    } finally{
        dispatch(setLoading(false));
    }
}

    const handleLogin = async ({username,password})=>{
        try {
            dispatch(setLoading(true));
            const response = await loginUser({username,password});
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally{
            dispatch(setLoading(false));
        }
    }

    const handleLogout = async ()=>{
        try {
            dispatch(setLoading(true));
            const response = await logoutUser();
            dispatch(setUser(null));
            return response;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally{
            dispatch(setLoading(false));
        }
    }

    const handleGetMe = async ()=>{
        try {
            dispatch(setLoading(true));
            const response = await getMe();
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally{
            dispatch(setLoading(false));
        }
    }

    const handleVerifyOTP = async ({email,otp})=>{
        try {
            dispatch(setLoading(true));
            const response = await verifyOTP({email,otp});
            dispatch(setUser(response.user));
            return response;
        } catch (error) {
            dispatch(setError(error));
            throw error;
        } finally{
            dispatch(setLoading(false));
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleLogout,
        handleGetMe,
        handleVerifyOTP
    }
}