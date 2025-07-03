# 🌟 Starbase Stays - Enhanced Galactic Room Booking Platform with Stripe Payments

A professional Star Wars-themed room booking web application built with modern technologies for an immersive user experience, featuring real Supabase data integration, authentication, and Stripe payment processing.

## 🚀 Features

### Core Functionality
- **30 Unique Room Listings**: Real data fetched from Supabase database
- **Advanced Search & Filtering**: Filter by price, location, amenities, room type, and guest count
- **Room Details Page**: Comprehensive room information with image carousel and booking interface
- **Complete Booking System**: Full booking flow with Stripe payment integration
- **User Authentication**: Email/password and Google OAuth via Supabase Auth
- **Profile Management**: User profiles with booking history and preferences
- **Responsive Design**: Fully responsive for desktop, tablet, and mobile devices

### Payment Integration
- **Stripe Checkout**: Secure payment processing with Stripe
- **Real-time Updates**: Webhook-based booking confirmations
- **Payment Tracking**: Complete payment history and status tracking
- **Booking Management**: View, modify, and cancel bookings

### Star Wars Theme
- **Professional Dark Theme**: Black background (#1A1A1A), deep red accents (#8B0000), electric blue highlights (#00B7EB)
- **Futuristic Fonts**: Orbitron and Exo 2 from Google Fonts
- **Lightsaber Buttons**: Glowing red and blue buttons with hover effects
- **Death Star Loading**: Custom CSS animations for loading states
- **Starfield Background**: Subtle animated starfield background
- **Sound Effects**: Optional lightsaber sound effects with toggle

### Technical Features
- **Real-time Authentication**: Proper auth state management with Supabase
- **Database Integration**: PostgreSQL with Row Level Security (RLS)
- **Edge Functions**: Serverless functions for payment processing
- **Performance Optimized**: Lazy loading, efficient queries, and minimal animations
- **Accessibility**: High contrast, ARIA labels, and keyboard navigation

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Star Wars theme
- **UI Components**: Shadcn-UI with custom variants
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe Checkout + Webhooks
- **Serverless**: Supabase Edge Functions
- **Routing**: React Router DOM
- **State Management**: React hooks + TanStack Query
- **Icons**: Lucide React

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project
- Stripe account

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd starbase-stays
npm install
```

### 2. Supabase Setup

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully initialized

#### Set Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

#### Run Database Migrations
1. In your Supabase dashboard, go to SQL Editor
2. Run the migration files in order:
   - `supabase/migrations/20250703114059_wooden_breeze.sql` (profiles and saved_rooms)
   - `supabase/migrations/20250703115034_old_villa.sql` (rooms with 30 sample listings)
   - `supabase/migrations/20250703120000_booking_payment_tables.sql` (bookings and payments)

#### Configure Authentication
1. In Supabase dashboard, go to Authentication > Settings
2. Add your site URL (e.g., `http://localhost:8080`) to "Site URL"
3. For Google OAuth:
   - Go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

### 3. Stripe Setup

#### Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Get your API keys from the Stripe Dashboard

#### Set Stripe Environment Variables
Add to your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

For Supabase Edge Functions, set these in your Supabase project settings:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### Deploy Edge Functions
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref your-project-ref`
4. Deploy functions:
   ```bash
   supabase functions deploy stripe-checkout
   supabase functions deploy stripe-webhook
   ```

#### Configure Stripe Webhook
1. In Stripe Dashboard, go to Developers > Webhooks
2. Add endpoint: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
3. Select events: `checkout.session.completed`, `checkout.session.expired`
4. Copy webhook secret to Supabase environment variables

### 4. Start Development Server
```bash
npm run dev
```

Navigate to `http://localhost:8080`

## 🗃 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # Navigation with auth state
│   ├── SearchBar.tsx   # Galactic search console
│   ├── RoomCard.tsx    # Room listing cards
│   ├── FiltersSidebar.tsx # Advanced filters
│   └── LoadingSpinner.tsx # Death Star loader
├── pages/
│   ├── Browse.tsx      # Main room browsing page
│   ├── RoomDetails.tsx # Individual room details + booking
│   ├── Auth.tsx        # Login/signup page
│   ├── Profile.tsx     # User profile page
│   ├── Bookings.tsx    # User bookings page
│   ├── BookingSuccess.tsx # Payment success page
│   ├── BookingCancelled.tsx # Payment cancelled page
│   └── NotFound.tsx    # 404 error page
├── lib/
│   ├── auth.ts         # Authentication utilities
│   ├── supabase-rooms.ts # Room data functions
│   ├── stripe.ts       # Stripe integration
│   └── bookings.ts     # Booking management
├── hooks/
│   ├── useAuth.ts      # Authentication hook
│   └── use-toast.ts    # Toast notifications
├── integrations/
│   └── supabase/       # Supabase client and types
└── index.css           # Global styles and Star Wars theme
```

## 🎨 Design System

### Color Palette
- **Background**: Deep space black (#1A1A1A)
- **Primary**: Deep red (#8B0000) for Sith-inspired elements
- **Accent**: Electric blue (#00B7EB) for Jedi-inspired elements
- **Text**: Pure white (#FFFFFF) with gray variants
- **Cards**: Very dark (#0A0A0A) with transparency

### Typography
- **Display**: Orbitron (futuristic, headers)
- **Body**: Exo 2 (readable, content)

### Components
- **Lightsaber Buttons**: Glowing borders with hover effects
- **Death Star Loader**: Rotating sphere with red laser
- **Hover Effects**: Scale and glow transformations
- **Starfield**: CSS-only animated background

## 🔧 Database Schema

### Core Tables

#### Rooms Table
```sql
CREATE TABLE rooms (
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
```

#### Bookings Table
```sql
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  room_id uuid NOT NULL REFERENCES rooms(id),
  check_in date NOT NULL,
  check_out date NOT NULL,
  total_price decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id),
  user_id uuid NOT NULL,
  stripe_payment_id text NOT NULL,
  amount decimal(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
```

### Sample Data
The database includes 30 unique Star Wars-themed accommodations:
- Jedi Suite (Hilton Downtown) - Coruscant District (New York, NY)
- Bounty Hunter Bunk (Urban Loft) - Tatooine Outskirts (Los Angeles, CA)
- Sith Sanctuary (Marriott Elite) - Mustafar Quarter (Chicago, IL)
- And 27 more unique listings...

## 💳 Payment Flow

### Booking Process
1. **Room Selection**: User selects dates and room
2. **Authentication Check**: Redirect to login if not authenticated
3. **Stripe Checkout**: Create secure payment session
4. **Payment Processing**: User completes payment on Stripe
5. **Webhook Confirmation**: Stripe webhook updates booking status
6. **Confirmation**: User sees success page with booking details

### Edge Functions
- **stripe-checkout**: Creates Stripe checkout sessions
- **stripe-webhook**: Handles payment confirmations and updates

## 🔐 Authentication Features

### Supported Methods
- Email/password authentication
- Google OAuth
- Automatic profile creation
- Session persistence

### Auth State Management
- Real-time auth state updates
- Proper loading states
- Automatic redirects
- User display name handling

### Protected Routes
- Profile page requires authentication
- Bookings page requires authentication
- Payment flow requires authentication
- Automatic redirect to login when needed

## 🎮 Features Guide

### Search & Filtering
- **Location Search**: Filter by city or planet names
- **Date Selection**: Check-in/out date picker
- **Guest Count**: Filter by number of travelers
- **Price Range**: Min/max price filters
- **Amenities**: Multi-select amenity filtering
- **Room Type**: Hotel, apartment, or suite

### Room Details & Booking
- **Image Carousel**: Multiple room images with navigation
- **Comprehensive Info**: Full descriptions, amenities, ratings
- **Date Selection**: Interactive calendar for booking dates
- **Price Calculation**: Real-time total calculation
- **Secure Payment**: Stripe-powered checkout process

### Booking Management
- **Booking History**: View all past and upcoming bookings
- **Status Tracking**: Real-time booking status updates
- **Payment History**: Complete payment tracking
- **Booking Modifications**: Modify or cancel bookings

### User Experience
- **Sound Effects**: Optional lightsaber sounds with toggle
- **Loading States**: Death Star spinner for all async operations
- **Toast Notifications**: Feedback for all user actions
- **Keyboard Navigation**: Full accessibility support

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard:
   ```env
   VITE_SUPABASE_URL=your_production_supabase_url
   VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
3. Deploy automatically on push to main branch

### Netlify
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Add environment variables in Netlify dashboard

### Supabase Edge Functions
1. Deploy to production: `supabase functions deploy --project-ref your-project-ref`
2. Set production environment variables in Supabase dashboard
3. Update Stripe webhook URL to production endpoint

## 🔮 Future Enhancements

### Phase 2 Features
- [ ] Advanced booking modifications and cancellations
- [ ] User reviews and ratings system
- [ ] Admin dashboard for room management
- [ ] Email notifications for bookings
- [ ] Calendar integration and availability
- [ ] Advanced search with maps
- [ ] Wishlist/favorites functionality
- [ ] Multi-currency support

### Technical Improvements
- [ ] Progressive Web App (PWA)
- [ ] Image optimization with Supabase Storage
- [ ] Internationalization (i18n)
- [ ] Performance monitoring
- [ ] Unit and integration tests
- [ ] Real-time chat support
- [ ] Advanced analytics

## 🎯 Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML
- **High Contrast**: Color combinations meet WCAG standards
- **Focus Indicators**: Visible focus states
- **Alt Text**: Descriptive image alt text
- **Loading States**: Clear feedback for async operations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is for educational purposes. Star Wars theme elements are inspired by but not copied from copyrighted material.

## 🙏 Credits

- **UI Framework**: [Shadcn-UI](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Payments**: [Stripe](https://stripe.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Images**: [Unsplash](https://unsplash.com/)
- **Fonts**: [Google Fonts](https://fonts.google.com/)

## 🔧 Troubleshooting

### Common Issues

1. **Supabase Connection Error**
   - Verify environment variables are set correctly
   - Check Supabase project URL and anon key
   - Ensure RLS policies are properly configured

2. **Authentication Not Working**
   - Check site URL in Supabase Auth settings
   - Verify OAuth provider configuration
   - Clear browser cache and localStorage

3. **Stripe Payment Issues**
   - Verify Stripe keys are correct (test vs live)
   - Check webhook endpoint URL
   - Ensure webhook secret is set in Supabase
   - Verify Edge Functions are deployed

4. **Edge Functions Not Working**
   - Check function deployment status
   - Verify environment variables in Supabase
   - Check function logs in Supabase dashboard
   - Ensure CORS headers are properly set

5. **Build Errors**
   - Run `npm install` to ensure all dependencies
   - Check TypeScript errors with `npm run build`
   - Verify environment variables for production

---

**May the Force be with your bookings! 🌟**

Built with ❤️ using modern web technologies, Stripe payments, and the power of the Force.