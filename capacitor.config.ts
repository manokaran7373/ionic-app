
const config={
  appId: 'io.ionic.starter',
  appName: 'geofencing',
  webDir: 'dist',
  plugins: {
    Geolocation: {
      permissions: true
    }
  },
  server: {
    androidScheme: 'https'
  }
};

export default config;

