import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { AuthProvider, useAuth } from "./components/AuthContext";
import { RouteProps, RouteComponentProps } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/tabs/Dashboard';
import SatelliteRequest from './pages/Core/SatelliteRequest';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
  const { isAuthenticated  } = useAuth();

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Public Routes */}
          <Route exact path="/welcome" component={Welcome} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          
          {/* Protected Routes */}
          <Route exact path="/dashboard" component={Dashboard} />
          {/* <Route exact path="/process-image" component={ProcessImage}/> */}
          <Route exact path="/dashboard/image-request" component={SatelliteRequest}/>
          
          {/* Default Route */}
          <Route exact path="/">
            {isAuthenticated  ? <Redirect to="/dashboard" /> : <Redirect to="/welcome" />}
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
