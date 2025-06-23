import React, { useState, useEffect } from 'react';
import { IonContent, IonPage, IonIcon } from '@ionic/react';
import {
    personOutline,
    mailOutline,
    lockClosedOutline,
    eyeOutline,
    eyeOffOutline,
    arrowForwardOutline,
    callOutline
} from 'ionicons/icons';
import { FcGoogle } from 'react-icons/fc';
import { Link, useHistory } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../components/config/constants';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { initializeGoogleAuth } from '../components/config/googleAuth';
import { isPlatform } from '@ionic/react';
import AlertMessage from '../components/AlertMessage';


interface FormData {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
}

interface FormErrors {
    [key: string]: string;
}

const Signup: React.FC = () => {
    const history = useHistory();
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        phone: '',
        password: '',
        confirm_password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const [alert, setAlert] = useState({ show: false, message: '' });

    useEffect(() => {
        initializeGoogleAuth();
    }, []);

    interface FormData {
    fname: string;
    lname: string;
    email: string;
    phone: string;
    password: string;
    confirm_password: string;
}

interface FormErrors {
    [key: string]: string;
}

const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
        setErrors((prev: FormErrors) => ({ ...prev, [field]: '' }));
    }
};

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.fname) newErrors.fname = 'First name is required';
        if (!formData.lname) newErrors.lname = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
        if (!formData.confirm_password) newErrors.confirm_password = 'Please confirm password';
        else if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.message });
                return;
            }

            setAlert({
                show: true,
                message: 'Registration successful! Please login to continue.'
            });

            setTimeout(() => {
                history.push('/login');
            }, 2000);

        } catch (error) {
            setErrors({ general: 'An unexpected error occurred' });
        }
    };

    const handleGoogleSignup = async () => {
        try {
            const googleUser = await GoogleAuth.signIn();
            const googleToken = googleUser.authentication.idToken;

            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.SIGNUP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    google_token: googleToken,
                    platform: isPlatform('android') ? 'android' : 'web'
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ general: data.message });
                return;
            }

            setAlert({
                show: true,
                message: 'Google signup successful!'
            });

            setTimeout(() => {
                history.push('/dashboard');
            }, 1500);

        } catch (error) {
            setErrors({ general: 'An unexpected error occurred' });
        }
    };

    return (
        <IonPage>
            <IonContent fullscreen className="font-inter">
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 md:p-6 lg:p-8">
                    <div className="w-full sm:w-[450px] md:w-[480px] lg:w-[520px] mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-6 md:mb-8 lg:mb-10">
                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-2xl">
                                <IonIcon icon={personOutline} className="text-white text-2xl md:text-3xl" />
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">Create Account</h1>
                            <p className="text-base md:text-lg text-slate-400">Join us today</p>
                        </div>

                        {/* Form Container */}
                        <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl border border-white/20 mb-6">
                            <form onSubmit={handleSignup} className="space-y-6">
                                {/* Name Fields */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <IonIcon
                                                icon={personOutline}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                            />
                                            <input
                                                type="text"
                                                value={formData.fname}
                                                onChange={(e) => handleInputChange('fname', e.target.value)}
                                                placeholder="First name"
                                                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                            />
                                        </div>
                                        {errors.fname && (
                                            <div className="text-red-500 text-sm md:text-base mt-1">{errors.fname}</div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <IonIcon
                                                icon={personOutline}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                            />
                                            <input
                                                type="text"
                                                value={formData.lname}
                                                onChange={(e) => handleInputChange('lname', e.target.value)}
                                                placeholder="Last name"
                                                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                            />
                                        </div>
                                        {errors.lname && (
                                            <div className="text-red-500 text-sm md:text-base mt-1">{errors.lname}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <IonIcon
                                            icon={mailOutline}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                        />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                            placeholder="Enter your email"
                                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                        />
                                    </div>
                                    {errors.email && (
                                        <div className="text-red-500 text-sm md:text-base mt-1">{errors.email}</div>
                                    )}
                                </div>

                                {/* Phone Field */}
                                <div className="space-y-2">
                                    <label className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                        Phone Number (Optional)
                                    </label>
                                    <div className="relative">
                                        <IonIcon
                                            icon={callOutline}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                        />
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            placeholder="Enter phone number"
                                            className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                        />
                                    </div>
                                </div>

                                {/* Password Fields */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <IonIcon
                                                icon={lockClosedOutline}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                            />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                placeholder="Create password"
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

                                    <div className="space-y-2">
                                        <label className="text-sm md:text-base text-slate-300 font-medium block ml-1">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <IonIcon
                                                icon={lockClosedOutline}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg md:text-xl"
                                            />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={formData.confirm_password}
                                                onChange={(e) => handleInputChange('confirm_password', e.target.value)}
                                                placeholder="Confirm password"
                                                className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 text-base md:text-lg"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-4 top-1/2 -translate-y-1/2"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                <IonIcon
                                                    icon={showConfirmPassword ? eyeOffOutline : eyeOutline}
                                                    className="text-slate-400 hover:text-white transition-colors text-lg md:text-xl"
                                                />
                                            </button>
                                        </div>
                                        {errors.confirm_password && (
                                            <div className="text-red-500 text-sm md:text-base mt-1">{errors.confirm_password}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Sign Up Button */}
                                {/* Sign Up Button */}
                                <button
                                    type="submit"
                                    className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold text-base md:text-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                                >
                                    <span>Create Account</span>
                                    <IonIcon icon={arrowForwardOutline} />
                                </button>

                                {/* General Error Message */}
                                {errors.general && (
                                    <div className="text-red-500 text-sm md:text-base text-center mt-2">
                                        {errors.general}
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="relative my-6 md:my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-600"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-sm md:text-base text-slate-400 bg-slate-900/50 backdrop-blur-sm rounded-full">
                                            Or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Google Sign Up */}
                                <button
                                    type="button"
                                    onClick={handleGoogleSignup}
                                    className="w-full h-12 md:h-14 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-base md:text-lg flex items-center justify-center space-x-3 hover:bg-white/10 transition-colors"
                                >
                                    <FcGoogle size={24} />
                                    <span>Continue with Google</span>
                                </button>
                            </form>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <span className="text-sm md:text-base text-slate-400">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 inline-block"
                                >
                                    Sign In
                                </Link>
                            </span>
                        </div>
                    </div>
                          {/* Alert Message */}
                <AlertMessage
                    isOpen={alert.show}
                    message={alert.message}
                    onDidDismiss={() => setAlert({ ...alert, show: false })}
                />
                </div>

      
 
        </IonContent>
        </IonPage>
    );
};

export default Signup;

