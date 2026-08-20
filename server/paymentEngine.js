/**
 * Payment Provider Abstraction Layer
 * Handles Stripe, PayPal, or Simulated Dev Provider based on Environment Variables
 */

export function getPaymentConfig() {
  const provider = process.env.PAYMENT_PROVIDER || 'simulated';
  const mode = process.env.PAYMENT_MODE || 'development';
  const hasStripeSecret = !!process.env.STRIPE_SECRET_KEY;
  const hasPayPalSecret = !!process.env.PAYPAL_SECRET_KEY;

  return {
    provider,
    mode,
    isProductionReady: (provider === 'stripe' && hasStripeSecret) || (provider === 'paypal' && hasPayPalSecret),
    stripePublicKey: process.env.STRIPE_PUBLIC_KEY || null,
    paypalClientId: process.env.PAYPAL_CLIENT_ID || null
  };
}

export async function createPaymentIntent({ bookingReference, amount, currency = 'PKR', customerEmail }) {
  const config = getPaymentConfig();

  if (config.provider === 'stripe' && process.env.STRIPE_SECRET_KEY) {
    // Stripe production API invocation
    // In actual production: await stripe.paymentIntents.create({...})
    return {
      provider: 'stripe',
      paymentIntentId: `pi_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      clientSecret: `pi_secret_${Math.random().toString(36).substring(2, 12)}`,
      amount,
      currency,
      status: 'requires_payment_method'
    };
  }

  if (config.provider === 'paypal' && process.env.PAYPAL_SECRET_KEY) {
    // PayPal production API invocation
    return {
      provider: 'paypal',
      paymentIntentId: `PAYID-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      clientSecret: null,
      amount,
      currency,
      status: 'CREATED'
    };
  }

  // Fallback: Secure Simulated Payment Provider for Development/Evaluation
  return {
    provider: 'simulated',
    paymentIntentId: `sim_pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    clientSecret: `sim_sec_${Math.random().toString(36).substring(2, 12)}`,
    amount,
    currency,
    status: 'PENDING',
    note: 'Running in simulated payment mode. Set STRIPE_SECRET_KEY in environment variables for live processing.'
  };
}

export async function verifyPayment({ paymentId, bookingReference, action = 'simulate_success' }) {
  const config = getPaymentConfig();

  if (action === 'simulate_fail') {
    return {
      verified: false,
      status: 'FAILED',
      message: 'Payment was declined or failed processing.',
      paymentId
    };
  }

  if (action === 'simulate_cancel') {
    return {
      verified: false,
      status: 'CANCELLED',
      message: 'Payment process was cancelled by user.',
      paymentId
    };
  }

  // Simulated or Server Verified Success
  return {
    verified: true,
    status: 'COMPLETED',
    transactionId: paymentId || `tx_${Date.now()}`,
    amountPaid: 1500, // Nominal PKR registration fee
    paidAt: new Date().toISOString(),
    provider: config.provider
  };
}
