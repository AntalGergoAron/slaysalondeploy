import { Link } from 'react-router-dom'

const featuredWorks = [
    {
        id: 1,
        title: 'Korall hullámos minta',
        image: '/images/nails-1.jpg',
        alt: 'Korall színű köröm fehér hullámos mintával',
    },
    {
        id: 2,
        title: 'Sárga virágos francia',
        image: '/images/nails-2.jpg',
        alt: 'Sárga végű francia köröm virágmintával',
    },
    {
        id: 3,
        title: 'Kék fényes virágmintás',
        image: '/images/nails-3.jpg',
        alt: 'Kék fényes köröm virágmintás díszítéssel',
    },
    {
        id: 4,
        title: 'Lila csillámos',
        image: '/images/nails-4.jpg',
        alt: 'Lila csillámos',
    },
]

const highlights = [
    {
        id: 1,
        title: 'Precíz, tartós munka',
        text: 'Gondosan elkészített műkörmök, igényes formával és szép végeredménnyel.',
    },
    {
        id: 2,
        title: 'Egyszerű online foglalás',
        text: 'Válassz szolgáltatást és időpontot néhány kattintással.',
    },
    {
        id: 3,
        title: 'Letisztult, nőies stílus',
        text: 'Elegáns, hétköznapi és alkalmi körmök egyaránt kérhetők.',
    },
]

const reviews = [
    {
        id: 1,
        name: 'Kata',
        rating: 5,
        text: 'Nagyon szép lett a körmöm, pontosan olyan, amilyet szerettem volna.',
    },
    {
        id: 2,
        name: 'Anna',
        rating: 5,
        text: 'Tartós, precíz és gyönyörű lett. Biztosan jövök még.',
    },
    {
        id: 3,
        name: 'Dóri',
        rating: 5,
        text: 'A foglalás egyszerű volt, a végeredmény pedig még szebb lett, mint a referencia kép.',
    },
]

const steps = [
    {
        id: 1,
        title: 'Válassz szolgáltatást',
        text: 'Nézd meg az elérhető szolgáltatásokat és árakat.',
    },
    {
        id: 2,
        title: 'Foglalj időpontot',
        text: 'Válaszd ki a számodra megfelelő időpontot online.',
    },
    {
        id: 3,
        title: 'Érkezz a kiválasztott időben',
        text: 'Ha van referencia képed, nyugodtan hozd magaddal.',
    },
]

const faqItems = [
    {
        id: 1,
        question: 'Mennyi ideig tart egy időpont?',
        answer: 'A választott szolgáltatástól függően általában 45–120 perc közötti idővel érdemes számolni.',
    },
    {
        id: 2,
        question: 'Lehet referencia képet hozni?',
        answer: 'Igen, sőt kifejezetten hasznos, mert így könnyebben pontosítható a kívánt stílus.',
    },
    {
        id: 3,
        question: 'Mikor érdemes új időpontot foglalni?',
        answer: 'Általában 3–4 hetente ajánlott, de ez a növekedéstől és a választott típustól is függ.',
    },
]

export default function HomePage() {
    return (
        <section className="page-shell">
            <section className="hero-section homepage-hero">
                <div className="homepage-hero__logo-wrap">
                    <img
                        src="/images/slaysalon-logo.png"
                        alt="SlaySalon logó"
                        className="homepage-hero__logo"
                    />
                </div>

                <p className="hero-section__text">
                    Foglalj időpontot gyorsan és egyszerűen, nézd meg referencia munkáimat,
                    és válassz olyan stílust, ami igazán illik hozzád.
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

            <section className="panel">
                <div className="homepage-highlights">
                    {highlights.map((item) => (
                        <article key={item.id} className="homepage-mini-card">
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="page-header">
                    <h2>Referencia munkák</h2>
                    <p className="page-intro">
                        Néhány stílus a korábbi munkák közül. Ide később feltöltheted a saját
                        valódi fotóidat is.
                    </p>
                </div>

                <div className="homepage-gallery">
                    {featuredWorks.map((work) => (
                        <article key={work.id} className="homepage-gallery-card">
                            <img
                                src={work.image}
                                alt={work.alt}
                                className="homepage-gallery-image"
                            />
                            <div className="homepage-gallery-content">
                                <h3>{work.title}</h3>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="page-header">
                    <h2>Vendégvélemények</h2>
                    <p className="page-intro">
                        Egy szalon oldalán sokat számít a bizalom, ezért érdemes rövid,
                        hiteles értékeléseket is megjeleníteni.
                    </p>
                </div>

                <div className="homepage-reviews">
                    {reviews.map((review) => (
                        <article key={review.id} className="homepage-review-card">
                            <p className="homepage-review-stars">{'★'.repeat(review.rating)}</p>
                            <p className="homepage-review-text">“{review.text}”</p>
                            <p className="homepage-review-name">— {review.name}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="page-header">
                    <h2>Hogyan működik?</h2>
                </div>

                <div className="homepage-steps">
                    {steps.map((step, index) => (
                        <article key={step.id} className="homepage-step-card">
                            <div className="homepage-step-number">{index + 1}</div>
                            <h3>{step.title}</h3>
                            <p>{step.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel">
                <div className="page-header">
                    <h2>Gyakori kérdések</h2>
                </div>

                <div className="homepage-faq">
                    {faqItems.map((item) => (
                        <article key={item.id} className="homepage-faq-item">
                            <h3>{item.question}</h3>
                            <p>{item.answer}</p>
                        </article>
                    ))}
                </div>
            </section>
        </section>
    )
}