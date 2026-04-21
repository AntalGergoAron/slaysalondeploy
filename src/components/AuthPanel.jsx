import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

function AuthPanel() {
    const { authUser, dbUser, loading, signUp, signIn, signOut } = useAuth()

    const [mode, setMode] = useState('login')
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
    })
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        try {
            setSubmitting(true)

            if (mode === 'register') {
                await signUp({
                    fullName: formData.fullName,
                    email: formData.email,
                    password: formData.password,
                })

                setMessage(
                    'Sikeres regisztráció. Ha email megerősítés be van kapcsolva, ellenőrizd a leveleidet.'
                )
            } else {
                await signIn({
                    email: formData.email,
                    password: formData.password,
                })

                setMessage('Sikeres bejelentkezés.')
            }

            setFormData({
                fullName: '',
                email: '',
                password: '',
            })
        } catch (err) {
            setError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleLogout = async () => {
        try {
            setError('')
            setMessage('')
            await signOut()
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <p>Auth betöltése...</p>
    }

    if (authUser) {
        return (
            <div>
                <h2>Fiók</h2>
                <p>Bejelentkezve: {authUser.email}</p>
                <p>Szerepkör: {dbUser?.role || 'client'}</p>
                <button type="button" onClick={handleLogout}>
                    Kijelentkezés
                </button>
                {error && <p>Hiba: {error}</p>}
                {message && <p>{message}</p>}
            </div>
        )
    }

    return (
        <div>
            <h2>{mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}</h2>

            <form onSubmit={handleSubmit}>
                {mode === 'register' && (
                    <div>
                        <label htmlFor="fullName">Teljes név:</label>
                        <br />
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div>
                    <label htmlFor="auth_email">Email:</label>
                    <br />
                    <input
                        id="auth_email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="auth_password">Jelszó:</label>
                    <br />
                    <input
                        id="auth_password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                </div>

                <button type="submit" disabled={submitting}>
                    {submitting
                        ? 'Folyamatban...'
                        : mode === 'login'
                            ? 'Bejelentkezés'
                            : 'Regisztráció'}
                </button>
            </form>

            <button
                type="button"
                onClick={() => {
                    setMode((prev) => (prev === 'login' ? 'register' : 'login'))
                    setError('')
                    setMessage('')
                }}
            >
                {mode === 'login'
                    ? 'Nincs fiókod? Regisztrálj'
                    : 'Van már fiókod? Jelentkezz be'}
            </button>

            {error && <p>Hiba: {error}</p>}
            {message && <p>{message}</p>}
        </div>
    )
}

export default AuthPanel