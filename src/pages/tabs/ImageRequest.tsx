import {
    IonPage,
    IonContent,
    IonButton,
    IonSpinner,
    IonIcon,
    IonModal,
    IonText
} from '@ionic/react';
import {
    imageOutline,
    cardOutline,
    arrowForwardOutline,
    refreshOutline
} from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import AlertMessage from '../../components/AlertMessage';
import { API_ENDPOINTS } from '../../components/config/constants';
import ProtectedLayout from '../../components/PrivateLayout';
import PaymentService from '../../services/PaymentService';
import { PaymentData } from '../../services/types/PaymentTypes';


const ProcessScreen = () => {
    const history = useHistory();
    const { axiosInstance } = useAuth();
    const { handleFinalPayment } = PaymentService();
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [showFinalPayment, setShowFinalPayment] = useState(false);
    const [imageStatus, setImageStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({
        show: false,
        message: ''
    });

    const callbacks = {
        setShowSuccess,
        setSuccessMessage,
        setError,
        navigate: history.push
    };

    const checkImageStatus = async () => {
        try {
            const response = await axiosInstance.get(`/${API_ENDPOINTS.PAYMENT_STATUS}`);
            const data = response.data.data;
            if (response.data.status === 'success' && data) {
                setPaymentData(data);
                setImageStatus(data.image_status);
            } else {
                setPaymentData(null);
                setImageStatus(null);
            }
        } catch (err) {
            setError('Failed to fetch status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkImageStatus();
        const interval = setInterval(checkImageStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleFinalPayNow = async () => {
        if (!paymentData) return;
        setShowFinalPayment(false);
        await handleFinalPayment(
            {
                payment_id: paymentData.payment_id,
                amount: paymentData.pending_amount
            },
            callbacks
        );
    };

    return (
        <ProtectedLayout title="Process Image">
            <IonContent className="ion-padding">
                {loading ? (
                    <div className="flex justify-center items-center h-96">
                        <IonSpinner name="crescent" color="primary" />
                    </div>
                ) : !imageStatus ? (
                    <div className="text-center mt-16">
                        <h2 className="text-white text-2xl font-bold mb-2">No Active Requests</h2>
                        <p className="text-gray-300 mb-4">Please create a new image request and pay advance first.</p>
                        <IonButton routerLink="/image-request" color="primary">Create New Request</IonButton>
                    </div>
                ) : imageStatus === 'processing' ? (
                    <div className="text-center mt-16">
                        <IonIcon icon={imageOutline} className="text-blue-400 text-4xl mb-4" />
                        <h2 className="text-white text-2xl font-bold mb-2">Processing Your Request</h2>
                        <p className="text-gray-300 mb-6">We are currently processing your satellite images.</p>
                        <IonText color="medium">Auto-refreshing every 30s</IonText>
                    </div>
                ) : (
                    <div className="text-center mt-16">
                        <h2 className="text-white text-2xl font-bold mb-2">Images Ready!</h2>
                        <p className="text-gray-300 mb-6">Final Payment Required</p>
                        <div className="text-green-400 text-3xl font-bold mb-4">
                            ₹{paymentData?.pending_amount}
                        </div>
                        <IonButton onClick={() => setShowFinalPayment(true)} expand="block" color="success">
                            <IonIcon icon={cardOutline} slot="start" /> Complete Payment <IonIcon icon={arrowForwardOutline} slot="end" />
                        </IonButton>
                    </div>
                )}

                {/* Final Payment Modal */}
                <IonModal isOpen={showFinalPayment} onDidDismiss={() => setShowFinalPayment(false)}>
                    <div className="p-6 bg-gray-900 h-full flex flex-col justify-center">
                        <h3 className="text-white text-2xl font-bold mb-4 text-center">Confirm Final Payment</h3>
                        <div className="bg-white/10 p-6 rounded-xl text-center mb-4">
                            <p className="text-gray-300 mb-2">Final Payment Amount:</p>
                            <p className="text-green-400 text-3xl font-bold">₹{paymentData?.pending_amount}</p>
                        </div>
                        <div className="flex gap-4">
                            <IonButton expand="block" fill="outline" onClick={() => setShowFinalPayment(false)}>
                                Cancel
                            </IonButton>
                            <IonButton expand="block" color="success" onClick={handleFinalPayNow}>
                                Pay Now
                            </IonButton>
                        </div>
                    </div>
                </IonModal>

                <AlertMessage
                    isOpen={alert.show}
                    message={alert.message}
                    onDidDismiss={() => setAlert({ ...alert, show: false })}
                />

                {error && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
                        {error}
                    </div>
                )}
            </IonContent>
        </ProtectedLayout>
    );
};

export default ProcessScreen;
