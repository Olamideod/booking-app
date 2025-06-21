import { createClient } from '@supabase/supabase-js'

// Instructions:
// 1. Go to your Supabase project dashboard.
// 2. Navigate to Settings > API.
// 3. Find your Project URL and anon key.
// 4. Create a .env.local file in your project root.
// 5. Add the following lines to your .env.local file:
//    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 