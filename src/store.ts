import { supabase } from './supabaseClient';
import type { Category, Product, Movement, ItemDescription } from './types';
import type { RealtimeChannel, PostgrestError } from '@supabase/supabase-js';

let stockChannel: RealtimeChannel | null
