import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

export function getStripe() {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
      apiVersion: '2025-08-27.basil'
    });
  }

  return stripeInstance;
}