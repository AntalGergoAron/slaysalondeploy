import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav aria-label="Fő navigáció" className="navbar">
            <div className="navbar__brand">SlaySalon</div>

            <div className="navbar__links">
                <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                    end
                >
                    Kezdőlap
                </NavLink>

                <NavLink
                    to="/szolgaltatasok"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    Szolgáltatások
                </NavLink>

                <NavLink
                    to="/foglalas"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    Foglalás
                </NavLink>

                <NavLink
                    to="/kapcsolat"
                    className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
                >
                    Kapcsolat
                </NavLink>
            </div>
        </nav>
    );
}