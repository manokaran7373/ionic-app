

import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { isPlatform } from '@ionic/react';

const WEB_CLIENT_ID = '618970500177-4ndf92sk3pck1t8hn0541nljbb6hj8ni.apps.googleusercontent.com';
const ANDROID_CLIENT_ID = '618970500177-ng57ei60bbmddfedf6opc1bf7sds4l0d.apps.googleusercontent.com';

export const initializeGoogleAuth = () => {
    GoogleAuth.initialize({
        clientId: isPlatform('android') ? ANDROID_CLIENT_ID : WEB_CLIENT_ID,
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
    });
};
