
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
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");

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

  const login = async (data) => {
    const response = await loginUser(data);

    const { token: newToken, user: loggedUser } = response;

    if (!newToken || !loggedUser) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    setToken(newToken);
    setUser(loggedUser);

    return response;
  };

  const register = async (data) => {
    return await registerUser(data);
  };

  const getSingleUser = async (userId) => {
    const response = await getCurrentUser(userId);
    const currentUser = response.user;

    localStorage.setItem("user", JSON.stringify(currentUser));
    setUser(currentUser);

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);
  };

  const restoreSession = async () => {
    if (!token || !user) {
      setLoading(false);
      return;
    }

    const userId = user._id || user.id;

    if (!userId) {
      logout();
      setLoading(false);
      return;
    }

    try {
      await getSingleUser(userId);
    } catch (error) {
      console.error("Session restore failed:", error);

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
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
