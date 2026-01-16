import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../utils/supabase/client'

type AuthContextType = {
    user: User | null
    session: Session | null
    loading: boolean
    isAdmin: boolean
    signIn: (email: string, password: string) => Promise<{ error: any }>
    signUp: (email: string, password: string) => Promise<{ error: any }>
    signOut: () => Promise<void>
    signInWithMagicLink: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        console.log('🔍 AuthContext: Starting auth check...')

        // Safety timeout - if nothing happens in 10 seconds, force loading to false
        const safetyTimeout = setTimeout(() => {
            console.warn('⚠️ Auth check timed out after 10s, forcing loading = false')
            setLoading(false)
        }, 10000)

        // Check active session
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
                console.log('✅ Session retrieved:', session ? 'User logged in' : 'No user')
                clearTimeout(safetyTimeout)
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)

                // Check admin status in background (non-blocking)
                if (session?.user) {
                    (async () => {
                        try {
                            const { data } = await supabase
                                .from('profiles')
                                .select('is_admin')
                                .eq('id', session.user.id)
                                .single();

                            if (data) {
                                setIsAdmin(data.is_admin || false);
                            }
                        } catch (err) {
                            console.warn('Could not check admin status:', err);
                        }
                    })();
                }
            })
            .catch((err: Error) => {
                console.error('❌ Session check failed:', err)
                clearTimeout(safetyTimeout)
                setLoading(false)
            })

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)

            // Check admin status in background
            if (session?.user) {
                try {
                    const { data } = await supabase
                        .from('profiles')
                        .select('is_admin')
                        .eq('id', session.user.id)
                        .single()

                    if (data) {
                        setIsAdmin(data.is_admin || false)
                    } else {
                        setIsAdmin(false)
                    }
                } catch (err) {
                    console.warn('Could not check admin status:', err)
                    setIsAdmin(false)
                }
            } else {
                setIsAdmin(false)
            }

            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signIn = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        return { error }
    }

    const signUp = async (email: string, password: string) => {
        const { error } = await supabase.auth.signUp({ email, password })
        return { error }
    }

    const signOut = async () => {
        try {
            console.log('🚪 Logging out...');

            // CRITICAL: Sign out from Supabase FIRST to properly close session
            // Clearing localStorage before signOut can corrupt session state
            const { error } = await supabase.auth.signOut();

            if (error) {
                console.error('❌ Logout error:', error);
                throw error; // Propagate error for proper handling
            }

            // Only clear storage AFTER successful signOut
            console.log('✅ Logged out from Supabase, clearing local cache...');
            localStorage.clear();
            sessionStorage.clear();

            console.log('✅ Logout complete - all data cleared');

            // The auth state change will trigger automatically via onAuthStateChange
            // No need to force navigation - React will handle it
        } catch (error) {
            console.error('❌ Failed to sign out:', error);

            // On error, still attempt cleanup but log warning
            console.warn('⚠️ Attempting force cleanup despite error...');
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (cleanupError) {
                console.error('❌ Cleanup also failed:', cleanupError);
            }

            // Force reload to reset app state
            window.location.href = '/';
        }
    }

    const signInWithMagicLink = async (email: string) => {
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        })
        return { error }
    }

    const value = {
        user,
        session,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        signInWithMagicLink,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
