import React, { createContext, useContext, useState } from "react";

// Create the Auth context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Example state: user and loading
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // Example login/logout functions
  const login = (userData) => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setUser(userData);
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export function useAuth() {
  return useContext(AuthContext);
} 