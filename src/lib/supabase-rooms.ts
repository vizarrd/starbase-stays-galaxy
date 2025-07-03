import { supabase } from '@/integrations/supabase/client';

export interface Room {
  id: string;
  name: string;
  location: string;
  price_per_night: number;
  amenities: string[];
  rating: number;
  description: string;
  image_urls: string[];
  room_type: string;
  max_guests: number;
  created_at: string;
  updated_at: string;
}

export interface RoomFilters {
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  roomType?: string;
  maxGuests?: number;
  location?: string;
}

export const fetchRooms = async (filters?: RoomFilters): Promise<Room[]> => {
  try {
    let query = supabase
      .from('rooms')
      .select('*')
      .order('rating', { ascending: false });

    // Apply filters
    if (filters?.minPrice) {
      query = query.gte('price_per_night', filters.minPrice);
    }
    
    if (filters?.maxPrice) {
      query = query.lte('price_per_night', filters.maxPrice);
    }
    
    if (filters?.roomType && filters.roomType !== 'all') {
      query = query.eq('room_type', filters.roomType);
    }
    
    if (filters?.maxGuests) {
      query = query.gte('max_guests', filters.maxGuests);
    }
    
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }

    // Filter by amenities if specified (PostgreSQL array filtering)
    let filteredData = data || [];
    if (filters?.amenities && filters.amenities.length > 0) {
      filteredData = filteredData.filter(room => 
        filters.amenities!.every(amenity => 
          room.amenities.includes(amenity)
        )
      );
    }

    return filteredData;
  } catch (error) {
    console.error('Error in fetchRooms:', error);
    throw error;
  }
};

export const fetchRoomById = async (id: string): Promise<Room | null> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching room:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in fetchRoomById:', error);
    throw error;
  }
};

export const getAllAmenities = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('amenities');

    if (error) {
      console.error('Error fetching amenities:', error);
      throw error;
    }

    // Extract unique amenities from all rooms
    const allAmenities = new Set<string>();
    data?.forEach(room => {
      room.amenities?.forEach((amenity: string) => {
        allAmenities.add(amenity);
      });
    });

    return Array.from(allAmenities).sort();
  } catch (error) {
    console.error('Error in getAllAmenities:', error);
    return [];
  }
};