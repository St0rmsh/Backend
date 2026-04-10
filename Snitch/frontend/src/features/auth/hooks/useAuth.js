import { registerUser,loginUser } from "../services/api.service";
import { setUser,setLoading,setError } from "../store/auth.slice";
import { useDispatch } from "react-redux";



export const useAuth = () => {
    const dispatch = useDispatch();

    const register = async ({fullname,email,password,contact}) => {

        dispatch(setLoading(true));
        try {
            const data = await registerUser({fullname,email,password,contact});
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }

    }  

    const login = async ({email,password}) => {

        dispatch(setLoading(true));
        try {
            const data = await loginUser({email,password});
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { register, login };

}