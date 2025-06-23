import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/react';

export const initializeGoogleAuth = () => {
  if (!isPlatform('capacitor')) {
    GoogleAuth.initialize({
      clientId: '618970500177-ng57ei60bbmddfedf6opc1bf7sds4l0d.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      grantOfflineAccess: true,
    });
  }
};
