import React, { useRef, useEffect, useState } from 'react';
import {
    IonPage,
    IonContent,
    IonIcon,
    IonAlert,
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
    const [showLocationAlert, setShowLocationAlert] = useState(false);
    const [locationError, setLocationError] = useState('');


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
        try {
            if (Capacitor.isNativePlatform()) {
                console.log('Native platform detected');
                
                // First check current permissions
                const permissionStatus = await Geolocation.checkPermissions();
                console.log('Current permission status:', permissionStatus);

                if (permissionStatus.location === 'granted') {
                    console.log('Permission already granted');
                    // Test location access
                    await testLocationAccess();
                } else if (permissionStatus.location === 'denied') {
                    // Permission was denied, show alert to go to settings
                    setLocationError('Location permission was denied. Please enable location access in your device settings to continue.');
                    setShowLocationAlert(true);
                    return;
                } else {
                    // Permission not determined, request it
                    console.log('Requesting location permission...');
                    const permission = await Geolocation.requestPermissions();
                    console.log('Permission request result:', permission);
                    
                    if (permission.location === 'granted') {
                        await testLocationAccess();
                    } else if (permission.location === 'denied') {
                        setLocationError('Location permission is required for this app to function properly. Please enable location access in your device settings.');
                        setShowLocationAlert(true);
                    } else {
                        setLocationError('Location permission was not granted. Some features may not work properly.');
                        setShowLocationAlert(true);
                    }
                }
            } else {
                // Web platform handling
                console.log('Web platform detected');
                if ('geolocation' in navigator) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            console.log('Web location access successful:', position);
                            history.push('/login');
                        },
                        (error) => {
                            console.log('Web location error:', error);
                            setLocationError('Location access failed. Please enable location services in your browser.');
                            setShowLocationAlert(true);
                        },
                        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
                    );
                } else {
                    console.log('Geolocation not supported');
                    setLocationError('Geolocation is not supported by this browser.');
                    setShowLocationAlert(true);
                }
            }
        } catch (error) {
            console.error('Location permission error:', error);
            setLocationError('An error occurred while requesting location permission. Please try again.');
            setShowLocationAlert(true);
        }
    };

    const testLocationAccess = async () => {
        try {
            console.log('Testing location access...');
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            });
            console.log('Location access successful:', position);
            history.push('/login');
        } catch (error) {
            console.error('Location access test failed:', error);
            setLocationError('Unable to access location. Please ensure location services are enabled and try again.');
            setShowLocationAlert(true);
        }
    };

    const handleLocationAlertDismiss = () => {
        setShowLocationAlert(false);
        // Still proceed to login even if location fails
        history.push('/login');
    };

    const handleOpenSettings = () => {
        setShowLocationAlert(false);
        // On mobile, this would typically open the app settings
        if (Capacitor.isNativePlatform()) {
            // You might want to use a plugin like @capacitor/app to open settings
            setLocationError('Please manually enable location permission in your device settings for this app.');
        }
        // Still proceed to login
        history.push('/login');
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

                    {/* Location Permission Alert */}
                    <IonAlert
                        isOpen={showLocationAlert}
                        onDidDismiss={handleLocationAlertDismiss}
                        header="Location Permission"
                        message={locationError}
                        buttons={[
                            {
                                text: 'Skip',
                                role: 'cancel',
                                handler: handleLocationAlertDismiss
                            },
                            {
                                text: 'Settings',
                                handler: handleOpenSettings
                            },
                            {
                                text: 'Try Again',
                                handler: () => {
                                    setShowLocationAlert(false);
                                    requestLocationPermission();
                                }
                            }
                        ]}
                    />
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Welcome;
