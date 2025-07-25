import { supabase } from './supabaseClient';

export async function fetchCars() {
  const { data, error } = await supabase
    .from('cars')
    .select(`
      *,
      images (
        url,
        is_primary
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('فشل في جلب السيارات');
  }

  return data;
} 