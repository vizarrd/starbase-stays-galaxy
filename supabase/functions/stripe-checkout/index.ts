import { createClient } from 'npm:@supabase/supabase-js@2';
import Stripe from 'npm:stripe@14';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2023-10-16',
    });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')!;
    
    // Verify the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    const { room_id, check_in, check_out, total_price } = await req.json();

    // Validate required fields
    if (!room_id || !check_in || !check_out || !total_price) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get room details
    const { data: room, error: roomError } = await supabaseClient
      .from('rooms')
      .select('name, location')
      .eq('id', room_id)
      .single();

    if (roomError || !room) {
      return new Response(
        JSON.stringify({ error: 'Room not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create booking record
    const { data: booking, error: bookingError } = await supabaseClient
      .from('bookings')
      .insert({
        user_id: user.id,
        room_id,
        check_in,
        check_out,
        total_price,
        status: 'pending'
      })
      .select()
      .single();

    if (bookingError) {
      return new Response(
        JSON.stringify({ error: 'Failed to create booking' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${room.name}`,
              description: `${room.location} • ${check_in} to ${check_out}`,
            },
            unit_amount: Math.round(total_price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/booking-cancelled`,
      metadata: {
        booking_id: booking.id,
        user_id: user.id,
        room_id: room_id,
      },
    });

    // Create payment record
    const { error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        booking_id: booking.id,
        user_id: user.id,
        stripe_payment_id: session.id,
        amount: total_price,
        status: 'pending'
      });

    if (paymentError) {
      console.error('Failed to create payment record:', paymentError);
    }

    return new Response(
      JSON.stringify({ sessionId: session.id, sessionUrl: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in stripe-checkout:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});