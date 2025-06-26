
import { useState } from 'react';
import { loadRazorpay } from './loadRazorpay';
import { useIonRouter } from '@ionic/react';
import { useAuth } from '../components/AuthContext';
import { API_ENDPOINTS } from '../components/config/constants';

import { PaymentCallbacks, RequestData, PaymentData } from './types/PaymentTypes';

const PaymentService = () => {
  const router = useIonRouter();
  const { axiosInstance } = useAuth();
  const [alert, setAlert] = useState({ show: false, message: '' });

  const handleAdvancePayment = async (
    requestData: RequestData,
    callbacks: PaymentCallbacks
  ): Promise<void> => {
    const { setPaymentStep } = callbacks;

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
              setPaymentStep?.('processing');
              setAlert({
                show: true,
                message: 'Advance payment successful! Your request is being processed.'
              });
            }
          }
        };

        const rzp = await loadRazorpay();
        const paymentObject = new rzp(options);
        paymentObject.open();
      }
    } catch (error: any) {
      console.error('Advance payment error:', error);
    }
  };

  const handleFinalPayment = async (
    paymentData: PaymentData,
    callbacks: PaymentCallbacks
  ): Promise<void> => {
    try {
      const response = await axiosInstance.post(`/${API_ENDPOINTS.CREATE_FINAL_PAYMENT}`, {
        payment_id: paymentData.payment_id
      });

      if (response.data.status === 'success') {
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
              setAlert({
                show: true,
                message: 'Payment completed! Redirecting to your images...'
              });

              setTimeout(() => {
                router.push('/satellite-map', 'root', 'replace');
              }, 2000);
            }
          }
        };

        const rzp = await loadRazorpay();
        const paymentObject = new rzp(options);
        paymentObject.open();
      }
    } catch (error: any) {
      console.error('Final payment error:', error);
    }
  };


  return {
    handleAdvancePayment,
    handleFinalPayment,
  };
};

export default PaymentService;
