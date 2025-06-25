

// import { GoogleLogin } from '@react-oauth/google';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const GOOGLE_CREDENTIALS = {
//     WEB_CLIENT_ID : '618970500177-4ndf92sk3pck1t8hn0541nljbb6hj8ni.apps.googleusercontent.com',
//     ANDROID_CLIENT_ID : '618970500177-ng57ei60bbmddfedf6opc1bf7sds4l0d.apps.googleusercontent.com'
// };

// export { GOOGLE_CREDENTIALS, GoogleLogin, GoogleOAuthProvider };


import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

export const initializeGoogleAuth = () => {
  GoogleAuth.initialize({
    clientId: '618970500177-4ndf92sk3pck1t8hn0541nljbb6hj8ni.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    grantOfflineAccess: true,
  });
};

export const signInWithGoogle = async () => {
  const user = await GoogleAuth.signIn();
  return user;
};
