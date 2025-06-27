import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
    IonContent,
    IonSpinner,
} from '@ionic/react';
import {
    MdImage,
    MdPayment,
    MdArrowForward,
    MdInfo,
    MdRefresh
} from 'react-icons/md';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import { API_ENDPOINTS } from '../../components/config/constants';
import ProtectedLayout from '../../components/PrivateLayout';
import PaymentService from '../../services/PaymentService';
import { PaymentData } from '../../services/types/PaymentTypes';

const ProcessScreen: React.FC = () => {
    const history = useHistory();
    const { axiosInstance } = useAuth();
    const { handleFinalPayment } = PaymentService();
    const [imageStatus, setImageStatus] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '' });


    const callbacks = {
        setAlert,
        navigate: history.push
    };

    const checkImageStatus = async () => {
        try {
            const response = await axiosInstance.get(`/${API_ENDPOINTS.PAYMENT_STATUS}`);
            if (response.data.status === 'success') {
                const data = response.data.data;

                // Check if payment is complete and handle accordingly
                if (data.payment_status === 'completed') {
                    setImageStatus(null);
                    setPaymentData(null);
                } else {
                    setPaymentData(data);
                    setImageStatus(data.image_status);
                }
            }
        } catch (error) {
            return { error: 'Failed to fetch current status', details: error };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkImageStatus();
        const interval = setInterval(checkImageStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleCompleteFinalPayment = async () => {
        if (!paymentData) return;
        await handleFinalPayment(
            {
                payment_id: paymentData.payment_id,
                amount: paymentData.pending_amount
            } as any,
            callbacks
        );
    };

    const renderProcessingContent = () => (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 md:p-10">
                <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                    <div className="relative flex items-center justify-center w-full h-full bg-blue-500/30 rounded-full">
                        <MdImage className="text-4xl text-blue-400" />
                    </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    Processing Your Request
                </h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                    Our geo-fencing team is currently working on your satellite imagery.
                </p>
                <div className="space-y-4 mb-8 max-w-md mx-auto">
                    {['Image data acquisition', 'Geo-fencing verification', 'Quality assurance check'].map((step, index) => (
                        <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-blue-400">{index + 1}</span>
                                </div>
                                <p className="text-gray-300 text-left">{step}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-xl p-6 border border-blue-500/20 max-w-2xl mx-auto">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-blue-500/20 p-2 rounded-lg">
                            <MdInfo className="text-blue-400 text-xl" />
                        </div>
                        <p className="text-blue-400 text-sm md:text-base leading-relaxed text-left">
                            You'll receive an email notification once your images are ready for the final payment.
                            This page will automatically update when processing is complete.
                        </p>
                    </div>
                </div>
                <div className="mt-8 max-w-xl mx-auto">
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 w-3/4 animate-pulse"></div>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mt-4 flex items-center justify-center">
                    <MdRefresh className="animate-spin mr-2" />
                    Refreshing automatically...
                </p>
            </div>
        </div>
    );

    const renderPaymentContent = () => (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
            <div className="space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                        Images are Ready!
                    </h1>
                    <p className="text-gray-300 text-sm md:text-lg">
                        Complete the final payment to access images
                    </p>
                </div>
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center space-x-3">
                            <MdImage className="text-blue-400 text-2xl md:text-3xl" />
                            <h2 className="text-lg md:text-2xl font-semibold text-white">
                                Final Payment Details
                            </h2>
                        </div>
                        <div className="bg-green-500/20 px-3 py-1 rounded-full">
                            <span className="text-green-400 text-sm font-medium">Ready for Payment</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white/5 rounded-xl p-6">
                            <p className="text-gray-400 mb-2 text-center sm:text-left">Final Payment Amount</p>
                            <div className="text-3xl md:text-4xl font-bold text-green-400 text-center sm:text-left">
                                ₹{paymentData?.pending_amount}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-gray-400 mb-1">Coordinates</p>
                                <p className="text-white font-medium">
                                    {paymentData?.latitude}, {paymentData?.longitude}
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4">
                                <p className="text-gray-400 mb-1">Coverage Area</p>
                                <p className="text-white font-medium">{paymentData?.coverage_area}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCompleteFinalPayment}
                            className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold text-white text-lg transition-all duration-300 flex items-center justify-center space-x-2"
                        >
                            <MdPayment className="text-xl" />
                            <span>Complete Payment</span>
                            <MdArrowForward className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDefaultContent = () => (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
            <div className="text-center bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    No Active Requests Found
                </h2>
                <p className="text-gray-300 mb-8">
                    Please create a satellite image request and complete the advance payment first.
                </p>
                <button
                    onClick={() => history.push('/dashboard/image-request')}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600  rounded-xl font-semibold text-white  transition-all duration-300"
                >
                    Create New Request
                </button>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-96">
                    <IonSpinner name="crescent" />
                </div>
            );
        }

        if (!imageStatus) return renderDefaultContent();
        if (imageStatus === 'processing') return renderProcessingContent();
        if (imageStatus === 'ready') return renderPaymentContent();
    };

    return (
        <ProtectedLayout title="Process Image">
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter px-4 py-8">
                {renderContent()}
                <AlertMessage
                    isOpen={alert.show}
                    message={alert.message}
                    onDidDismiss={() => setAlert({ show: false, message: '' })}
                />
            </div>
        </ProtectedLayout>
    );
};

export default ProcessScreen;
