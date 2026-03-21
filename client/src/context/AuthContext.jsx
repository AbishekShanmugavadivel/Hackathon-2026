import { createContext, useContext, useReducer, useEffect } from "react";
import toast from "react-hot-toast";

// ✅ Named export (FIXED)
export const AuthContext = createContext();

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };

    default:
      return state;
  }
};

// Provider
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔐 Login
  const login = async (credentials) => {
    try {
      dispatch({ type: "LOGIN_START" });

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.data.token);

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: data.data.admin,
          token: data.data.token,
        },
      });

      toast.success("Login successful!");
      return data;
    } catch (error) {
      dispatch({ type: "LOGIN_FAILURE" });
      toast.error(error.message || "Login failed");
      throw error;
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    toast.success("Logged out successfully");
  };

  // 👤 Load user
  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        dispatch({
          type: "LOAD_USER",
          payload: data.data,
        });
      } else {
        localStorage.removeItem("token");
        dispatch({ type: "LOGOUT" });
      }
    } catch (error) {
      console.error("Error loading user:", error);
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
    }
  };

  // Load on start
  useEffect(() => {
    loadUser();
  }, []);

  const value = {
    ...state,
    login,
    logout,
    loadUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};