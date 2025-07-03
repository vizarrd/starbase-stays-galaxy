/*
  # Complete Booking and Payment System

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `room_id` (uuid, references rooms)
      - `check_in` (date)
      - `check_out` (date)
      - `total_price` (decimal)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)
    
    - `payments`
      - `id` (uuid, primary key)
      - `booking_id` (uuid, references bookings)
      - `user_id` (uuid, references auth.users)
      - `stripe_payment_id` (text)
      - `amount` (decimal)
      - `status` (text, default 'pending')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add indexes for better performance

  3. Changes
    - Complete booking and payment tracking system
    - Secure row-level security policies
    - Performance optimizations with indexes
*/

-- Create bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  room_id uuid NOT NULL REFERENCES public.rooms(id),
  check_in date NOT NULL,
  check_out date NOT NULL,
  total_price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id),
  user_id uuid NOT NULL,
  stripe_payment_id text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for payments
CREATE POLICY "Users can view their own payments"
  ON public.payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments"
  ON public.payments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_room_id_idx ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS payments_booking_id_idx ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS payments_user_id_idx ON public.payments(user_id);