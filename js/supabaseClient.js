const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || null;
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || null;

let client = null;

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export async function getSupabaseClient() {
  if (!isSupabaseConfigured()) return null;

  if (!client) {
    let createClientFn = null;
    try {
      const mod = await import('@supabase/supabase-js');
      createClientFn = mod.createClient;
    } catch {
      try {
        const mod = await import('https://esm.sh/@supabase/supabase-js@2');
        createClientFn = mod.createClient;
      } catch (err) {
        console.warn('Could not load Supabase client library:', err);
        return null;
      }
    }

    if (createClientFn) {
      client = createClientFn(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
    }
  }

  return client;
}
