import { NavLink } from 'react-router-dom'

export default function Navbar() {
    return (
        <header className="site-header">
            <nav className="navbar">
                <NavLink to="/" className="navbar__brand">
                    <img
                        src="/images/slaysalon-logo.png"
                        alt="SlaySalon logó"
                        className="navbar__logo"
                    />
                </NavLink>

                <div className="navbar__links">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        Kezdőlap
                    </NavLink>

                    <NavLink
                        to="/szolgaltatasok"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        Szolgáltatások
                    </NavLink>

                    <NavLink
                        to="/foglalas"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        Foglalás
                    </NavLink>

                    <NavLink
                        to="/kapcsolat"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        Kapcsolat
                    </NavLink>

                    <NavLink
                        to="/fiok"
                        className={({ isActive }) =>
                            isActive ? 'nav-link active' : 'nav-link'
                        }
                    >
                        Fiók
                    </NavLink>
                </div>
            </nav>
        </header>
    )
}