import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <>
            <header className="site-header">
                <Navbar />
            </header>

            <main id="main-content" className="site-main">
                <Outlet />
            </main>

            <footer className="site-footer">
                <p>© 2026 SlaySalon – Műköröm időpontfoglalás</p>
            </footer>
        </>
    );
}