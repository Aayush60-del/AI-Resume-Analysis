import { useCallback, useEffect, useState } from "react";
import { AuthContext } from "./authContextValue";
import { registerUnauthorizedHandler } from "../utils/authSession";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(getStoredUser);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback((tokenData, userData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenData);
    setUser(userData);
  }, []);

  useEffect(() => {
    registerUnauthorizedHandler(() => {
      logout();

      if (!window.location.pathname.startsWith("/login")) {
        window.location.replace("/login");
      }
    });
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: Boolean(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
