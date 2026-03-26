import { Link } from "react-router-dom";

export default function CTASection() {
    return (
        <section className="cta-section">
            <h2>Készen állsz a foglalásra?</h2>
            <p>Válaszd ki a számodra megfelelő szolgáltatást és időpontot.</p>

            <Link to="/foglalas" className="button button--primary">
                Tovább a foglaláshoz
            </Link>
        </section>
    );
}