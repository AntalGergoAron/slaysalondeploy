import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const authHighlights = [
    {
        id: 1,
        title: 'Egyszerű hozzáférés',
        text: 'Egy fiókkal gyorsabban foglalhatsz és egy helyen láthatod a saját adataidat.',
    },
    {
        id: 2,
        title: 'Gyors újrafoglalás',
        text: 'A rendszer segít abban, hogy könnyebben visszatalálj a foglalási folyamathoz.',
    },
    {
        id: 3,
        title: 'Átlátható fióknézet',
        text: 'A bejelentkezett munkamenet és az alapadataid jól láthatóan megjelennek.',
    },
]

export default function AuthPage() {
    const { authUser, dbUser, signIn, signUp, signOut } = useAuth()

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

    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState('')
    const [authSuccess, setAuthSuccess] = useState('')

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
                    Itt tudsz bejelentkezni, regisztrálni, vagy megnézni az aktuális
                    fiókadataidat.
                </p>
            </div>

            <div className="service-page-top-grid">
                {authHighlights.map((item) => (
                    <article className="service-page-info-card" key={item.id}>
                        <h3>{item.title}</h3>
                        <p className="service-page-note">{item.text}</p>
                    </article>
                ))}
            </div>

            {authError && <div className="alert alert--error">{authError}</div>}
            {authSuccess && <div className="alert alert--success">{authSuccess}</div>}

            {isLoggedIn ? (
                <>
                    <div className="panel">
                        <div className="page-header">
                            <h2>Aktív munkamenet</h2>
                            <p className="page-intro">
                                Jelenleg be vagy jelentkezve. Innen gyorsan tovább tudsz lépni
                                a foglalási vagy szolgáltatási oldalra.
                            </p>
                        </div>

                        <div className="service-page-bottom-grid">
                            <article className="service-page-info-card">
                                <h3>Fiókadatok</h3>
                                <p><strong>Email:</strong> {dbUser?.email || authUser?.email}</p>
                                <p><strong>Név:</strong> {dbUser?.full_name || '-'}</p>
                                <p><strong>Szerepkör:</strong> {dbUser?.role || '-'}</p>
                            </article>

                            <article className="service-page-info-card">
                                <h3>Gyors műveletek</h3>
                                <div className="form-actions">
                                    <Link to="/foglalas" className="button button--primary">
                                        Foglalások
                                    </Link>
                                    <Link to="/szolgaltatasok" className="button button--secondary">
                                        Szolgáltatások
                                    </Link>
                                </div>
                            </article>

                            <article className="service-page-info-card">
                                <h3>Kapcsolat</h3>
                                <p className="service-page-note">
                                    Ha egyedi kérdésed van, a kapcsolat oldalon üzenetet is tudsz
                                    küldeni.
                                </p>
                                <div className="form-actions" style={{ marginTop: '1rem' }}>
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
                </>
            ) : (
                <div className="service-page-bottom-grid">
                    <div className="panel">
                        <div className="page-header">
                            <h2>Bejelentkezés</h2>
                            <p className="page-intro">
                                Ha már van fiókod, itt tudsz belépni.
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

                    <div className="panel">
                        <div className="page-header">
                            <h2>Regisztráció</h2>
                            <p className="page-intro">
                                Hozz létre fiókot, hogy gyorsabban foglalhass és lásd a saját
                                adataidat.
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
                </div>
            )}
        </section>
    )
}