import React, { useState } from 'react';
import {
    IonContent,
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonSpinner,
    useIonRouter,
} from '@ionic/react';

import {
    radioOutline,
    locationOutline,
    checkmarkCircleOutline,
} from 'ionicons/icons';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import { API_ENDPOINTS } from '../../components/config/constants';
import PaymentService from '../../services/PaymentService';
import { RequestData } from '../../services/types/PaymentTypes';
import subscriptionPlansData from '../../data/subscriptionPlans.json';


const SatelliteRequest: React.FC = () => {
    const router = useIonRouter();
    const { axiosInstance } = useAuth();
    const { handleAdvancePayment, handleFinalPayment } = PaymentService();
    const [requestData, setRequestData] = useState<RequestData | null>(null);
    const [paymentStep, setPaymentStep] = useState('initial');

    const [coordinates, setCoordinates] = useState({ latitude: '', longitude: '' });
    const [selectedPlan, setSelectedPlan] = useState('payasyougo');
    const [imageResolution, setImageResolution] = useState('high');
    const [imageSize, setImageSize] = useState('5km');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [error, setError] = useState('');
    const [alert, setAlert] = useState<{
        show: boolean;
        message: string;    
    }>({ show: false, message: '' });

    const subscriptionPlans = subscriptionPlansData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await axiosInstance.post(`/${API_ENDPOINTS.SATELLITE_REQUEST}`, {
                latitude: parseFloat(coordinates.latitude),
                longitude: parseFloat(coordinates.longitude),
                resolution: imageResolution,
                coverage_area: imageSize,
                plan_type: selectedPlan
            });

            if (response.data.status === 'success') {
                setRequestData(response.data.data);
                setAlert({
                    show: true,
                    message: 'Request created successfully!'
                });
                setTimeout(() => {
                    setAlert({ show: false, message: '' });
                    setShowConfirmation(true);

                }, 2000);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit request');
        } finally {
            setIsSubmitting(false);
        }
    };

const handlePayment = async () => {
  setShowConfirmation(false);

  if (!requestData?.request_id) {
    console.error('Request ID missing');
    return;
  }

  await handleAdvancePayment(
    { request_id: requestData.request_id },
    {
      setPaymentStep: (step) => console.log('Step:', step),
      setAlert: setAlert,
      setError: (err) => console.error(err)
    }
  );
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
                            {error && (
                                <div className="max-w-6xl mx-auto px-4 mt-3">
                                    <p className="text-red-500 text-center text-sm md:text-base">{error}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <AlertMessage
                    isOpen={alert.show}
                    message={alert.message}
                    onDidDismiss={() => setAlert({ ...alert, show: false })}
                />

                {showConfirmation && (
                    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
                        <div className="bg-white/10 rounded-xl border border-gray-700 p-6 max-w-md w-full">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4 text-center">
                                Confirm Advance Payment
                            </h3>

                            <div className="bg-white/10 p-4 rounded-lg text-center mb-4">
                                <p className="text-gray-300 mb-1">Advance Payment Amount:</p>
                                <p className="text-green-400 text-2xl md:text-3xl font-bold">
                                    {subscriptionPlans.find(p => p.id === selectedPlan)?.advancePayment}
                                </p>
                                <p className="text-gray-400 text-sm">
                                    50% of total amount ({subscriptionPlans.find(p => p.id === selectedPlan)?.price})
                                </p>
                            </div>

                            <p className="text-gray-300 text-xs text-center mb-6">
                                * After successful payment, image processing will take 3–4 weeks. We'll notify you once the images are ready.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 px-4 py-2 border bg-red-600  rounded-lg text-white  text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="flex-1 px-4 py-2  bg-green-600  rounded-lg text-white font-semibold  text-sm"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </IonContent>

        </IonPage>
    );

};

export default SatelliteRequest;
