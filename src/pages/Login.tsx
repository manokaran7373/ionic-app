import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonInput,
    IonButton,
    IonIcon,
    IonLabel,
    IonCheckbox,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
} from '@ionic/react';
import {
    mailOutline,
    lockClosedOutline,
    eyeOutline,
    eyeOffOutline,
    arrowForwardOutline
} from 'ionicons/icons';
import { FcGoogle } from 'react-icons/fc';
import { useAuth } from '../components/AuthContext';
import AlertMessage from '../components/AlertMessage';
import { API_BASE_URL, API_ENDPOINTS } from '../components/config/constants';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useIonRouter } from '@ionic/react';
import { initializeGoogleAuth } from '../components/config/googleAuth';


const Login: React.FC = () => {
    const { setAccessToken } = useAuth();
    const router = useIonRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
        general?: string;
    }>({});
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error';
    }>({ show: false, message: '', type: 'success' });


    useEffect(() => {
        initializeGoogleAuth();
    }, []);

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.message || 'Login failed');

            await setAccessToken(data.accessToken);
            setAlert({
                show: true,
                message: 'Login successful!',
                type: 'success',
            });
        } catch (error: any) {
            setErrors({ general: error.message });
            setAlert({
                show: true,
                message: error.message,
                type: 'error',
            });
        }
    };

