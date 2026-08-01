import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('tu-proyecto') &&
    !supabaseAnonKey.includes('tu-anon-key'),
)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export const sellerEmail =
  (import.meta.env.VITE_SELLER_EMAIL as string | undefined) ??
  'francisconievas1985@gmail.com'

export const whatsappNumber =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined) ?? ''
