'use client';

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { CreditCard, Loader2 } from 'lucide-react';
import Magnetic from '@/components/ui/Magnetic';

interface CheckoutFormProps {
  amount: number;
  currency?: string;
  bookingId: string;
}

export default function CheckoutForm({ amount, currency = 'usd', bookingId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe is not fully initialized. Please try again!');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    // Form validation check
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message || 'Validation failed. Please verify your details.');
      setIsLoading(false);
      return;
    }

    // Confirm Payment
    const redirectUrl = `${window.location.origin}/checkout/${bookingId}/status`;
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: redirectUrl,
      },
    });

    // If we reach here, there was a problem with the transaction immediately
    if (error) {
      setErrorMessage(error.message || 'An error occurred during payment processing.');
      toast.error(error.message || 'Payment failed.');
    } else {
      toast.success('Payment completed successfully!');
    }

    setIsLoading(false);
  };

  // Convert amount from cents if needed, but Bangladesh Taka / USD display
  const displayAmount = currency?.toLowerCase() === 'usd' ? amount : amount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Payment Input Element */}
      <div className="bg-[#050811] p-5 rounded-2xl border border-slate-900 shadow-inner">
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Show immediate Stripe validations/errors */}
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-[11px] font-semibold text-center animate-pulse">
          {errorMessage}
        </div>
      )}

      {/* Pay Now Premium Action Button */}
      <div className="pt-2">
        <Magnetic range={15} actionStrength={0.2}>
          <Button
            type="submit"
            disabled={!stripe || isLoading}
            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-[#1e6b3e] hover:from-emerald-500 hover:to-[#195933] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-950/40 border border-emerald-500/10 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin text-emerald-300" />
                <span>Authorizing Payment...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-4.5 w-4.5" />
                <span>
                  Pay Now {currency?.toUpperCase() === 'USD' ? '$' : '৳'}
                  {displayAmount}
                </span>
              </>
            )}
          </Button>
        </Magnetic>
      </div>

      <p className="text-[10px] text-slate-500 font-semibold text-center select-none leading-relaxed">
        Payments are securely processed by Stripe. Your credentials are fully encrypted and never stored
        locally.
      </p>
    </form>
  );
}
