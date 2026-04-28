import { useState, useEffect } from 'react';
import authService from '../services/authService';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for authentication status on mount
    if (authService.isAuthenticated()) {
      // You might want to validate the token here
      // or fetch user data from your API
    }
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get Google OAuth URL from backend
      const authUrl = await authService.getGoogleAuthUrl();
      
      // Redirect to Google OAuth
      window.location.href = authUrl;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleGoogleCallback = async (authToken) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.handleGoogleCallback(authToken);
      setUser(result.user);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const handleGoogleCallbackLegacy = async (googleData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authService.socialiteAuth(googleData);
      setUser(result.user);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return {
    user,
    isLoading,
    error,
    handleGoogleLogin,
    handleGoogleCallback,
    handleGoogleCallbackLegacy,
    logout,
    isAuthenticated: authService.isAuthenticated(),
  };
};
