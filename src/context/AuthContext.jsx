import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null)
    const [authUser, setAuthUser] = useState(null)
    const [dbUser, setDbUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const loadDbUser = async (user) => {
        if (!user) {
            setDbUser(null)
            return
        }

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('auth_user_id', user.id)
                .single()

            if (error) {
                console.error('DB user load error:', error.message)
                setDbUser(null)
                return
            }

            setDbUser(data)
        } catch (err) {
            console.error('Unexpected DB user load error:', err)
            setDbUser(null)
        }
    }

    useEffect(() => {
        let isMounted = true

        const init = async () => {
            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession()

                if (!isMounted) return

                setSession(session)
                setAuthUser(session?.user ?? null)
                await loadDbUser(session?.user ?? null)
            } catch (err) {
                console.error('Auth init error:', err)
            } finally {
                if (isMounted) {
                    setLoading(false)
                }
            }
        }

        init()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session)
            setAuthUser(session?.user ?? null)

            setTimeout(() => {
                loadDbUser(session?.user ?? null)
                setLoading(false)
            }, 0)
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [])

    const signUp = async ({ fullName, email, password }) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
            },
        })

        if (error) throw new Error(error.message)
        return data
    }

    const signIn = async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw new Error(error.message)
        return data
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw new Error(error.message)
    }

    return (
        <AuthContext.Provider
            value={{
                session,
                authUser,
                dbUser,
                loading,
                signUp,
                signIn,
                signOut,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}