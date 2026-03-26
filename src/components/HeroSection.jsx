import { Link } from "react-router-dom";

export default function HeroSection() {
    return (
        <section className="hero-section">
            <p className="hero-section__eyebrow">Modern műköröm időpontfoglalás</p>
            <h1>SlaySalon</h1>
            <p className="hero-section__text">
                Foglalj időpontot gyorsan és egyszerűen, mobilról vagy asztali gépről.
            </p>

            <div className="hero-section__actions">
                <Link to="/foglalas" className="button button--primary">
                    Időpont foglalása
                </Link>

                <Link to="/szolgaltatasok" className="button button--secondary">
                    Szolgáltatások
                </Link>
            </div>
        </section>
    );
}