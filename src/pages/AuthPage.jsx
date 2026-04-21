import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
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

    const switchMode = (newMode) => {
        setMode(newMode)
        setError('')
        setMessage('')
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setMessage('')

        try {
            setSubmitting(true)

            if (mode === 'register') {
                await signUp({
                    fullName: formData.fullName.trim(),
                    email: formData.email.trim(),
                    password: formData.password,
                })

                setMessage(
                    'Sikeres regisztráció. Ha email megerősítés szükséges, nézd meg a postaládádat.'
                )
            } else {
                await signIn({
                    email: formData.email.trim(),
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
            setMessage('Sikeres kijelentkezés.')
        } catch (err) {
            setError(err.message)
        }
    }

    if (loading) {
        return <p>Auth betöltése...</p>
    }

    return (
        <section className="page-shell">
            <div className="page-header">
                <h1>Fiók</h1>
                <p className="page-intro">
                    Itt tudsz bejelentkezni, regisztrálni, vagy megnézni az aktuális
                    fiókadataidat.
                </p>
            </div>

            {error && <div className="alert alert--error">{error}</div>}
            {message && <div className="alert alert--success">{message}</div>}

            {authUser ? (
                <div className="panel">
                    <h2>Aktív munkamenet</h2>

                    <p>
                        <strong>Email:</strong> {authUser.email}
                    </p>
                    <p>
                        <strong>Név:</strong> {dbUser?.full_name || 'Nincs megadva'}
                    </p>
                    <p>
                        <strong>Szerepkör:</strong> {dbUser?.role || 'client'}
                    </p>

                    <div className="form-actions">
                        <button
                            className="button button--primary"
                            type="button"
                            onClick={handleLogout}
                        >
                            Kijelentkezés
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="panel">
                        <div className="form-actions">
                            <button
                                className="button button--secondary"
                                type="button"
                                onClick={() => switchMode('login')}
                            >
                                Bejelentkezés
                            </button>

                            <button
                                className="button button--secondary"
                                type="button"
                                onClick={() => switchMode('register')}
                            >
                                Regisztráció
                            </button>
                        </div>
                    </div>

                    <div className="panel">
                        <h2>{mode === 'login' ? 'Bejelentkezés' : 'Regisztráció'}</h2>

                        <form className="app-form" onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {mode === 'register' && (
                                    <div className="form-field form-field--full">
                                        <label htmlFor="fullName">Teljes név</label>
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

                                <div className="form-field form-field--full">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-field form-field--full">
                                    <label htmlFor="password">Jelszó</label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="button button--primary"
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? 'Folyamatban...'
                                        : mode === 'login'
                                          ? 'Bejelentkezés'
                                          : 'Regisztráció'}
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </section>
    )
}