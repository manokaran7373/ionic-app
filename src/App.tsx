import { useEffect, useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from "./components/AuthContext";
import { RouteProps, RouteComponentProps } from 'react-router-dom';
import Welcome from './pages/Welcome';
import RestartLoaderScreen from './pages/RestartLoaderScreen';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/tabs/Dashboard';
import SatelliteRequest from './pages/Core/SatelliteRequest';
import Profile from './pages/tabs/Settings';
import HelpScreen from './pages/tabs/Help';
import FeedbackScreen from './pages/tabs/Feedback';
import PaymentHistoryScreen from './pages/tabs/Subscriptions';
import ProcessScreen from './pages/tabs/ProcessImage';
import SatelliteMapView from './pages/tabs/SatelliteMap';
import LandCalculatorScreen from './pages/Core/LandCalculator';
import LandMeasurementScreen from './pages/Core/LandMeasurementScreen';
import ForgotPasswordScreen from './pages/ForgotPasswordScreen';
import { Preferences } from '@capacitor/preferences';
interface PrivateRouteProps extends Omit<RouteProps, 'component'> {
  component: React.ComponentType<RouteComponentProps>;
}

// Import CSS files
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const { isAuthenticated } = useAuth();
    
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, initializeAuth } = useAuth();
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check if it's first launch
        const { value: hasLaunched } = await Preferences.get({ key: 'hasLaunched' });
        setIsFirstLaunch(!hasLaunched);
        
        if (!hasLaunched) {
          await Preferences.set({ key: 'hasLaunched', value: 'true' });
        }

        // Initialize auth state
        await initializeAuth();
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking app state:', error);
        setIsLoading(false);
      }
    };

    checkAppState();
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }


  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Public Routes */}
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/restart" component={RestartLoaderScreen}/>
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/forgot-password" component={ForgotPasswordScreen}/>
          
          {/* Protected Routes */}
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/dashboard/image-request" component={SatelliteRequest}/>
          <Route exact path="/dashboard/land-calculator" component={LandCalculatorScreen}/>
          <Route exact path="/dashboard/land-measurement" component={LandMeasurementScreen}/>
          <Route exact path="/settings" component={Profile}/>
          <Route exact path="/help" component={HelpScreen}/>
          <Route exact path="/feedback" component={FeedbackScreen}/>
          <Route exact path="/subscriptions" component={(PaymentHistoryScreen)}/>
          <Route exact path="/process-image" component={ProcessScreen}/>
          <Route exact path="/satellite-map" component={SatelliteMapView}/>

          
          
            {/* Default Route */}
          <Route exact path="/">
            {isFirstLaunch ? (
              <Redirect to="/welcome" />
            ) : isAuthenticated ? (
              <Redirect to="/restart" />
            ) : (
              <Redirect to="/login" />
            )}
          </Route>

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

const App: React.FC = () => {
    return (
            <AuthProvider>
                <AppContent />
            </AuthProvider>
    );
};

export default App;
