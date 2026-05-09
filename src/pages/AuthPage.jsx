import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const accountInfoCards = [
    {
        id: 1,
        title: 'Gyorsabb foglalás',
        text: 'Fiókkal egyszerűbben tudsz időpontot foglalni és visszatérni a fontos oldalakra.',
    },
    {
        id: 2,
        title: 'Átlátható adatok',
        text: 'A bejelentkezett fiókadataid egy helyen jelennek meg, tiszta felületen.',
    },
    {
        id: 3,
        title: 'Kényelmes használat',
        text: 'A szolgáltatások, a foglalások és a kapcsolat oldal gyorsan elérhető innen is.',
    },
]

export default function AuthPage() {
    const { authUser, dbUser, signIn, signUp, signOut } = useAuth()

    const [mode, setMode] = useState('login')
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState('')
    const [authSuccess, setAuthSuccess] = useState('')

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
    })

    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })

    const isLoggedIn = !!authUser

    const handleLoginChange = (event) => {
        const { name, value } = event.target
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleRegisterChange = (event) => {
        const { name, value } = event.target
        setRegisterData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault()
        setAuthError('')
        setAuthSuccess('')

        if (!loginData.email.trim() || !loginData.password) {
            setAuthError('Az email és jelszó megadása kötelező.')
            return
        }

        try {
            setLoading(true)

            await signIn({
                email: loginData.email.trim(),
                password: loginData.password,
            })

            setAuthSuccess('Sikeres bejelentkezés.')
            setLoginData({
                email: '',
                password: '',
            })
        } catch (err) {
            setAuthError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegisterSubmit = async (event) => {
        event.preventDefault()
        setAuthError('')
        setAuthSuccess('')

        if (
            !registerData.fullName.trim() ||
            !registerData.email.trim() ||
            !registerData.password ||
            !registerData.confirmPassword
        ) {
            setAuthError('Minden regisztrációs mező kitöltése kötelező.')
            return
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailPattern.test(registerData.email.trim())) {
            setAuthError('Adj meg egy érvényes email címet.')
            return
        }

        if (registerData.password.length < 6) {
            setAuthError('A jelszónak legalább 6 karakterből kell állnia.')
            return
        }

        if (registerData.password !== registerData.confirmPassword) {
            setAuthError('A két jelszó nem egyezik.')
            return
        }

        try {
            setLoading(true)

            await signUp({
                fullName: registerData.fullName.trim(),
                email: registerData.email.trim(),
                password: registerData.password,
            })

            setAuthSuccess('Sikeres regisztráció. Most már bejelentkezhetsz.')
            setRegisterData({
                fullName: '',
                email: '',
                password: '',
                confirmPassword: '',
            })
            setMode('login')
        } catch (err) {
            setAuthError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleSignOut = async () => {
        setAuthError('')
        setAuthSuccess('')

        try {
            setLoading(true)
            await signOut()
            setAuthSuccess('Sikeres kijelentkezés.')
        } catch (err) {
            setAuthError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="page-shell">
            <div className="page-header">
                <h1>Fiók</h1>
                <p className="page-intro">
                    Jelentkezz be vagy hozz létre fiókot, hogy kényelmesebben kezeld a
                    foglalásaidat és gyorsabban visszatérhess az oldalra.
                </p>
            </div>

            {authError && <div className="alert alert--error">{authError}</div>}
            {authSuccess && <div className="alert alert--success">{authSuccess}</div>}

            <div className="auth-page-center">
                {!isLoggedIn ? (
                    <div className="auth-simple-card">
                        <div className="auth-simple-switch">
                            <button
                                type="button"
                                className={`auth-simple-switch__button ${mode === 'login' ? 'auth-simple-switch__button--active' : ''}`}
                                onClick={() => setMode('login')}
                            >
                                Bejelentkezés
                            </button>

                            <button
                                type="button"
                                className={`auth-simple-switch__button ${mode === 'register' ? 'auth-simple-switch__button--active' : ''}`}
                                onClick={() => setMode('register')}
                            >
                                Regisztráció
                            </button>
                        </div>

                        {mode === 'login' ? (
                            <div className="auth-simple-content">
                                <div className="page-header">
                                    <h2>Bejelentkezés</h2>
                                    <p className="page-intro">
                                        Lépj be a fiókodba, és folytasd ott, ahol abbahagytad.
                                    </p>
                                </div>

                                <form className="app-form" onSubmit={handleLoginSubmit}>
                                    <div className="form-field">
                                        <label htmlFor="login_email">Email</label>
                                        <input
                                            id="login_email"
                                            name="email"
                                            type="email"
                                            value={loginData.email}
                                            onChange={handleLoginChange}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="login_password">Jelszó</label>
                                        <input
                                            id="login_password"
                                            name="password"
                                            type="password"
                                            value={loginData.password}
                                            onChange={handleLoginChange}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="button button--primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Folyamatban...' : 'Bejelentkezés'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="auth-simple-content">
                                <div className="page-header">
                                    <h2>Regisztráció</h2>
                                    <p className="page-intro">
                                        Hozz létre fiókot, hogy gyorsabban tudj foglalni.
                                    </p>
                                </div>

                                <form className="app-form" onSubmit={handleRegisterSubmit}>
                                    <div className="form-field">
                                        <label htmlFor="register_fullName">Név</label>
                                        <input
                                            id="register_fullName"
                                            name="fullName"
                                            type="text"
                                            value={registerData.fullName}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="register_email">Email</label>
                                        <input
                                            id="register_email"
                                            name="email"
                                            type="email"
                                            value={registerData.email}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="register_password">Jelszó</label>
                                        <input
                                            id="register_password"
                                            name="password"
                                            type="password"
                                            value={registerData.password}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>

                                    <div className="form-field">
                                        <label htmlFor="register_confirmPassword">Jelszó újra</label>
                                        <input
                                            id="register_confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            value={registerData.confirmPassword}
                                            onChange={handleRegisterChange}
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            className="button button--primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? 'Folyamatban...' : 'Regisztráció'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="auth-simple-card">
                        <div className="auth-simple-content">
                            <div className="page-header">
                                <h2>Aktív munkamenet</h2>
                                <p className="page-intro">
                                    Jelenleg be vagy jelentkezve. Innen gyorsan továbbléphetsz.
                                </p>
                            </div>

                            <div className="auth-simple-account-grid">
                                <article className="auth-simple-info-box">
                                    <h3>Fiókadatok</h3>
                                    <p><strong>Email:</strong> {dbUser?.email || authUser?.email}</p>
                                    <p><strong>Név:</strong> {dbUser?.full_name || '-'}</p>
                                    <p><strong>Szerepkör:</strong> {dbUser?.role || '-'}</p>
                                </article>

                                <article className="auth-simple-info-box">
                                    <h3>Gyors elérés</h3>
                                    <div className="form-actions">
                                        <Link to="/foglalas" className="button button--primary">
                                            Foglalások
                                        </Link>
                                        <Link to="/szolgaltatasok" className="button button--secondary">
                                            Szolgáltatások
                                        </Link>
                                        <Link to="/kapcsolat" className="button button--secondary">
                                            Kapcsolat
                                        </Link>
                                    </div>
                                </article>
                            </div>

                            <div className="form-actions" style={{ marginTop: '1rem' }}>
                                <button
                                    className="button button--primary"
                                    type="button"
                                    onClick={handleSignOut}
                                    disabled={loading}
                                >
                                    {loading ? 'Kijelentkezés...' : 'Kijelentkezés'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="auth-info-row">
                {accountInfoCards.map((item) => (
                    <article key={item.id} className="auth-info-row__card">
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                    </article>
                ))}
            </div>
        </section>
    )
}