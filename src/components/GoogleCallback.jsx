import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { checkAuthStatus, fetchProfile } from '../redux/actions/authActions';

const GoogleCallback = () => {
  const { handleGoogleCallback } = useGoogleAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Extract data from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const authSuccess = urlParams.get('auth_success');
        const authError = urlParams.get('auth_error');

        if (authSuccess) {
          // Success case - user was redirected from Google OAuth
          setStatus('success');
          
          // Check authentication status and fetch user profile
          try {
            await dispatch(checkAuthStatus());
            await dispatch(fetchProfile());
            
            // Redirect to dashboard
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          } catch (authErr) {
            console.error('Error checking auth status:', authErr);
            setStatus('error');
            setError('Authentication verification failed');
          }
        } else if (authError) {
          // Error case
          setStatus('error');
          setError(authError);
        } else {
          // No auth parameters - redirect to login
          navigate('/auth/login', { replace: true });
        }
      } catch (err) {
        setStatus('error');
        setError(err.message);
      }
    };

    handleCallback();
  }, [handleGoogleCallback, dispatch, navigate]);

  if (status === 'processing') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div>Processing Google authentication...</div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div style={{ color: 'green' }}>✅ Authentication successful!</div>
        <div>Redirecting to dashboard...</div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <div style={{ color: 'red' }}>❌ Authentication failed</div>
      <div>Error: {error}</div>
      <button onClick={() => window.location.href = '/auth/login'}>
        Try Again
      </button>
    </div>
  );
};

export default GoogleCallback;
