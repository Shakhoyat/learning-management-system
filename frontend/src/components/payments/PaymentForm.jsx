import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { paymentService } from '../../services/payments';
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const paymentSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().default('USD'),
  sessionId: z.string().min(1, 'Session ID is required'),
  paymentMethod: z.enum(['card', 'paypal']),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardholderName: z.string().optional()
});

const PaymentForm = ({ session, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: session?.price || 0,
      currency: 'USD',
      sessionId: session?._id,
      paymentMethod: 'card'
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const paymentData = {
        ...data,
        session: session._id,
        description: `Payment for session: ${session.title}`
      };

      const result = await paymentService.createPayment(paymentData);

      toast.success('Payment processed successfully!');
      onSuccess?.(result);
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Complete Payment
        </h3>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Session:</span>
            <span className="font-medium">{session?.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-lg font-bold text-green-600">
              ${session?.price || 0}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-colors ${paymentMethod === 'card'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
              }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={paymentMethod === 'card'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <CreditCardIcon className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Credit Card</span>
            </label>

            <label className={`cursor-pointer rounded-lg border-2 p-3 text-center transition-colors ${paymentMethod === 'paypal'
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-300 hover:border-gray-400'
              }`}>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="sr-only"
              />
              <div className="h-6 w-6 mx-auto mb-2 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                PP
              </div>
              <span className="text-sm font-medium">PayPal</span>
            </label>
          </div>
        </div>

        {/* Credit Card Form */}
        {paymentMethod === 'card' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                {...register('cardNumber', {
                  required: paymentMethod === 'card' ? 'Card number is required' : false
                })}
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.cardNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.cardNumber.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  {...register('expiryDate', {
                    required: paymentMethod === 'card' ? 'Expiry date is required' : false
                  })}
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.expiryDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  {...register('cvv', {
                    required: paymentMethod === 'card' ? 'CVV is required' : false
                  })}
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.cvv && (
                  <p className="mt-1 text-sm text-red-600">{errors.cvv.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                {...register('cardholderName', {
                  required: paymentMethod === 'card' ? 'Cardholder name is required' : false
                })}
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.cardholderName && (
                <p className="mt-1 text-sm text-red-600">{errors.cardholderName.message}</p>
              )}
            </div>
          </>
        )}

        {/* Security Notice */}
        <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <LockClosedIcon className="h-5 w-5 mr-2" />
          <span>Your payment information is secure and encrypted</span>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Pay $${session?.price || 0}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;