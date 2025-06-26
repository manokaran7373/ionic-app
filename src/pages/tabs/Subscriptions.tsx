import React, { useState, useEffect } from 'react';
import {
    IonIcon,
    IonButton,
} from '@ionic/react';
import {
    locationOutline,
    cardOutline,
    imageOutline,
    cashOutline,
    refreshOutline,
} from 'ionicons/icons';
import { useAuth } from '../../components/AuthContext';
import ProtectedLayout from '../../components/PrivateLayout';
import { API_ENDPOINTS } from '../../components/config/constants';


interface Payment {
  payment_id: string;
  plan_type: string;
  payment_status: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  image_status: string;
  total_amount: number;
}

const PaymentCard: React.FC<{ payment: Payment }> = ({ payment }) => {
    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 p-4 w-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <h3 className="text-lg font-semibold text-white break-words">
                    {payment.plan_type === 'per_image' ? 'One-time Satview' : payment.plan_type}
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap
            ${payment.payment_status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}
                >
                    {payment.payment_status}
                </span>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <IonIcon icon={locationOutline} className="text-gray-400" />
                    <span className="break-all">{`${payment.coordinates.latitude}, ${payment.coordinates.longitude}`}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <IonIcon icon={imageOutline} className="text-gray-400" />
                    <span className={payment.image_status === 'ready' ? 'text-green-400' : 'text-yellow-400'}>
                        {payment.image_status}
                    </span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <IonIcon icon={cashOutline} className="text-gray-400" />
                    <span>₹{payment.total_amount}</span>
                </div>
            </div>
        </div>
    );
};

const PaymentHistoryScreen: React.FC = () => {
    const { axiosInstance } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [payments, setPayments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchPaymentHistory = async () => {
        try {
            const response = await axiosInstance.get(`/${API_ENDPOINTS.SUBSCRIPTION_STATUS}`);
            if (response.data.status === 'success') {
                setPayments(response.data.data);
            }
        } catch (error) {

            setError('No payment history found');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchPaymentHistory();
        setRefreshing(false);
    };

    return (
        <ProtectedLayout title="Subscriptions">
            <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 font-inter px-4 py-8">
                <div className="w-full max-w-3xl">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            Payment History
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base">Check your subscription information here.</p>

                    </div>

                    <div className="flex justify-center mb-4">
                        <IonButton
                            onClick={handleRefresh}
                            disabled={refreshing}
                            color="light"
                            fill="clear"
                            className="text-white border border-white/20 "
                        >
                            <IonIcon slot="start" icon={refreshOutline} />
                            {refreshing ? 'Refreshing...' : 'Refresh'}
                        </IonButton>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.map(payment => (
                                <PaymentCard
                                    key={payment.payment_id}
                                    payment={payment}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20">
                            <IonIcon icon={cardOutline} className="text-gray-400 mb-3 text-3xl" />
                            <p className="text-gray-300 text-base">No payment history found</p>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 text-center text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedLayout>
    );
};

export default PaymentHistoryScreen;
