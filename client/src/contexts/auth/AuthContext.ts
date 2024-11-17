// src/contexts/AuthContext.ts

import { createContext } from "react";
import { CredentialsType } from "../../hooks/useAuth";

export interface AuthContextType {
  accessToken: string | null;
  login: (credentials: CredentialsType) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  // Add other properties and methods as needed
}

// Create the context object
const AuthContext = createContext<AuthContextType | null>(null);

// Export the context object as default
export default AuthContext;
