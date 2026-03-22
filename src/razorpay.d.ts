/* eslint-disable @typescript-eslint/no-explicit-any */

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
}

declare class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
  on(event: string, callback: (...args: any[]) => void): void;
}

interface Window {
  Razorpay: typeof Razorpay;
}
