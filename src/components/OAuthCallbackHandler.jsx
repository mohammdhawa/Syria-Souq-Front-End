import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuthStatus, fetchProfile } from '../redux/actions/authActions';
import authService from '../services/authService';

const OAuthCallbackHandler = () => {
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        console.log('🔍 OAuth Callback Handler - Starting...');
        console.log('📍 Current URL:', window.location.href);
        console.log('📍 Search params:', location.search);
        
        const urlParams = new URLSearchParams(location.search);
        const authSuccess = urlParams.get('auth_success');
        const authError = urlParams.get('auth_error');

        console.log('🔍 Auth Success:', authSuccess);
        console.log('🔍 Auth Error:', authError);

        if (authSuccess) {
          console.log('✅ OAuth Success detected, processing...');
          setStatus('success');
          
          // Check for auth_token parameter (new token-based flow)
          const authToken = urlParams.get('auth_token');
          console.log('🔍 Auth token parameter:', authToken);
          
          if (authToken) {
            console.log('🔍 Using new token-based authentication...');
            try {
              const result = await authService.handleGoogleCallback(authToken);
              console.log('✅ Token authentication successful:', result);
              
              // Update Redux state
              await dispatch(checkAuthStatus());
              await dispatch(fetchProfile());
              
              // Clear URL parameters and redirect to dashboard
              console.log('🔄 Redirecting to dashboard...');
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('/dashboard', { replace: true });
            } catch (tokenErr) {
              console.error('❌ Token authentication failed:', tokenErr);
              setStatus('error');
              setError('Authentication failed. Please try again.');
            }
          } else {
            console.log('🔍 No token found, using legacy cookie-based flow...');
            
            // Wait a moment for backend to process the OAuth
            console.log('⏳ Waiting for backend to process OAuth...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if user is now authenticated
            console.log('🔍 Checking authentication status...');
            const isAuthenticated = await authService.checkAuthAfterCallback();
            console.log('🔍 Authentication result:', isAuthenticated);
            
            if (isAuthenticated) {
              console.log('✅ User is authenticated, updating Redux state...');
              // Dispatch auth actions to update Redux state
              await dispatch(checkAuthStatus());
              await dispatch(fetchProfile());
              
              // Clear URL parameters and redirect to dashboard
              console.log('🔄 Redirecting to dashboard...');
              window.history.replaceState({}, document.title, window.location.pathname);
              navigate('/dashboard', { replace: true });
            } else {
              console.log('❌ Authentication check failed');
              console.log('🔍 Trying to check auth status through Redux...');
              
              // Try alternative method
              try {
                const authResult = await dispatch(checkAuthStatus());
                console.log('🔍 Redux auth check result:', authResult);
                
                if (authResult && authResult.payload) {
                  console.log('✅ Redux auth successful, fetching profile...');
                  await dispatch(fetchProfile());
                  navigate('/dashboard', { replace: true });
                } else {
                  console.log('❌ Redux auth also failed');
                  setStatus('error');
                  setError('Authentication failed. Please try again.');
                }
              } catch (reduxErr) {
                console.error('❌ Redux auth check failed:', reduxErr);
                setStatus('error');
                setError('Authentication failed. Please try again.');
              }
            }
          }
        } else if (authError) {
          console.log('❌ OAuth Error detected:', authError);
          setStatus('error');
          
          // Handle specific error codes
          let errorMessage = 'Authentication failed. Please try again.';
          
          switch (authError) {
            case 'invalid_data':
              errorMessage = 'Invalid user data from Google. Please try again.';
              break;
            case 'invalid_state':
              errorMessage = 'Invalid authentication state. Please try again.';
              break;
            case 'true':
              errorMessage = 'Authentication failed. Please try again.';
              break;
            default:
              errorMessage = authError;
          }
          
          setError(errorMessage);
        } else {
          console.log('ℹ️ No OAuth parameters found, redirecting to login');
          // No OAuth parameters, redirect to login
          navigate('/auth/login', { replace: true });
        }
      } catch (err) {
        console.error('❌ OAuth callback error:', err);
        setStatus('error');
        setError('Authentication failed. Please try again.');
      }
    };

    handleOAuthCallback();
  }, [location.search, dispatch, navigate]);

  if (status === 'processing') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ marginBottom: '20px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <div>Processing Google authentication...</div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh'
      }}>
        <div style={{ color: 'green', fontSize: '24px', marginBottom: '20px' }}>
          ✅ Authentication successful!
        </div>
        <div>Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '50vh'
    }}>
      <div style={{ color: 'red', fontSize: '24px', marginBottom: '20px' }}>
        ❌ Authentication failed
      </div>
      <div style={{ marginBottom: '20px' }}>Error: {error}</div>
      <button 
        className="btn btn-primary"
        onClick={() => navigate('/auth/login', { replace: true })}
      >
        Try Again
      </button>
    </div>
  );
};

export default OAuthCallbackHandler;
