import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  loginUser,
  registerUser,
  getCurrentUser,
} from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || "";
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser || savedUser === "undefined") {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(token);

  // =========================
  // Login
  // =========================

  const login = async (data) => {
    const response = await loginUser(data);

    const { token, user } = response;

    if (!token || !user) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    setToken(token);
    setUser(user);

    return response;
  };

  // =========================
  // Register
  // =========================

  const register = async (data) => {
    const response = await registerUser(data);

    return response;
  };

  // =========================
  // Get Current User
  // =========================

  const getSingleUser = async (userId) => {
    const response = await getCurrentUser(userId);
    const currentUser = response.user;
    localStorage.setItem( "user",JSON.stringify(currentUser));

    setUser(currentUser);

    return response;
  };

  // =========================
  // Logout
  // =========================

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
  };

  // =========================
  // Restore Session
  // =========================

  const restoreSession = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      await getSingleUser(user.id || user._id);
    } catch (error) {
      console.log("Session expired" ,error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken("");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        loading,

        login,
        register,
        getSingleUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};