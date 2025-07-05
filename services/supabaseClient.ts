/**
 * @fileoverview This file initializes and exports the Supabase client.
 * It's the single point of entry for all Supabase interactions.
 */
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase project credentials.
// These are sourced from your Supabase project's API settings.
const supabaseUrl = 'https://ttiyakfaeqtbsnrypgms.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0aXlha2ZhZXF0YnNucnlwZ21zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE2NTIxNjgsImV4cCI6MjA2NzIyODE2OH0.QqAEyHT24NQ1PSa_Uuq_I6ZIvzHUZhnw4LO9UZnkA7U';


/**
 * The Supabase client instance.
 * This object is used to interact with Supabase services like Auth, Database, etc.
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);