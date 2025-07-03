/*
  # Create rooms table for Star Wars themed accommodations

  1. New Tables
    - `rooms`
      - `id` (uuid, primary key)
      - `name` (text, room name like "Jedi Suite")
      - `location` (text, location description)
      - `price_per_night` (decimal, price in credits)
      - `amenities` (text array, list of amenities)
      - `rating` (decimal, star rating out of 5)
      - `description` (text, detailed description)
      - `image_urls` (text array, array of image URLs)
      - `room_type` (text, hotel/apartment/suite)
      - `max_guests` (integer, maximum occupancy)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `rooms` table
    - Add policy for public read access (rooms are publicly viewable)
*/

CREATE TABLE IF NOT EXISTS public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  price_per_night decimal(10,2) NOT NULL,
  amenities text[] DEFAULT '{}',
  rating decimal(3,2) DEFAULT 0,
  description text,
  image_urls text[] DEFAULT '{}',
  room_type text DEFAULT 'hotel',
  max_guests integer DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- Allow public read access to rooms
CREATE POLICY "Rooms are publicly viewable"
  ON public.rooms
  FOR SELECT
  TO public
  USING (true);

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_rooms_updated_at ON public.rooms;
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert 30 Star Wars themed rooms
INSERT INTO public.rooms (name, location, price_per_night, amenities, rating, description, image_urls, room_type, max_guests) VALUES
('Jedi Suite (Hilton Downtown)', 'Coruscant District (New York, NY)', 150.00, '{"Wi-Fi","Pool","Meditation Chamber","City View"}', 4.8, 'Luxurious suite in the heart of Coruscant with panoramic city views and a private meditation chamber.', '{"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"}', 'suite', 2),

('Bounty Hunter Bunk (Urban Loft)', 'Tatooine Outskirts (Los Angeles, CA)', 75.00, '{"Parking","Weapon Storage","Desert View"}', 4.2, 'Cozy loft perfect for the traveling bounty hunter with secure storage facilities.', '{"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"}', 'apartment', 1),

('Sith Sanctuary (Marriott Elite)', 'Mustafar Quarter (Chicago, IL)', 200.00, '{"Wi-Fi","Gym","Dark Chamber","Lightning View"}', 4.9, 'Premium suite with dark elegance and commanding views of the city skyline.', '{"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop"}', 'suite', 2),

('Rebel Base (Airbnb Hideout)', 'Yavin Hub (Miami, FL)', 120.00, '{"Wi-Fi","Breakfast","Command Center","Ocean View"}', 4.5, 'Strategic oceanfront location perfect for planning your next mission.', '{"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"}', 'apartment', 4),

('Smuggler''s Den (Boutique Inn)', 'Corellia Bay (San Francisco, CA)', 90.00, '{"Parking","Pet-Friendly","Hidden Compartments","Bay View"}', 4.3, 'Discrete hideout with secret compartments and stunning bay views.', '{"https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=600&fit=crop"}', 'apartment', 3),

('Imperial Command Suite (Ritz Carlton)', 'Death Star District (Las Vegas, NV)', 300.00, '{"Wi-Fi","Butler Service","Hologram Theater","Strip View"}', 4.7, 'Rule the galaxy from this opulent Imperial suite with personal butler service.', '{"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=600&fit=crop"}', 'suite', 2),

('Ewok Village Treehouse (Eco Lodge)', 'Endor Forest (Portland, OR)', 85.00, '{"Wi-Fi","Nature Trails","Tree Canopy","Forest View"}', 4.6, 'Unique treehouse experience in the heart of the forest canopy.', '{"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"}', 'apartment', 4),

('Mandalorian Fortress (Secure Hotel)', 'Mandalore Heights (Denver, CO)', 180.00, '{"Wi-Fi","Security System","Armory","Mountain View"}', 4.8, 'Fortified accommodation with state-of-the-art security systems.', '{"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"}', 'hotel', 2),

('Cantina Quarters (Hostel)', 'Mos Eisley (Phoenix, AZ)', 45.00, '{"Wi-Fi","Shared Kitchen","Live Music","Desert View"}', 4.0, 'Budget-friendly quarters above the famous cantina with live entertainment.', '{"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop"}', 'hotel', 6),

('Cloud City Penthouse (Luxury High-Rise)', 'Bespin Towers (Seattle, WA)', 250.00, '{"Wi-Fi","Sky Lounge","Cloud Views","Concierge"}', 4.9, 'Floating above the clouds with breathtaking aerial views of the city.', '{"https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=600&fit=crop"}', 'suite', 3),

('Droid Workshop (Tech Hostel)', 'Coruscant Tech District (Austin, TX)', 65.00, '{"Wi-Fi","Tech Lab","Charging Stations","City View"}', 4.1, 'Perfect for tech enthusiasts with fully equipped workshop facilities.', '{"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"}', 'hotel', 4),

('Padawan Dormitory (Student Housing)', 'Jedi Temple (Boston, MA)', 55.00, '{"Wi-Fi","Study Rooms","Training Grounds","Garden View"}', 4.3, 'Shared accommodation for young learners with training facilities.', '{"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop"}', 'hotel', 8),

