import { IonContent, IonPage, IonInput, IonButton, IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { FcGoogle } from 'react-icons/fc';
import { useState } from 'react';

const LoginScreen: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <IonPage>
            <IonContent fullscreen className="ion-padding">
                <div className="min-h-screen bg-gradient-to-br from-[#0F172A] to-[#1E293B] font-poppins flex items-center justify-center px-4">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#60A5FA] to-[#34D399] mb-8 text-center">
                            Login to Continue
                        </h1>

                        <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20">
                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-300 font-medium block">Email</label>
                                    <div className="relative">
                                        <IonIcon 
                                            icon={mailOutline} 
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                                        />
                                        <IonInput
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-300 font-medium block">Password</label>
                                    <div className="relative">
                                        <IonIcon 
                                            icon={lockClosedOutline} 
                                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10"
                                        />
                                        <IonInput
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-10 text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        >
                                            <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
                                        </button>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <IonButton fill="clear" className="text-[#60A5FA] hover:text-[#93C5FD] text-sm font-medium">
                                        Forgot Password?
                                    </IonButton>
                                </div>

                                <IonButton
                                    expand="block"
                                    className="w-full bg-gradient-to-r from-[#3B82F6] to-[#10B981] text-white rounded-xl font-semibold h-12"
                                >
                                    Login
                                </IonButton>

                                <div className="mt-6 text-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-gray-600"></div>
                                        </div>
                                        <div className="relative flex justify-center">
                                            <span className="px-4 text-sm text-gray-400 bg-[#1E293B]">Or</span>
                                        </div>
                                    </div>

                                    <IonButton
                                        expand="block"
                                        fill="outline"
                                        className="mt-6 bg-white/5 border border-white/10 rounded-xl h-12"
                                    >
                                        <FcGoogle className="mr-2" size={24} />
                                        Continue with Google
                                    </IonButton>
                                </div>
                            </form>
                        </div>

                        <p className="mt-8 text-center text-gray-400">
                            Don't have an account?{' '}
                            <IonButton 
                                fill="clear"
                                className="text-[#60A5FA] hover:text-[#93C5FD] font-medium"
                            >
                                Signup
                            </IonButton>
                        </p>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LoginScreen;
