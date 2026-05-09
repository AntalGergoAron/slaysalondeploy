import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    createContactMessage,
    getAllContactMessages,
} from '../services/contactMessageService'

const contactHighlights = [
    {
        id: 1,
        title: 'Gyors válasz',
        text: 'Ha kérdésed van szolgáltatással vagy időponttal kapcsolatban, üzenetben is felveheted a kapcsolatot.',
    },
    {
        id: 2,
        title: 'Egyedi igények',
        text: 'Nyugodtan írj, ha külön elképzelésed, referencia képed vagy speciális kérésed van.',
    },
    {
        id: 3,
        title: 'Foglalásbarát oldal',
        text: 'A kapcsolat oldal mellett közvetlenül a foglalási oldalra is tovább tudsz lépni.',
    },
]

const openingHours = [
    { id: 1, day: 'Hétfő', value: '09:00 – 17:00' },
    { id: 2, day: 'Kedd', value: '09:00 – 17:00' },
    { id: 3, day: 'Szerda', value: '09:00 – 17:00' },
    { id: 4, day: 'Csütörtök', value: '10:00 – 18:00' },
    { id: 5, day: 'Péntek', value: '10:00 – 16:00' },
    { id: 6, day: 'Szombat', value: 'Előzetes egyeztetéssel' },
    { id: 7, day: 'Vasárnap', value: 'Zárva' },
]

const faqItems = [
    {
        id: 1,
        question: 'Mikor érdemes inkább üzenetet írni?',
        answer: 'Ha egyedi elképzelésed van, referencia képet küldenél, vagy nem vagy biztos benne, melyik szolgáltatás illik hozzád a legjobban.',
    },
    {
        id: 2,
        question: 'Telefonon vagy üzenetben gyorsabb?',
        answer: 'Általában mindkét út működik, de az üzenet kényelmesebb lehet, ha részletesebb kérdésed van.',
    },
    {
        id: 3,
        question: 'Lehet időpontot kérni kapcsolatfelvételen keresztül is?',
        answer: 'Igen, de a leggyorsabb és legátláthatóbb megoldás továbbra is az online foglalási oldal.',
    },
]

