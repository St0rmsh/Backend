import { registerUser, loginUser, completeProfile, forgotPassword, resetPassword } from "../services/api.service";
import { setUser, setLoading, setError } from "../state/auth.slice";
import { useDispatch, useSelector } from "react-redux";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleRegister = async ({ fullname, email, password, contact, role }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await registerUser({ fullname, email, password, contact, role });
            dispatch(setUser(data.user));
            return { success: true };
        } catch (err) {
            dispatch(setError(err.message));
            return { success: false, error: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleLogin = async ({ email, password }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await loginUser({ email, password });
            dispatch(setUser(data.user));
            return { success: true };
        } catch (err) {
            dispatch(setError(err.message));
            return { success: false, error: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCompleteProfile = async ({ contact, role }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await completeProfile({ contact, role });
            dispatch(setUser(data.user));
            return { success: true };
        } catch (err) {
            dispatch(setError(err.message));
            return { success: false, error: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };


    const handleForgotPassword = async (email) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await forgotPassword(email);
            return { success: true, message: data.message };
        } catch (err) {
            dispatch(setError(err.message));
            return { success: false, error: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleResetPassword = async (token, password) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await resetPassword(token, password);
            dispatch(setUser(data.user));
            return { success: true };
        } catch (err) {
            dispatch(setError(err.message));
            return { success: false, error: err.message };
        } finally {
            dispatch(setLoading(false));
        }
    };


    const clearError = () => dispatch(setError(null));

    return { handleRegister, handleLogin, handleCompleteProfile, handleForgotPassword, handleResetPassword, clearError, user, loading, error };
};