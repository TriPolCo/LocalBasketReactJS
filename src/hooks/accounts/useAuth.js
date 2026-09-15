import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tokenStorage } from "../../utils/tokenStorage";

export default function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => tokenStorage.getUser());

  const loginSession = ({ tokens, user: userData }) => {
    tokenStorage.setAuthSession({ tokens, user: userData });
    setUser(userData);
  };

  const logout = () => {
    tokenStorage.clearAuthSession();
    setUser(null);
    navigate("/login", { replace: true });
  };

  return {
    user,
    isAuthenticated: Boolean(tokenStorage.getAccessToken()),
    loginSession,
    logout,
  };
}