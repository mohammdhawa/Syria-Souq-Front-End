import React from 'react';
import { useLocation } from 'react-router-dom';
import HomePage2 from '../pages/home';
import OAuthCallbackHandler from './OAuthCallbackHandler';

const HomePageWrapper = () => {
  const location = useLocation();
  console.log('🔍 HomePageWrapper: Current location:', location);
  console.log('🔍 HomePageWrapper: Search params:', location.search);
  
  const urlParams = new URLSearchParams(location.search);
  const authSuccess = urlParams.get('auth_success');
  const authError = urlParams.get('auth_error');

  console.log('🔍 HomePageWrapper: auth Success:', authSuccess);
  console.log('🔍 HomePageWrapper: auth Error:', authError);

  // If there are OAuth parameters, show the callback handler
  if (authSuccess || authError) {
    console.log('🔍 HomePageWrapper: OAuth parameters detected, showing OAuthCallbackHandler');
    return <OAuthCallbackHandler />;
  }

  console.log('🔍 HomePageWrapper: No OAuth parameters, showing HomePage2');
  // Otherwise, show the normal home page
  return <HomePage2 />;
};

export default HomePageWrapper;
