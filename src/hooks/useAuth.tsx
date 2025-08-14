import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const storedAuth = localStorage.getItem("namodayaTraders_isAuthenticated");
    const storedUser = localStorage.getItem("namodayaTraders_user");
    
    if (storedAuth === "true" && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const login = () => {
    const storedUser = localStorage.getItem("namodayaTraders_user");
    setIsAuthenticated(true);
    setUser(storedUser);
  };

  const logout = () => {
    localStorage.removeItem("namodayaTraders_isAuthenticated");
    localStorage.removeItem("namodayaTraders_user");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};