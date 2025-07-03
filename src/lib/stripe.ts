import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface BookingData {
  room_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
}

export const createCheckoutSession = async (bookingData: BookingData) => {
  try {
    // Get the current session
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw new Error('Authentication required');
    }

    // Call the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: bookingData,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    if (!data.sessionId) {
      throw new Error('Failed to create checkout session');
    }

    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    const { error: stripeError } = await stripe.redirectToCheckout({
      sessionId: data.sessionId,
    });

    if (stripeError) {
      throw stripeError;
    }

  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const getStripeSession = async (sessionId: string) => {
  try {
    // In a real app, you'd call your backend to retrieve session details
    // For now, we'll return a mock response
    return {
      id: sessionId,
      payment_status: 'paid',
      customer_details: {
        email: 'user@example.com',
      },
    };
  } catch (error) {
    console.error('Error retrieving Stripe session:', error);
    throw error;
  }
};