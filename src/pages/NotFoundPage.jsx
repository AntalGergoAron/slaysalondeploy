import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <section className="page-shell">
            <div className="page-header">
                <h1>Az oldal nem található</h1>
                <p className="page-intro">
                    A keresett oldal nem létezik, vagy másik útvonalra került.
                </p>
            </div>

            <div className="panel">
                <p>
                    Menj vissza a kezdőlapra, vagy nézd meg az elérhető menüpontokat.
                </p>

                <div className="form-actions">
                    <Link to="/" className="button button--primary">
                        Vissza a kezdőlapra
                    </Link>

                    <Link to="/szolgaltatasok" className="button button--secondary">
                        Szolgáltatások megnyitása
                    </Link>
                </div>
            </div>
        </section>
    )
}