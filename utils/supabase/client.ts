import { createClient } from '@supabase/supabase-js'
import { supabaseUrl, publicAnonKey } from './info'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, publicAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
    }
})

// Type-safe auth helpers
export type AuthUser = {
    id: string
    email: string
    created_at: string
}

export type AuthSession = {
    user: AuthUser
    access_token: string
}

// Auth utility functions
export const authHelpers = {
    // Get current user
    getCurrentUser: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    },

    // Sign up with email/password
    signUp: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
        return { data, error }
    },

    // Sign in with email/password
    signIn: async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        return { data, error }
    },

    // Sign in with magic link (passwordless)
    signInWithMagicLink: async (email: string) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        })
        return { data, error }
    },

    // Sign out
    signOut: async () => {
        const { error } = await supabase.auth.signOut()
        return { error }
    },

    // Reset password
    resetPassword: async (email: string) => {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        return { data, error }
    },

    // Update password
    updatePassword: async (newPassword: string) => {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        })
        return { data, error }
    }
}
