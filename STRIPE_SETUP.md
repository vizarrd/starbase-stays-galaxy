# 🚀 Stripe Integration Setup Guide

This guide will help you set up Stripe payments for your Star Wars-themed room booking app.

## 📋 Prerequisites

- Supabase project with the room booking app deployed
- Stripe account (free to create at [stripe.com](https://stripe.com))
- Basic understanding of webhooks

## 🔧 Step 1: Stripe Account Setup

### 1.1 Create Stripe Account
1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account verification process
3. Navigate to the Stripe Dashboard

### 1.2 Get API Keys
1. In Stripe Dashboard, go to **Developers > API keys**
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

## 🗄️ Step 2: Supabase Database Setup

### 2.1 Run Migration
Execute the booking and payment tables migration:

```sql
-- Run this in your Supabase SQL Editor
-- File: supabase/migrations/20250703120000_booking_payment_tables.sql
```

### 2.2 Verify Tables
Check that these tables were created:
- `bookings` - Stores booking information
- `payments` - Tracks payment status

## ⚡ Step 3: Deploy Edge Functions

### 3.1 Install Supabase CLI
```bash
npm install -g supabase
```

### 3.2 Login and Link Project
```bash
supabase login
supabase link --project-ref your-project-ref
```

### 3.3 Deploy Functions
```bash
supabase functions deploy stripe-checkout
supabase functions deploy stripe-webhook
```

## 🔐 Step 4: Environment Variables

### 4.1 Frontend Environment Variables
Add to your `.env` file:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

### 4.2 Supabase Environment Variables
In your Supabase dashboard, go to **Settings > Edge Functions** and add:
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 🔗 Step 5: Webhook Configuration

### 5.1 Create Webhook Endpoint
1. In Stripe Dashboard, go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Enter endpoint URL: `https://your-project-ref.supabase.co/functions/v1/stripe-webhook`
4. Select events to send:
   - `checkout.session.completed`
   - `checkout.session.expired`

### 5.2 Get Webhook Secret
1. After creating the webhook, click on it
2. Copy the **Signing secret** (starts with `whsec_`)
3. Add this to your Supabase environment variables as `STRIPE_WEBHOOK_SECRET`

## 🧪 Step 6: Testing

### 6.1 Test Mode
- Use Stripe test cards for testing
- Test card number: `4242 4242 4242 4242`
- Use any future expiry date and any CVC

### 6.2 Test Booking Flow
1. Browse rooms in your app
2. Select a room and dates
3. Click "Book Now"
4. Complete payment with test card
5. Verify booking appears in "My Bookings"

## 🚀 Step 7: Production Deployment

### 7.1 Switch to Live Mode
1. In Stripe Dashboard, toggle to **Live mode**
2. Get your live API keys
3. Update environment variables with live keys

### 7.2 Update Webhook
1. Create a new webhook for production
2. Use your production domain
3. Update `STRIPE_WEBHOOK_SECRET` with live webhook secret

## 🔍 Troubleshooting

### Common Issues

**1. Webhook not receiving events**
- Check webhook URL is correct
- Verify webhook secret in Supabase environment variables
- Check Supabase function logs

**2. Payment not completing**
- Verify Stripe keys are correct (test vs live)
- Check browser console for errors
- Verify user is authenticated

**3. Booking not updating**
- Check webhook is receiving events
- Verify database policies allow updates
- Check Supabase function logs

### Debug Tools

**Stripe Dashboard**
- View webhook delivery attempts
- See payment details and status
- Check event logs

**Supabase Dashboard**
- View Edge Function logs
- Check database records
- Monitor real-time updates

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

## 🎯 Next Steps

After successful setup:
1. Customize booking confirmation emails
2. Add booking modification features
3. Implement refund handling
4. Add booking analytics
5. Set up monitoring and alerts

---

**May the Force be with your payments! 💳⚡**