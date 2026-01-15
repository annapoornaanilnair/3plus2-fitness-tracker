/* SECURITY UPDATE: Keys moved to environment variables */

export const projectId = "ngsvaqyttrfvsivvdhtc"

// Load from environment variables (set in .env.local)
export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ""
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ""

// Validate configuration
if (!publicAnonKey) {
    console.error('ERROR: VITE_SUPABASE_ANON_KEY not found in environment variables. Please check .env.local')
}