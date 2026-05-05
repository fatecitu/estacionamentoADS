import { createClient } from "@supabase/supabase-js";
//Buscando as chaves
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
//Iniciando o cliente do supabase

export const supabase = createClient(supabaseUrl, supabasePublishableKey)