const handleGoogleLogin = async () => {
  try {
    // Get Google user data
    const googleUser = await GoogleAuth.signIn();
    
    // Extract the ID token
    const googleToken = googleUser.authentication.idToken;
    
    // Send to your backend
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        google_token: googleToken,

      })
    });

    const data = await response.json();

    if (response.ok) {
      // Store the access token from your backend
      await setAccessToken(data.accessToken);
      
      setAlert({
        show: true,
        message: 'Google Login successful!',
        type: 'success'
      });

      router.push('/dashboard');
    } else {
      throw new Error(data.message);
    }
  } catch (error: any) {
    setAlert({
      show: true,
      message: error.message || 'Google login failed',
      type: 'error'
    });
  }
};




    // Font styles object
    const fontStyles = {
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
    };

    return (
        <IonPage>
            <IonContent fullscreen style={fontStyles}>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-poppins relative overflow-hidden">
                    <IonGrid className="h-full">
                        <IonRow className="h-full ion-justify-content-center ion-align-items-center">
                            <IonCol size="12" sizeMd="6" sizeLg="4" className="ion-padding">
                                <div className="w-full max-w-md mx-auto">
                                    {/* Logo/Brand Section */}
                                    <div className="text-center mb-8">
                                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                                            <IonIcon
                                                icon={lockClosedOutline}
                                                className="text-white text-3xl"
                                            />
                                        </div>
                                        <h1 className="text-4xl font-bold text-white mb-2">
                                            Welcome Back
                                        </h1>
                                        <p className="text-slate-400 text-lg">
                                            Sign in to your account
                                        </p>
                                    </div>

                                    {/* Login Form */}
                                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 mb-6">
                                        <form onSubmit={handleLogin} className="space-y-6">
                                            {/* Email Input */}
                                            <div className="space-y-2">
                                                <IonLabel className="text-slate-300 font-medium text-sm block ml-1">
                                                    Email Address
                                                </IonLabel>
                                                <div className="relative">
                                                    <IonIcon
                                                        icon={mailOutline}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10"
                                                    />
                                                    <IonInput
                                                        type="email"
                                                        value={email}
                                                        onIonInput={(e) => setEmail(e.detail.value!)}
                                                        placeholder="Enter your email"
                                                        className="custom-input"
                                                        fill="outline"
                                                        style={{
                                                            '--background': 'rgba(255, 255, 255, 0.05)',
                                                            '--border-color': 'rgba(255, 255, 255, 0.1)',
                                                            '--border-radius': '12px',
                                                            '--padding-start': '48px',
                                                            '--padding-end': '16px',
                                                            '--color': 'white',
                                                            '--placeholder-color': 'rgba(148, 163, 184, 0.7)',
                                                        }}
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <div className="text-red-500 text-sm mt-1">{errors.email}</div>
                                                )}
                                            </div>

                                            {/* Password Input */}
                                            <div className="space-y-2">
                                                <IonLabel className="text-slate-300 font-medium text-sm block ml-1">
                                                    Password
                                                </IonLabel>
                                                <div className="relative">
                                                    <IonIcon
                                                        icon={lockClosedOutline}
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 z-10"
                                                    />
                                                    <IonInput
                                                        type={showPassword ? "text" : "password"}
                                                        value={password}
                                                        onIonInput={(e) => setPassword(e.detail.value!)}
                                                        placeholder="Enter your password"
                                                        className="custom-input"
                                                        fill="outline"
                                                        style={{
                                                            '--background': 'rgba(255, 255, 255, 0.05)',
                                                            '--border-color': 'rgba(255, 255, 255, 0.1)',
                                                            '--border-radius': '12px',
                                                            '--padding-start': '48px',
                                                            '--padding-end': '48px',
                                                            '--color': 'white',
                                                            '--placeholder-color': 'rgba(148, 163, 184, 0.7)',
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                                    >
                                                        <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                                                    </button>
                                                    {errors.password && (
                                                        <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Remember Me & Forgot Password */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <IonCheckbox
                                                        checked={rememberMe}
                                                        onIonChange={(e) => setRememberMe(e.detail.checked)}
                                                        className="text-blue-500"
                                                    />
                                                    <IonLabel className="text-slate-300 text-sm">
                                                        Remember me
                                                    </IonLabel>
                                                </div>
                                                <IonButton
                                                    fill="clear"
                                                    size="small"
                                                    className="text-blue-400 hover:text-blue-300"
                                                >
                                                    Forgot Password?
                                                </IonButton>
                                            </div>


                                            {/* Login Button */}
                                            <IonButton
                                                expand="block"
                                                type="submit"
                                                className="login-button h-14 font-semibold text-lg"
                                                style={{
                                                    '--background': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    '--background-hover': 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                                                    '--border-radius': '12px',
                                                    '--box-shadow': '0 10px 25px rgba(102, 126, 234, 0.3)',
                                                }}
                                            >
                                                Sign In
                                                <IonIcon icon={arrowForwardOutline} slot="end" />
                                            </IonButton>

                                            {/* Divider */}
                                            <div className="relative my-8">
                                                <div className="absolute inset-0 flex items-center">
                                                    <div className="w-full border-t border-slate-600"></div>
                                                </div>
                                                <div className="relative flex justify-center">
                                                    <span className="px-4 text-sm text-slate-400 bg-slate-900/50 backdrop-blur-sm rounded-full">
                                                        Or continue with
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Google Login */}
                                            <IonButton
                                                expand="block"
                                                fill="outline"
                                                className="google-button h-14 font-medium"
                                                onClick={handleGoogleLogin}
                                                style={{
                                                    '--background': 'rgba(255, 255, 255, 0.05)',
                                                    '--border-color': 'rgba(255, 255, 255, 0.1)',
                                                    '--border-radius': '12px',
                                                    '--color': 'white',
                                                }}
                                            >
                                                <FcGoogle className="mr-3" size={24} />
                                                Continue with Google
                                            </IonButton>
                                        </form>
                                    </div>

                                    {/* Sign Up Link */}
                                    <div className="text-center">
                                        <IonText className="text-slate-400">
                                            Don't have an account?{' '}
                                            <IonButton
                                                fill="clear"
                                                size="small"
                                                className="text-blue-400 hover:text-blue-300 font-semibold"
                                            >
                                                Create Account
                                            </IonButton>
                                        </IonText>
                                    </div>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                    <AlertMessage
                        isOpen={alert.show}
                        message={alert.message}
                        type={alert.type}
                        onDidDismiss={() => setAlert({ ...alert, show: false })}
                    />

                </div>
            </IonContent>
        </IonPage>
    );
};

export default Login;

