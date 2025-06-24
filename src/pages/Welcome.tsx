import React, { useRef, useEffect, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonIcon,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Geolocation } from '@capacitor/geolocation';
import { locationOutline } from 'ionicons/icons';
import { Capacitor } from '@capacitor/core';
import Lottie from 'lottie-web';

const Welcome: React.FC = () => {
    const history = useHistory();
    const lottieContainer = useRef<HTMLDivElement>(null);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);
    const [hasAcceptedPolicy, setHasAcceptedPolicy] = useState(() => {
        return localStorage.getItem('policyAccepted') === 'true';
    });


    useEffect(() => {
        let animation: any;
        if (lottieContainer.current) {
            animation = Lottie.loadAnimation({
                container: lottieContainer.current as Element,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '/assets/Globe.json'
            });
        }
        return () => {
            if (animation) animation.destroy();
        };
    }, []);



    const handleGetStarted = async () => {
        // Check if policy was already accepted
        if (!hasAcceptedPolicy) {
            setShowPrivacyModal(true);
            return;
        }
        await requestLocationPermission();
    };

    const handlePolicyAccept = async () => {
        localStorage.setItem('policyAccepted', 'true');
        setHasAcceptedPolicy(true);
        setShowPrivacyModal(false);
        await requestLocationPermission();
    };

    const requestLocationPermission = async () => {
    if (Capacitor.isNativePlatform()) {
        try {
            const permissionStatus = await Geolocation.checkPermissions();
            
            if (permissionStatus.location === 'granted') {
                // Location already enabled, go directly to login
                history.push('/login');
            } else {
                // Request permission only if not granted
                const permission = await Geolocation.requestPermissions();
                if (permission.location === 'granted') {
                    history.push('/login');
                }
            }
        } catch (error) {
            console.log('Location error:', error);
        }
    } else {
        // Web platform handling
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                () => history.push('/login'),
                (error) => console.log('Web location error:', error)
            );
        }
    }
};



    return (
        <IonPage>
            <IonContent fullscreen className="font-inter">
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 md:p-6 lg:p-8">
                    <div className="w-full max-w-md mx-auto">
                        {/* Animation Container */}
                        <div
                            ref={lottieContainer}
                            className="w-48 h-48 md:w-56 md:h-56 mx-auto mb-6 md:mb-8"
                        />

                        {/* Welcome Text */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-4 md:mb-6">
                            Welcome to GeoFencing
                        </h1>

                        {/* Content Card */}
                        <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl border border-white/20 mb-6">
                            <p className="text-gray-300 text-base md:text-lg text-center mb-6">
                                Experience real-time tracking and location-based services with our cutting-edge platform.
                            </p>
                            <button
                                onClick={handleGetStarted}
                                className="w-full h-12 md:h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold text-base md:text-lg flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-300"
                            >
                                <IonIcon icon={locationOutline} className="text-xl md:text-2xl" />
                                <span>Get Started</span>
                            </button>
                        </div>

                        {/* Privacy Policy Link */}
                        <p className="text-center text-sm md:text-base text-gray-400">
                            By continuing, you agree to our{' '}
                            <button
                                onClick={() => setShowPrivacyModal(true)}
                                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                            >
                                Privacy Policy
                            </button>
                        </p>
                    </div>

                    {/* Privacy Policy Modal */}
                    {showPrivacyModal && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-white/10">
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                                    Privacy Policy
                                </h2>
                                <div className="max-h-[60vh] overflow-y-auto mb-6 pr-2">
                                    <p className="text-gray-300 mb-4">
                                        Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
                                    </p>
                                    <h3 className="text-xl font-semibold mb-3 text-white">
                                        Data Collection:
                                    </h3>
                                    <ul className="space-y-2 text-gray-300 list-disc pl-5">
                                        <li>Location data for land monitoring</li>
                                        <li>Agricultural data and measurements</li>
                                        <li>Weather-related information</li>
                                        <li>User account details</li>
                                    </ul>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={() => setShowPrivacyModal(false)}
                                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={handlePolicyAccept}
                                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-all duration-200"
                                    >
                                        Accept
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Welcome;
