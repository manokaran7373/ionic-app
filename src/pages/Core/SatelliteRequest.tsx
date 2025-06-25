import React, { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonSpinner,
    IonCheckbox,
    IonModal,
    useIonRouter,
} from '@ionic/react';
import { MdStar } from 'react-icons/md';

import {
    radioOutline,
    locationOutline,
    scanOutline,
    cardOutline,
    checkmarkCircleOutline,
    starOutline,
    eyeOutline,
    cloudOutline
} from 'ionicons/icons';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import { API_BASE_URL, API_ENDPOINTS } from '../../components/config/constants';

const SatelliteRequest: React.FC = () => {
    const router = useIonRouter();
    const { axiosInstance } = useAuth();

    const [coordinates, setCoordinates] = useState({ latitude: '', longitude: '' });
    const [selectedPlan, setSelectedPlan] = useState('payasyougo');
    const [imageResolution, setImageResolution] = useState('high');
    const [imageSize, setImageSize] = useState('5km');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState('');
    const [requestData, setRequestData] = useState(null);

    const subscriptionPlans = [
        {
            id: 'payasyougo',
            name: 'Pay As You Go',
            price: '₹5,000',
            advancePayment: '₹2,500',
            period: 'per image',
            features: [
                'Image processing time *3-4 weeks*',
                'High-resolution satellite images',
                'Instant download',
                'Basic image formats (JPEG, PNG)',
                'Standard processing time',
                'Email support'
            ],
            popular: false,
            color: 'blue'
        },
        {
            id: 'monthly',
            name: 'Monthly Plan',
            price: '₹20,000',
            advancePayment: '₹10,000',
            period: 'per month',
            features: [
                'Image processing time *3-4 weeks*',
                'Up to 10 high-resolution images',
                'Priority processing',
                'Multiple formats (JPEG, PNG, TIFF)',
                'Historical imagery access',
                'Advanced analytics tools',
                'Priority email support'
            ],
            popular: true,
            color: 'green'
        },
        {
            id: 'yearly',
            name: 'Yearly Plan',
            price: '₹2,60,000',
            advancePayment: '₹1,30,000',
            period: 'per year',
            features: [
                'Image processing time *3-4 weeks*',
                'Unlimited high-resolution images',
                'Fastest processing priority',
                'All formats including RAW',
                'Complete historical archive',
                'Advanced AI analytics',
                'Custom area monitoring',
                'Dedicated support manager',
                '2 months free'
            ],
            popular: false,
            color: 'purple'
        }
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await axiosInstance.post(`${API_BASE_URL}${API_ENDPOINTS.SATELLITE_REQUEST}`, {
                latitude: parseFloat(coordinates.latitude),
                longitude: parseFloat(coordinates.longitude),
                resolution: imageResolution,
                coverage_area: imageSize,
                plan_type: selectedPlan
            });

            if (response.data.status === 'success') {
                setRequestData(response.data.data);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setShowConfirmation(true);
                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Request failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayment = async () => {
        setShowConfirmation(false);
        // Implement payment logic here
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar className="ion-padding-horizontal">
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/dashboard" />
                    </IonButtons>
                    <IonTitle className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 font-bold">
                        Image Request
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>

                <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
                    {/* Header Section */}
                    <div className="text-center max-w-4xl mx-auto mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Satellite Image Request
                        </h1>
                        <p className="text-gray-300 text-lg">
                            Get high-resolution satellite imagery for any location on Earth
                        </p>
                    </div>

                    {/* Location Input Section */}
                    <div className="max-w-6xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                            <div className="flex items-center gap-2 mb-6">
                                <IonIcon icon={locationOutline} className="text-blue-400 text-xl" />
                                <h2 className="text-xl font-semibold text-white">Location Coordinates</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Latitude</label>
                                    <input
                                        type="number"
                                        value={coordinates.latitude}
                                        onChange={(e) => setCoordinates({ ...coordinates, latitude: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Enter latitude"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Longitude</label>
                                    <input
                                        type="number"
                                        value={coordinates.longitude}
                                        onChange={(e) => setCoordinates({ ...coordinates, longitude: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
                                        placeholder="Enter longitude"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Plans */}
                    <div className="max-w-6xl mx-auto mb-8">
                        <h2 className="text-2xl  text-center font-bold text-white mb-6">Choose Your Plan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {subscriptionPlans.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`relative rounded-2xl p-6 cursor-pointer transition-all duration-300 ${selectedPlan === plan.id
                                        ? `bg-${plan.color}-500/20 border-2 border-${plan.color}-500`
                                        : 'bg-white/10 border-2 border-white/20'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-1 rounded-full text-sm font-bold">

                                                POPULAR
                                            </span>
                                        </div>
                                    )}
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                        <div className="text-3xl font-bold text-white mb-1">{plan.price}</div>
                                        <p className="text-gray-400">{plan.period}</p>
                                    </div>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="flex items-start gap-2 text-gray-300">
                                                <IonIcon icon={checkmarkCircleOutline} className={`text-${plan.color}-400 mt-1`} />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Summary */}
                    {coordinates.latitude && coordinates.longitude && selectedPlan && (
                        <div className="max-w-6xl mx-auto mb-8">
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Location:</span>
                                        <span className="text-white">{`${coordinates.latitude}, ${coordinates.longitude}`}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Resolution:</span>
                                        <span className="text-white">High (5m/pixel)</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Coverage Area:</span>
                                        <span className="text-white">5km x 5km</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-300">Plan:</span>
                                        <span className="text-white">
                                            {subscriptionPlans.find(p => p.id === selectedPlan)?.name}
                                        </span>
                                    </div>
                                    <div className="border-t border-white/10 pt-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-white">Total:</span>
                                            <span className="text-xl font-bold text-green-400">
                                                {subscriptionPlans.find(p => p.id === selectedPlan)?.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    {coordinates.latitude && coordinates.longitude && selectedPlan && (
                        <div className="max-w-6xl mx-auto text-center">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <IonSpinner name="crescent" />
                                ) : (
                                    <>
                                        <IonIcon icon={radioOutline} className="mr-2" />
                                        Request Satellite Image
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>

            </IonContent>

        </IonPage>
    );

};

export default SatelliteRequest;
