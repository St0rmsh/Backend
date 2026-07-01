import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useProfile = () => {
  const { currentUser, loading, error } = useSelector((state: RootState) => state.user);

  return {
    profile: currentUser,
    loading,
    error,
  };
};