('Hutt Palace Suite (Luxury Resort)', 'Tatooine Oasis (Las Vegas, NV)', 280.00, '{"Wi-Fi","Pool","Spa","Entertainment","Desert View"}', 4.6, 'Opulent desert palace with world-class entertainment and amenities.', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"}', 'suite', 4),

('Wookiee Tree Lodge (Forest Retreat)', 'Kashyyyk Canopy (Olympic National Park, WA)', 110.00, '{"Wi-Fi","Nature Trails","Tree House","Forest View"}', 4.7, 'Elevated forest retreat among the ancient trees of Kashyyyk.', '{"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"}', 'apartment', 3),

('Stormtrooper Barracks (Military Hotel)', 'Imperial Base (San Diego, CA)', 70.00, '{"Wi-Fi","Gym","Mess Hall","Ocean View"}', 4.0, 'Disciplined accommodation with military precision and ocean access.', '{"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"}', 'hotel', 2),

('Naboo Royal Suite (Palace Hotel)', 'Theed Palace (New Orleans, LA)', 220.00, '{"Wi-Fi","Royal Gardens","Spa","River View"}', 4.8, 'Elegant royal accommodation with beautiful gardens and river views.', '{"https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"}', 'suite', 2),

('Tusken Raider Camp (Desert Lodge)', 'Jundland Wastes (Sedona, AZ)', 80.00, '{"Parking","Desert Tours","Stargazing","Canyon View"}', 4.2, 'Authentic desert experience with guided tours and stargazing.', '{"https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=600&fit=crop"}', 'apartment', 4),

('Corellian Freighter Cabin (Unique Stay)', 'Corellia Shipyards (Long Beach, CA)', 95.00, '{"Wi-Fi","Ship Tours","Harbor View","Parking"}', 4.4, 'Sleep aboard a converted freighter with authentic spaceship experience.', '{"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"}', 'apartment', 2),

('Dagobah Swamp Hut (Eco Retreat)', 'Dagobah Wetlands (Everglades, FL)', 60.00, '{"Nature Trails","Meditation","Swamp Tours","Wildlife View"}', 4.1, 'Minimalist retreat in the heart of nature for spiritual reflection.', '{"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"}', 'apartment', 1),

('Alderaan Embassy (Diplomatic Hotel)', 'Aldera District (Washington, DC)', 160.00, '{"Wi-Fi","Conference Rooms","Diplomatic Services","Monument View"}', 4.6, 'Elegant diplomatic accommodation in the heart of the capital.', '{"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"}', 'hotel', 2),

('Hoth Ice Hotel (Arctic Experience)', 'Echo Base (Anchorage, AK)', 130.00, '{"Wi-Fi","Heated Rooms","Ice Bar","Aurora View"}', 4.5, 'Unique ice hotel experience with heated accommodations and aurora viewing.', '{"https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop"}', 'hotel', 2),

('Kamino Research Station (Modern Hotel)', 'Tipoca City (Miami Beach, FL)', 140.00, '{"Wi-Fi","Research Lab","Ocean View","Storm Watching"}', 4.3, 'Modern oceanfront facility perfect for research and relaxation.', '{"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"}', 'hotel', 2),

('Geonosis Arena Suite (Sports Hotel)', 'Petranaki Arena (Phoenix, AZ)', 100.00, '{"Wi-Fi","Sports Complex","Arena View","Gym"}', 4.2, 'Sports-themed accommodation overlooking the famous arena.', '{"https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop"}', 'hotel', 4),

('Mustafar Mining Lodge (Industrial Stay)', 'Mustafar Mines (Yellowstone, WY)', 85.00, '{"Wi-Fi","Geothermal Spa","Volcano View","Mining Tours"}', 4.0, 'Industrial lodge with unique geothermal features and volcano views.', '{"https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=600&fit=crop"}', 'apartment', 3),

('Ryloth Underground (Cave Hotel)', 'Ryloth Caverns (Carlsbad, NM)', 75.00, '{"Wi-Fi","Cave Tours","Underground Pool","Unique Architecture"}', 4.4, 'Unique underground accommodation carved into natural cave systems.', '{"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"}', 'apartment', 2),

('Mon Calamari Depths (Underwater Hotel)', 'Mon Cala (Key Largo, FL)', 190.00, '{"Wi-Fi","Underwater Views","Diving","Marine Life"}', 4.7, 'Submerged accommodation with stunning underwater views and marine life.', '{"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"}', 'suite', 2),

('Jakku Scavenger Shelter (Budget Stay)', 'Jakku Outpost (Barstow, CA)', 40.00, '{"Parking","Desert Survival","Scavenging Tours","Sunset View"}', 3.8, 'Basic shelter for budget travelers with authentic desert survival experience.', '{"https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=600&fit=crop"}', 'hotel', 2),

('Crait Crystal Cave (Luxury Cave)', 'Crait Mines (Salt Lake City, UT)', 170.00, '{"Wi-Fi","Crystal Tours","Salt Spa","Mountain View"}', 4.6, 'Luxury cave accommodation with natural crystal formations and spa services.', '{"https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop"}', 'suite', 2),

('Scarif Beach Resort (Tropical Paradise)', 'Scarif Shores (Maui, HI)', 240.00, '{"Wi-Fi","Beach Access","Water Sports","Tropical View"}', 4.8, 'Tropical paradise with pristine beaches and crystal-clear waters.', '{"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop"}', 'suite', 4),

('Kessel Spice Mine (Adventure Lodge)', 'Kessel Run (Death Valley, CA)', 90.00, '{"Wi-Fi","Adventure Tours","Desert Racing","Star View"}', 4.1, 'Adventure lodge for thrill-seekers with desert racing and extreme sports.', '{"https://images.unsplash.com/photo-1520637836862-4d197d17c97a?w=800&h=600&fit=crop"}', 'apartment', 3);