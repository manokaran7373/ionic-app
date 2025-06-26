export const loadRazorpay = (): Promise<any> => {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') {
            reject('Razorpay can only be loaded in the browser');
            return;
        }

        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
            if (window.Razorpay) {
                resolve(window.Razorpay);
            } else {
                reject('Failed to load Razorpay');
            }
        };
        script.onerror = () => reject('Failed to load Razorpay script');

        document.body.appendChild(script);
    });
};
