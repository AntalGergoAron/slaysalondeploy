import { Link } from 'react-router-dom'

const featuredWorks = [
    {
        id: 1,
        title: 'Babyboomer mandula',
        image: '/images/nails-1.jpg',
        alt: 'Babyboomer stílusú mandula formájú műköröm',
    },
    {
        id: 2,
        title: 'Francia elegáns',
        image: '/images/nails-2.jpg',
        alt: 'Francia stílusú elegáns műköröm',
    },
    {
        id: 3,
        title: 'Rózsaszín gloss',
        image: '/images/nails-3.jpg',
        alt: 'Rózsaszín fényes műköröm',
    },
    {
        id: 4,
        title: 'Minimal nude díszítéssel',
        image: '/images/nails-4.jpg',
        alt: 'Nude műköröm finom díszítéssel',
    },
]

const reviews = [
    {
        id: 1,
        name: 'Kata',
        rating: 5,
        text: 'Nagyon szép lett a körmöm, pontosan olyat kaptam, amilyet szerettem volna. Igényes munka és nagyon kedves kiszolgálás.',
    },
    {
        id: 2,
        name: 'Anna',
        rating: 5,
        text: 'Tartós, precíz és gyönyörű lett. Több hét után is szépen bírta, biztosan jövök még.',
    },
    {
        id: 3,
        name: 'Dóri',
        rating: 5,
        text: 'A foglalás egyszerű volt, a végeredmény pedig még szebb lett, mint a referencia kép. Nagyon elégedett vagyok.',
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

const faqItems = [
    {
        id: 1,
        question: 'Mennyi ideig tart egy időpont?',
        answer: 'A választott szolgáltatástól függően általában 45–120 perc közötti idővel érdemes számolni.',
    },
    {
        id: 2,
        question: 'Lehet referencia képet hozni?',
        answer: 'Igen, sőt kifejezetten hasznos. Így könnyebb pontosan belőni a kívánt stílust és színeket.',
    },
    {
        id: 3,
        question: 'Mikor érdemes új időpontot foglalni töltésre?',
        answer: 'Általában 3–4 hetente ajánlott, de ez függ a köröm növekedésétől és az igénybevételtől is.',
    },
]

export default function HomePage() {
    return (
        <section className="page-shell">
            <section className="hero-section">
                <p className="hero-section__eyebrow">Modern műköröm időpontfoglalás</p>
                <h1>SlaySalon</h1>
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
                            <h2>{item.title}</h2>
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
                            <img src={work.image} alt={work.alt} className="homepage-gallery-image" />
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
                        hitelesnek ható értékeléseket is megjeleníteni. :contentReference[oaicite:2]{index=2}
                    </p>
                </div>

                <div className="homepage-reviews">
                    {reviews.map((review) => (
                        <article key={review.id} className="homepage-review-card">
                            <p className="homepage-review-stars">
                                {'★'.repeat(review.rating)}
                            </p>
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
                    <article className="homepage-step-card">
                        <span className="homepage-step-number">1</span>
                        <h3>Válassz szolgáltatást</h3>
                        <p>Nézd meg az elérhető szolgáltatásokat és árakat.</p>
                    </article>

                    <article className="homepage-step-card">
                        <span className="homepage-step-number">2</span>
                        <h3>Foglalj időpontot</h3>
                        <p>Válaszd ki a számodra megfelelő időpontot online.</p>
                    </article>

                    <article className="homepage-step-card">
                        <span className="homepage-step-number">3</span>
                        <h3>Érkezz a kiválasztott időben</h3>
                        <p>Ha van referencia képed, nyugodtan hozd magaddal.</p>
                    </article>
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

            <section className="cta-section">
                <h2>Készen állsz a foglalásra?</h2>
                <p>
                    Válaszd ki a számodra megfelelő szolgáltatást és foglalj időpontot néhány
                    kattintással.
                </p>

                <div className="hero-section__actions">
                    <Link to="/foglalas" className="button button--primary">
                        Tovább a foglaláshoz
                    </Link>
                    <Link to="/kapcsolat" className="button button--secondary">
                        Kapcsolat
                    </Link>
                </div>
            </section>
        </section>
    )
}