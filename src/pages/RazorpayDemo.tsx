// src/pages/RazorpayDemo.tsx
import {
  IonPage,
  IonContent,
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import React from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayDemo: React.FC = () => {
  const handlePayment = () => {
    const options = {
      key: 'rzp_test_OWMIbAgJMlXJSy', // Replace with your Razorpay key
      amount: 50000, // Amount in paise (50000 = ₹500)
      currency: 'INR',
      name: 'GeoFencing App',
      description: 'Demo Transaction',
      image: 'https://your-logo-url.com/logo.png', // Optional
      handler: function (response: any) {
        alert('Payment Successful! ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'Test User',
        email: 'test@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Test Address'
      },
      theme: {
        color: '#3399cc'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Razorpay Demo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={handlePayment}>
          Pay ₹500
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default RazorpayDemo;
