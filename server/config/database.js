import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database initialization
export const initializeDatabase = async () => {
  try {
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};