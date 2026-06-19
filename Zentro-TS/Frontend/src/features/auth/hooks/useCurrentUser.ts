import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchCurrentUserThunk } from "../state/authThunks";
import { selectAuthIsAuthenticated } from "../state/authSelectors";
import { getAccessToken } from "@/shared/lib/cookies";

export const useCurrentUser = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectAuthIsAuthenticated);
  const initialized = useRef(false);

  useEffect(() => {
    // Only fetch if we have a token but aren't authenticated yet
    // Or on initial load to verify session
    if (!initialized.current && getAccessToken()) {
      dispatch(fetchCurrentUserThunk());
      initialized.current = true;
    }
  }, [dispatch]);

  return { isAuthenticated };
};
