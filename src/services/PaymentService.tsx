
import { useState } from 'react';
import { loadRazorpay } from './loadRazorpay';
import { API_ENDPOINTS } from '../components/config/constants';
import { useAuth } from '../components/AuthContext';
import { useIonRouter } from '@ionic/react';
import { PaymentData, RequestData } from './types/PaymentTypes';

export interface PaymentCallbacks {
  setPaymentStep?: (step: string) => void;
  setAlert?: (alertData: { show: boolean; message: string }) => void;
  setShowSuccess?: (val: boolean) => void;
  setSuccessMessage?: (msg: string) => void;
  setError?: (err: string) => void;
}

const usePaymentService = () => {
  const { axiosInstance } = useAuth();
  const router = useIonRouter();
  const [requestData, setRequestData] = useState<RequestData | null>(null);

  const handleAdvancePayment = async (
    requestData: RequestData,
    callbacks: PaymentCallbacks
  ): Promise<void> => {
    const { setPaymentStep, setAlert, setError } = callbacks;

    try {
      const response = await axiosInstance.post(`/${API_ENDPOINTS.CREATE_ADVANCE_PAYMENT}`, {
        request_id: requestData.request_id
      });

      if (response.data.status === 'success') {
        const options = {
          key: response.data.data.key,
          amount: response.data.data.amount,
          currency: 'INR',
          name: 'GeoSearch Satellite',
          description: 'Advance Payment for Satellite Image',
          order_id: response.data.data.order_id,
          handler: async (rzpResponse: any) => {
            const verifyResponse = await axiosInstance.post(`/${API_ENDPOINTS.VERIFY_ADVANCE_PAYMENT}`, {
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_signature: rzpResponse.razorpay_signature
            });

            if (verifyResponse.data.status === 'success') {
              setAlert?.({
                show: true,
                message: 'Payment successful! Redirecting to processing page...'
              });

              setTimeout(() => {
                router.push('/process-image', 'root');
              }, 2000); 
            }
          }
        };

        const rzp = await loadRazorpay();
        const paymentObject = new rzp(options);
        paymentObject.open();
      }
    } catch (error: any) {
      console.error('Advance payment error:', error);
      setError?.('Failed to process payment');
    }
  };


  const handleFinalPayment = async (
    paymentData: { payment_id: string },
    callbacks: PaymentCallbacks
  ): Promise<void> => {
      const { setPaymentStep, setAlert, setError } = callbacks;
    try {
      const response = await axiosInstance.post(`/${API_ENDPOINTS.CREATE_FINAL_PAYMENT}`, {
        payment_id: paymentData.payment_id
      });

      if (response.data.status === 'success') {
        const rzp = await loadRazorpay();

        const options = {
          key: response.data.data.key,
          amount: response.data.data.amount,
          currency: 'INR',
          name: 'GeoSearch Satellite',
          description: 'Final Payment for Satellite Image',
          order_id: response.data.data.order_id,
          handler: async (rzpResponse: any) => {
            const verifyResponse = await axiosInstance.post(`/${API_ENDPOINTS.VERIFY_FINAL_PAYMENT}`, {
              razorpay_payment_id: rzpResponse.razorpay_payment_id,
              razorpay_order_id: rzpResponse.razorpay_order_id,
              razorpay_signature: rzpResponse.razorpay_signature
            });

            if (verifyResponse.data.status === 'success') {
            setAlert?.({
                show: true,
                message: 'Payment completed! Redirecting...'
              });

              setTimeout(() => {
                router.push('/satellite-map', 'root', 'replace');
              }, 2000);
            }
          },
          theme: {
            color: '#38b2ac'
          }
        };

        const paymentObject = new rzp(options);
        paymentObject.open();
      }
    } catch (err: any) {
      console.error('Final Payment Failed:', err);
      callbacks.setError?.('Final payment failed. Please try again.');
    }
  };

  return {
    handleAdvancePayment,
    handleFinalPayment
  };
};

export default usePaymentService;
