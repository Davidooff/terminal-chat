import React, { ReactNode } from "react";
import useAuth from "../../hooks/useAuth";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const auth = useAuth(); // Contains authentication state and methods

  return (
    // Use AuthContext.Provider to wrap children
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
