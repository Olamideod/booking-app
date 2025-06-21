import { createClient } from '@supabase/supabase-js'

// Instructions for Supabase Service Role Key:
// 1. Go to your Supabase project dashboard.
// 2. Navigate to Settings > API.
// 3. Under "Project API keys", find your "service_role" key. It's a secret.
// 4. Add it to your .env.local file like this:
//    SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

// This client is for server-side use ONLY, in places like webhooks or background jobs
// where you need to bypass Row Level Security.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
); 