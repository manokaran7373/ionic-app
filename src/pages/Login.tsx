import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonIcon,
    IonLabel,
    IonCheckbox,
} from '@ionic/react';
import {
    mailOutline,
    lockClosedOutline,
    eyeOutline,
    eyeOffOutline,
    arrowForwardOutline
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import {useIonRouter } from '@ionic/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import AlertMessage from '../components/AlertMessage';
import { API_BASE_URL, API_ENDPOINTS } from '../components/config/constants';
// import { FcGoogle } from 'react-icons/fc';
// import { initializeGoogleAuth, signInWithGoogle } from '../components/config/googleAuth';


const Login: React.FC = () => {
    const { login, axiosInstance } = useAuth();
    const location = useLocation();

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
    }>({ show: false, message: '' });
    const [googleError, setGoogleError] = useState('');



    useEffect(() => {
        // Reset error messages when the user navigates back to login
        setErrors({});
        setGoogleError('');
        setAlert({ show: false, message: '' });

        // 1. Initialize Google Auth
        // initializeGoogleAuth();

        // 2. Retrieve saved credentials (if any)
        const savedEmail = localStorage.getItem('rememberedEmail');
        const savedPassword = localStorage.getItem('rememberedPassword');

        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true); // Check the checkbox if data exists
        }
    }, [location.pathname]);


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
            const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.LOGIN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.status === 'success') {
                const { access, refresh } = data.data.tokens;
                await login({ access, refresh });

                if (rememberMe) {
                    localStorage.setItem('rememberedEmail', email);
                    localStorage.setItem('rememberedPassword', password);
                } else {
                    localStorage.removeItem('rememberedEmail');
                    localStorage.removeItem('rememberedPassword');
                }

                setAlert({
                    show: true,
                    message: 'Login successful!'
                });

                setTimeout(() => {
                    router.push('/dashboard', 'root', 'replace');
                }, 2000);
            } else {
                setErrors({
                    general: data.message || 'Invalid credentials'
                });
            }
        } catch (error: any) {
            setErrors({
                general: error.response?.data?.message || 'Network error occurred'
            });
        }
    };



    // const handleGoogleLogin = async () => {

    //     try {

    //         const googleUser = await signInWithGoogle();
    //         const googleToken = googleUser.authentication.idToken;

    //         const response = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.LOGIN}`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({
    //                 google_token: googleToken,
    //                 platform: isPlatform('android') ? 'android' : 'web'
    //             })
    //         });

    //         const data = await response.json();
    //         console.log('Server response:', data);

    //         if (data.status === 'success') {
    //             const { access, refresh } = data.data.tokens;

    //             // First store tokens
    //             await login({ access, refresh });

    //             // Show success message
    //             setAlert({
    //                 show: true,
    //                 message: 'Google Login successful!'
    //             });

    //             // Force navigation after a brief delay
    //             setTimeout(() => {
    //                 router.push('/dashboard', 'root', 'replace');
    //             }, 2000);
    //         }
    //     } catch (error: any) {
    //         setGoogleError(error.response?.data?.message || 'Google authentication failed');
    //     }
    // };


    return (
        <IonPage>
            <IonContent fullscreen className="font-inter">
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 md:p-6 lg:p-8">
                    <div className="w-full sm:w-[450px] md:w-[480px] lg:w-[520px] mx-auto">
                        {/* Logo Section */}
                        <div className="text-center mb-6 md:mb-8 lg:mb-10">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                                <IonIcon icon={lockClosedOutline} className="text-white text-2xl md:text-3xl" />
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-base md:text-lg text-slate-400">Sign in to your account</p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/20 mb-6">
                            <form onSubmit={handleLogin} className="space-y-6">
                                {/* Form fields remain the same but with responsive text sizes */}
                                <div className="space-y-2">
                                    <IonLabel className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                        Email Address
                                    </IonLabel>
                                    <div className="relative">
                                        <IonIcon
                                            icon={mailOutline}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                        />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                                setErrors(prev => ({ ...prev, email: undefined, general: undefined }));
                                            }}
                                            placeholder="Enter your email"
                                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="text-red-500 text-sm md:text-base mt-1">{errors.email}</div>
                                    )}
                                </div>

                                {/* Password field with responsive sizing */}
                                <div className="space-y-2">
                                    <IonLabel className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                        Password
                                    </IonLabel>
                                    <div className="relative">
                                        <IonIcon
                                            icon={lockClosedOutline}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                        />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                setErrors(prev => ({ ...prev, password: undefined, general: undefined }));
                                            }}
                                            placeholder="Enter your password"
                                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <IonIcon
                                                icon={showPassword ? eyeOffOutline : eyeOutline}
                                                className="text-slate-400 hover:text-white transition-colors text-lg md:text-xl"
                                            />
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="text-red-500 text-sm md:text-base mt-1">{errors.password}</div>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <IonCheckbox
                                            checked={rememberMe}
                                            onIonChange={(e) => setRememberMe(e.detail.checked)}
                                            className="text-blue-500"
                                        />
                                        <span className="text-sm md:text-base text-slate-300">Remember me</span>
                                    </div>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm md:text-base text-blue-400 hover:text-blue-300"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>

                                {/* Sign In Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold text-base md:text-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                                >
                                    <span>Sign In</span>
                                    <IonIcon icon={arrowForwardOutline} />
                                </button>

                                {/* Error Message */}
                                {errors.general && (
                                    <div className="text-red-500 text-sm md:text-base text-center mt-2">{errors.general}</div>
                                )}

                                {/* Divider */}
                                {/* <div className="relative my-6 md:my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-600"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-sm md:text-base text-slate-400 bg-slate-900/50 backdrop-blur-sm rounded-full">
                                            Or continue with
                                        </span>
                                    </div>
                                </div> */}

                                {/* Google Button */}
                                {/* <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-base md:text-lg flex items-center justify-center space-x-3 hover:bg-white/10 transition-colors"
                                >
                                    <FcGoogle size={24} />
                                    <span>Continue with Google</span>
                                </button> */}

                                {googleError && (
                                    <div className="text-red-500 text-sm md:text-base text-center mt-1">
                                        {googleError}
                                    </div>
                                )}
                            </form>
                        </div>


                        {/* Sign Up Link */}
                        <div className="text-center">
                            <span className="text-sm md:text-base text-slate-400">
                                Don't have an account?{' '}
                                <Link
                                    to="/signup"
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 inline-block"
                                >
                                    Create Account
                                </Link>
                            </span>
                        </div>

                    </div>
                </div>
                <AlertMessage
                    isOpen={alert.show}
                    message={alert.message}
                    onDidDismiss={() => setAlert({ ...alert, show: false })}
                />
            </IonContent>
        </IonPage>
    );

};

export default Login;
