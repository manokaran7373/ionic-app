
const config = {
  appId: 'io.ionic.starter',
  appName: 'geofencing',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      permissions: true
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      serverClientId: '618970500177-4ndf92sk3pck1t8hn0541nljbb6hj8ni.apps.googleusercontent.com',
      forceCodeForRefreshToken: true
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;

