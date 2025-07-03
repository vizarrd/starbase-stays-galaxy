/*
  # Database Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique)
      - `display_name` (text)
      - `email` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `saved_rooms`
      - `id` (uuid, primary key)
      - `user_id` (uuid)
      - `room_id` (text)
      - `room_name` (text)
      - `room_location` (text)
      - `room_price` (integer)
      - `room_image` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data

  3. Functions and Triggers
    - Auto-update timestamp function
    - Auto-create profile on user signup
*/

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create saved_rooms table for bookmarked rooms
CREATE TABLE IF NOT EXISTS public.saved_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  room_id TEXT NOT NULL,
  room_name TEXT NOT NULL,
  room_location TEXT NOT NULL,
  room_price INTEGER NOT NULL,
  room_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, room_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_rooms ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles (drop existing ones first to avoid conflicts)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
END $$;

CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policies for saved_rooms (drop existing ones first to avoid conflicts)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own saved rooms" ON public.saved_rooms;
  DROP POLICY IF EXISTS "Users can save rooms" ON public.saved_rooms;
  DROP POLICY IF EXISTS "Users can remove their saved rooms" ON public.saved_rooms;
END $$;

CREATE POLICY "Users can view their own saved rooms" 
ON public.saved_rooms 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can save rooms" 
ON public.saved_rooms 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their saved rooms" 
ON public.saved_rooms 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates (drop existing first)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$;

-- Trigger the function every time a user is created (drop existing first)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();