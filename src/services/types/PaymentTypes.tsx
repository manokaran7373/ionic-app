
export interface RequestData {
    request_id: string;
}

export interface PaymentData {
    payment_id: string;
    pending_amount?: number;
    latitude: string;
    longitude: string;
    coverage_area: string;
    image_status: string;
}
// types/PaymentTypes.ts
export interface FinalPaymentPayload {
  payment_id: string;
  amount: number;
}


export interface PaymentCallbacks {
    setPaymentStep?: (step: string) => void;
    setShowSuccess: (show: boolean) => void;
    setSuccessMessage: (msg: string) => void;
    setError: (msg: string) => void;
    navigate?: (path: string) => void;
    setAlert?: (alert: { show: boolean; message: string }) => void;
}