export default function ContactPage() {
    const { dbUser } = useAuth()

    const [messages, setMessages] = useState([])
    const [loadingMessages, setLoadingMessages] = useState(false)

    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')

    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const [formData, setFormData] = useState({
        name: dbUser?.full_name || '',
        email: dbUser?.email || '',
        phone: dbUser?.phone || '',
        subject: '',
        message: '',
    })

    const isAdmin = dbUser?.role === 'admin'

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            name: dbUser?.full_name || prev.name,
            email: dbUser?.email || prev.email,
            phone: dbUser?.phone || prev.phone,
        }))
    }, [dbUser])

    const loadMessages = async () => {
        if (!isAdmin) return

        try {
            setLoadingMessages(true)
            const data = await getAllContactMessages()
            setMessages(data)
        } catch (err) {
            setFormError(err.message)
        } finally {
            setLoadingMessages(false)
        }
    }

    useEffect(() => {
        loadMessages()
    }, [isAdmin])

    const handleChange = (event) => {
        const { name, value } = event.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (fieldErrors[name]) {
            setFieldErrors((prev) => ({
                ...prev,
                [name]: '',
            }))
        }
    }

    const validateForm = () => {
        const errors = {
            name: '',
            email: '',
            subject: '',
            message: '',
        }

        const trimmedName = formData.name.trim()
        const trimmedEmail = formData.email.trim()
        const trimmedSubject = formData.subject.trim()
        const trimmedMessage = formData.message.trim()

        if (!trimmedName) {
            errors.name = 'A név megadása kötelező.'
        }

        if (!trimmedEmail) {
            errors.email = 'Az email cím megadása kötelező.'
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(trimmedEmail)) {
                errors.email = 'Adj meg egy érvényes email címet.'
            }
        }

        if (!trimmedSubject) {
            errors.subject = 'A tárgy megadása kötelező.'
        }

        if (!trimmedMessage) {
            errors.message = 'Az üzenet megadása kötelező.'
        }

        setFieldErrors(errors)

        return !errors.name && !errors.email && !errors.subject && !errors.message
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        setFormError('')
        setFormSuccess('')

        if (!validateForm()) {
            setFormError('Kérlek javítsd a hibás mezőket.')
            return
        }

        try {
            setSubmitting(true)

            await createContactMessage({
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                subject: formData.subject.trim(),
                message: formData.message.trim(),
            })

            setFormSuccess('Az üzenetedet sikeresen elküldtük.')
            setFormData({
                name: dbUser?.full_name || '',
                email: dbUser?.email || '',
                phone: dbUser?.phone || '',
                subject: '',
                message: '',
            })

            if (isAdmin) {
                await loadMessages()
            }
        } catch (err) {
            setFormError(err.message)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="page-shell">
            <div className="page-header">
                <h1>Kapcsolat</h1>
                <p className="page-intro">
                    Kérdésed van egy szolgáltatással, időponttal vagy egyedi igénnyel
                    kapcsolatban? Küldj üzenetet, és visszajelzünk.
                </p>
            </div>

            <div className="service-page-top-grid">
                {contactHighlights.map((item) => (
                    <article className="service-page-info-card" key={item.id}>
                        <h3>{item.title}</h3>
                        <p className="service-page-note">{item.text}</p>
                    </article>
                ))}
            </div>

            {formError && <div className="alert alert--error">{formError}</div>}
            {formSuccess && <div className="alert alert--success">{formSuccess}</div>}

            <div className="panel">
                <div className="page-header">
                    <h2>Elérhetőségek</h2>
                    <p className="page-intro">
                        Ha gyorsabban szeretnél időpontot foglalni, a foglalási oldalon közvetlenül
                        is el tudod intézni.
                    </p>
                </div>

                <div className="service-page-bottom-grid">
                    <article className="service-page-info-card">
                        <h3>Kapcsolati adatok</h3>
                        <p><strong>Cím:</strong> 6720 Szeged, Példa utca 12.</p>
                        <p><strong>Telefon:</strong> +36 30 123 4567</p>
                        <p><strong>Email:</strong> info@slaysalon.hu</p>
                        <p><strong>Instagram:</strong> @slaysalon.hu</p>
                    </article>

                    <article className="service-page-info-card">
                        <h3>Nyitvatartás</h3>
                        {openingHours.map((item) => (
                            <p key={item.id}>
                                <strong>{item.day}:</strong> {item.value}
                            </p>
                        ))}
                    </article>

                    <article className="service-page-info-card">
                        <h3>Gyors műveletek</h3>
                        <p className="service-page-note">
                            Ha már tudod, mit szeretnél, a leggyorsabb út az online foglalás.
                        </p>

                        <div className="form-actions" style={{ marginTop: '1rem' }}>
                            <Link to="/foglalas" className="button button--primary">
                                Időpont foglalása
                            </Link>
                            <Link to="/szolgaltatasok" className="button button--secondary">
                                Szolgáltatások
                            </Link>
                        </div>
                    </article>
                </div>
            </div>

            <div className="panel">
                <div className="page-header">
                    <h2>Üzenet küldése</h2>
                    <p className="page-intro">
                        Írj bátran, ha nem vagy biztos a választásban, vagy egyedi kérdésed van.
                    </p>
                </div>

                <form className="app-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="name">Név</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {fieldErrors.name && (
                                <p className="field-error">{fieldErrors.name}</p>
                            )}
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {fieldErrors.email && (
                                <p className="field-error">{fieldErrors.email}</p>
                            )}
                        </div>

                        <div className="form-field form-field--full">
                            <label htmlFor="phone">Telefon</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Nem kötelező"
                            />
                        </div>

                        <div className="form-field form-field--full">
                            <label htmlFor="subject">Tárgy</label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Pl. időpont érdeklődés"
                            />
                            {fieldErrors.subject && (
                                <p className="field-error">{fieldErrors.subject}</p>
                            )}
                        </div>

                        <div className="form-field form-field--full">
                            <label htmlFor="message">Üzenet</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="6"
                                value={formData.message}
                                onChange={handleChange}
                            />
                            {fieldErrors.message && (
                                <p className="field-error">{fieldErrors.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            className="button button--primary"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? 'Küldés...' : 'Üzenet elküldése'}
                        </button>
                    </div>
                </form>
            </div>

            <div className="panel">
                <div className="page-header">
                    <h2>Gyakori kérdések</h2>
                </div>

                <div className="service-page-bottom-grid">
                    {faqItems.map((item) => (
                        <article className="service-page-info-card" key={item.id}>
                            <h3>{item.question}</h3>
                            <p className="service-page-note">{item.answer}</p>
                        </article>
                    ))}
                </div>
            </div>

            {isAdmin && (
                <div className="panel">
                    <div className="page-header">
                        <h2>Beérkezett üzenetek</h2>
                        <p className="page-intro">
                            Admin nézetben itt láthatod a kapcsolatfelvételi űrlap beérkezett
                            üzeneteit.
                        </p>
                    </div>

                    {loadingMessages ? (
                        <p>Betöltés...</p>
                    ) : messages.length === 0 ? (
                        <div className="empty-state">Még nincs beérkezett üzenet.</div>
                    ) : (
                        <div className="booking-list">
                            {messages.map((message) => (
                                <article className="booking-card" key={message.id}>
                                    <h3>{message.subject}</h3>
                                    <p><strong>Név:</strong> {message.name}</p>
                                    <p><strong>Email:</strong> {message.email}</p>
                                    <p><strong>Telefon:</strong> {message.phone || '-'}</p>
                                    <p><strong>Üzenet:</strong> {message.message}</p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}