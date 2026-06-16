import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { fetchCurrentUserThunk } from "../state/authThunk";
import { selectAuthIsAuthenticated } from "../state/authSelectors";
import { getAccessToken } from "../utils/cookies";

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
