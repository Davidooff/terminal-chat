import { useState, useEffect, useCallback } from "react";

export interface CredentialsType {
  username: string;
  password: string;
}

function useAuth() {
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [refreshToken, setRefreshToken] = useState<null | string>(null);

  // Methods to login, logout, and refresh tokens will be added here.

  const login = useCallback(
    async (credentials: { login: string; password: string }) => {
      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const data = await response.json();
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response) {
        setAccessToken(null);
        setRefreshToken(null);
      } else {
        throw new Error("Response is not walid");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
    // Optionally, notify the server.
  }, []);

  const refreshAccessToken = useCallback(async () => {
    try {
      const response = await fetch("/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });
      const data = await response.json();
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  }, [refreshToken, logout]);

  useEffect(() => {
    if (!accessToken) return;

    const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
    const expiresIn = tokenPayload.exp * 1000 - Date.now() - 60000; // Refresh 1 minute before expiry

    const timeoutId = setTimeout(refreshAccessToken, expiresIn);

    return () => clearTimeout(timeoutId);
  }, [accessToken, refreshAccessToken]);

  return {
    accessToken,
    login,
    logout,
  };
}

export default useAuth;
