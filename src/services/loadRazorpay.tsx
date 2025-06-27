// src/services/loadRazorpay.ts
export const loadRazorpay = (): Promise<any> => {
  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve((window as any).Razorpay);
      document.body.appendChild(script);
    } else {
      resolve((window as any).Razorpay);
    }
  });
};
