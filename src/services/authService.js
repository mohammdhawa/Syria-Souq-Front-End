const API_BASE_URL = "http://localhost:8000/api";

class AuthService {
  // Get Google OAuth redirect URL from backend
  async getGoogleAuthUrl() {
    try {
      console.log('🔍 Getting Google OAuth URL from:', `${API_BASE_URL}/auth/google`);
      console.log('🔍 Request headers:', {
        'Accept': 'application/json',
      });

      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('🔍 Google OAuth URL response status:', response.status);
      console.log('🔍 Google OAuth URL response headers:', response.headers);

      const data = await response.json();
      console.log('🔍 Google OAuth URL response data:', data);

      if (!response.ok) {
        console.error('❌ Google OAuth URL request failed:', response.status, data);
        throw new Error(data.error || 'Failed to get Google auth URL');
      }

      console.log('✅ Google OAuth URL obtained:', data.url);
      return data.url;
    } catch (error) {
      console.error('❌ Error getting Google auth URL:', error);
      throw error;
    }
  }

  // Handle Google OAuth callback with auth_token
  async handleGoogleCallback(authToken) {
    try {
      console.log('🔍 Handling Google OAuth callback with auth_token:', authToken);

      const response = await fetch(`${API_BASE_URL}/auth/google/result?token=${encodeURIComponent(authToken)}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('🔍 Token result response status:', response.status);
      const data = await response.json();
      console.log('🔍 Token result response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Token authentication failed');
      }

      if (data.success) {
        // Store tokens
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
        }
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        console.log('✅ Tokens stored successfully');
        return data;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('❌ Error handling Google callback:', error);
      throw error;
    }
  }

  // Check authentication status after OAuth callback
  async checkAuthAfterCallback() {
    try {
      console.log('🔍 AuthService: Checking auth status...');
      console.log('🔍 API URL:', `${API_BASE_URL}/check-auth`);

      const response = await fetch(`${API_BASE_URL}/check-auth`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      console.log('🔍 Response status:', response.status);
      console.log('🔍 Response headers:', response.headers);

      const data = await response.json();
      console.log('🔍 Response data:', data);

      return data.authenticated;
    } catch (error) {
      console.error('❌ Error checking auth status:', error);
      return false;
    }
  }

  // Handle Google OAuth callback (for direct API testing)
  async socialiteAuth(googleData) {
    try {
      const response = await fetch(`${API_BASE_URL}/socialite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          google_id: googleData.id,
          email: googleData.email,
          name: googleData.name,
          image: googleData.picture,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Google authentication failed');
      }

      // Store tokens in localStorage or secure storage
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      return data;
    } catch (error) {
      console.error('Error in socialite auth:', error);
      throw error;
    }
  }

  // Mobile Google auth (for mobile apps)
  async mobileGoogleAuth(idToken) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/mobile-google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id_token: idToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mobile Google authentication failed');
      }

      // Store tokens
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
      }

      return data;
    } catch (error) {
      console.error('Error in mobile Google auth:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }

  // Get stored access token
  getAccessToken() {
    return localStorage.getItem('access_token');
  }

  // Logout user
  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }
  // Refresh access token
  async refreshToken() {
    try {
      console.log('🔍 AuthService: Refreshing token via cookie...');

      // We rely on the httpOnly cookie 'refresh_token' being present.
      // We do NOT send it in the headers.

      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
      });

      console.log('🔍 Refresh token response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      if (data.access_token) {
        // Backend returns new tokens in body AND sets cookies.
        // We update localStorage to keep our interceptors happy.
        localStorage.setItem('access_token', data.access_token);

        if (data.refresh_token) {
          // Ensure explicit localStorage sync if backend sends it back, 
          // though the cookie is the primary source for the next refresh.
          localStorage.setItem('refresh_token', data.refresh_token);
        }

        console.log('✅ Token refreshed successfully');
        return data.access_token;
      } else {
        throw new Error('No access token in refresh response');
      }
    } catch (error) {
      console.error('❌ Error refreshing token:', error);
      // Clean up tokens on refresh failure
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();
