import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  created_at: string;
  room?: {
    name: string;
    location: string;
    image_urls: string[];
  };
}

export const fetchUserBookings = async (): Promise<Booking[]> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(name, location, image_urls)
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const fetchBookingById = async (id: string): Promise<Booking | null> => {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError || !session) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(name, location, image_urls)
      `)
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
};