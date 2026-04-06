import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiService } from "../services/api";
import { UserRole, ROLE_PERMISSIONS, RolePermissions } from "../types/roles";

interface User {
  fullName: string;
  email: string;
  mobileNumber: string;
  registrationDate: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  hasPermission: (permission: keyof RolePermissions) => boolean;
  getUserRole: () => UserRole | null;
  isRole: (role: UserRole) => boolean;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  mobileNumber: string;
  role?: UserRole;
  accountType?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage for demo)
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("demoUser");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("demoUser");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiService.login(email, password);

      let roleName = response.user.role_name || response.user.role || "tourist";
      if (roleName === "administrator") roleName = "admin";

      const userData: User = {
        fullName: response.user.full_name || response.user.fullName,
        email: response.user.email,
        mobileNumber: response.user.mobile || response.user.mobileNumber,
        registrationDate:
          response.user.created_at ||
          response.user.registrationDate ||
          new Date().toISOString(),
        role: roleName as UserRole,
      };

      setUser(userData);
      localStorage.setItem("demoUser", JSON.stringify(userData));
      return true;
    } catch (error: any) {
      console.error("Login failed:", error);
      // Re-throw so the Login page can display the real backend message
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);

      // Call the real API
      const response = await apiService.register(userData);

      // Map API response to our User type (backend uses snake_case, frontend uses camelCase)
      // Normalize role: backend returns "administrator", frontend uses "admin"
      let roleName = response.user.role_name || response.user.role || "tourist";
      if (roleName === "administrator") {
        roleName = "admin";
      }

      const newUser: User = {
        fullName: response.user.full_name || response.user.fullName,
        email: response.user.email,
        mobileNumber: response.user.mobile || response.user.mobileNumber,
        registrationDate:
          response.user.created_at ||
          response.user.registrationDate ||
          new Date().toISOString(),
        role: roleName as UserRole,
      };

      setUser(newUser);
      localStorage.setItem("demoUser", JSON.stringify(newUser));
      return true;
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Re-throw the error so the component can display it
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("demoUser");
    localStorage.removeItem("authToken");
    apiService.logout().catch(console.error);
  };

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    if (!user || !user.role) return false;
    const rolePermissions = ROLE_PERMISSIONS[user.role];
    if (!rolePermissions) return false;
    return rolePermissions[permission] || false;
  };

  const getUserRole = (): UserRole | null => {
    return user?.role || null;
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    hasPermission,
    getUserRole,
    isRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
