import React, { useState } from 'react';
import { IonContent, IonPage, IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonIcon } from '@ionic/react';
import { mailOutline, lockClosedOutline, arrowForwardOutline, keyOutline } from 'ionicons/icons';
import { useIonRouter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { API_BASE_URL, API_ENDPOINTS } from '../components/config/constants';
import AlertMessage from '../components/AlertMessage';

const ForgotPasswordScreen: React.FC = () => {

    const router = useIonRouter();
    const history = useHistory();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;
    }>({ show: false, message: '' });

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email) return setError('Please enter your email');

        try {
            const res = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.FORGOT_PASSWORD}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setAlert({
                    show: true,
                    message: 'OTP sent successfully to your email!'
                });

                setTimeout(() => {
                    setAlert({ show: false, message: '' });
                    setStep(2);
                }, 2000);
            } else setError(data.message);
        } catch {
            setError('Failed to send OTP. Please try again.');
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const { otp, newPassword, confirmPassword, email } = formData;
        if (!otp || !newPassword || !confirmPassword)
            return setError('Please fill all fields');
        if (newPassword !== confirmPassword)
            return setError('Passwords do not match');

        try {
            const res = await fetch(`${API_BASE_URL}/${API_ENDPOINTS.FORGOT_PASSWORD_VERIFY_OTP}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, new_password: newPassword })
            });
            const data = await res.json();
            if (data.status === 'success') {
                setAlert({
                    show: true,
                    message: 'Password reset successful! Please login.'
                });
                setTimeout(() => {
                    router.push('/login', 'root', 'replace');
                }, 2000);
            } else setError(data.message);
        } catch {
            setError('Password reset failed. Try again.');
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-padding-horizontal">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/login" />
                    </IonButtons>
                    <IonTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500 font-bold">
                        Forgot Password
                    </IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
                    <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 md:p-6">
                        {step === 1 ? (
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <label className="text-slate-200 block text-sm">Email Address</label>
                                <div className="relative">
                                    <IonIcon icon={mailOutline} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => {
                                            setFormData({ ...formData, email: e.target.value });
                                            setError('');
                                        }}
                                        placeholder="Enter your email"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold text-base flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                                >
                                    Send OTP
                                    <IonIcon icon={arrowForwardOutline} />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <label className="text-slate-200 block text-sm">Enter OTP</label>
                                <div className="relative">
                                    <IonIcon icon={keyOutline} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={formData.otp}
                                        onChange={(e) => {
                                            setFormData({ ...formData, otp: e.target.value });
                                            setError('');
                                        }}
                                        placeholder="OTP"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    />
                                </div>

                                <label className="text-slate-200 block text-sm">New Password</label>
                                <div className="relative">
                                    <IonIcon icon={lockClosedOutline} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.newPassword}
                                        onChange={(e) => {
                                            setFormData({ ...formData, newPassword: e.target.value });
                                            setError('');
                                        }}
                                        placeholder="New Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    />
                                </div>

                                <label className="text-slate-200 block text-sm">Confirm Password</label>
                                <div className="relative">
                                    <IonIcon icon={lockClosedOutline} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => {
                                            setFormData({ ...formData, confirmPassword: e.target.value });
                                            setError('');
                                        }}
                                        placeholder="Confirm Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold text-base flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity"
                                >
                                    Reset Password
                                    <IonIcon icon={arrowForwardOutline} />
                                </button>

                            </form>
                        )}

                        {error && (
                            <p className="text-red-500 text-center text-sm mt-4">{error}</p>
                        )}

                        <button
                            onClick={() => history.push('/login')}
                            className="mt-6 text-sm text-slate-400 hover:text-white transition"
                        >
                            Back to Login
                        </button>
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

export default ForgotPasswordScreen;
