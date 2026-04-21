import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
    createContactMessage,
    getAllContactMessages,
} from '../services/contactMessageService'

export default function ContactPage() {
    const { dbUser } = useAuth()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })

    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    })

    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')

    const [messages, setMessages] = useState([])
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [messagesError, setMessagesError] = useState('')

    const isAdmin = dbUser?.role === 'admin'

    const loadMessages = async () => {
        if (!isAdmin) {
            return
        }

        try {
            setMessagesLoading(true)
            setMessagesError('')

            const data = await getAllContactMessages()
            setMessages(data)
        } catch (err) {
            setMessagesError(err.message)
        } finally {
            setMessagesLoading(false)
        }
    }

    useEffect(() => {
        loadMessages()
    }, [isAdmin])

    const sortedMessages = useMemo(() => {
        const result = [...messages]

        result.sort((a, b) => {
            if (a.created_at && b.created_at) {
                return new Date(b.created_at) - new Date(a.created_at)
            }

            if (typeof a.id === 'number' && typeof b.id === 'number') {
                return b.id - a.id
            }

            return 0
        })

        return result
    }, [messages])

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
        } else if (trimmedSubject.length < 3) {
            errors.subject = 'A tárgy legyen legalább 3 karakter hosszú.'
        }

        if (!trimmedMessage) {
            errors.message = 'Az üzenet megadása kötelező.'
        } else if (trimmedMessage.length < 10) {
            errors.message = 'Az üzenet legyen legalább 10 karakter hosszú.'
        }

        setFieldErrors(errors)

        return !errors.name && !errors.email && !errors.subject && !errors.message
    }

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

    const handleSubmit = async (event) => {
        event.preventDefault()

        setFormError('')
        setFormSuccess('')

        if (!validateForm()) {
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

            setFormSuccess('Az üzenetedet sikeresen elküldtük. Hamarosan felvesszük veled a kapcsolatot.')

            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            })

            setFieldErrors({
                name: '',
                email: '',
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
                    Kérdésed van egy szolgáltatással, időponttal vagy egyedi igénnyel kapcsolatban?
                    Küldj üzenetet, és visszajelzünk.
                </p>
                {isAdmin && <span className="role-badge">Admin mód</span>}
            </div>

            <div className="panel">
                <h2>Elérhetőségek</h2>
                <p>
                    <strong>Cím:</strong> 6720 Szeged, Példa utca 12.
                </p>
                <p>
                    <strong>Telefon:</strong> +36 30 123 4567
                </p>
                <p>
                    <strong>Email:</strong> info@slaysalon.hu
                </p>
            </div>

            <div className="panel">
                <h2>Üzenet küldése</h2>

                {formError && <div className="alert alert--error">{formError}</div>}
                {formSuccess && <div className="alert alert--success">{formSuccess}</div>}

                <form className="app-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-grid">
                        <div className="form-field">
                            <label htmlFor="name">Név</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                aria-invalid={!!fieldErrors.name}
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
                                aria-invalid={!!fieldErrors.email}
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
                                aria-invalid={!!fieldErrors.subject}
                                placeholder="Pl. Időpont érdeklődés"
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
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                aria-invalid={!!fieldErrors.message}
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

            {isAdmin && (
                <div className="booking-list-section">
                    <h2>Beérkezett üzenetek</h2>

                    {messagesError && (
                        <div className="alert alert--error">{messagesError}</div>
                    )}

                    {messagesLoading ? (
                        <p>Üzenetek betöltése...</p>
                    ) : sortedMessages.length === 0 ? (
                        <div className="empty-state">
                            Még nincs beérkezett üzenet.
                        </div>
                    ) : (
                        <div className="booking-list">
                            {sortedMessages.map((item) => (
                                <article
                                    className="booking-card"
                                    key={item.id ?? `${item.email}-${item.message}`}
                                >
                                    <h3>{item.name || 'Névtelen üzenet'}</h3>
                                    <p>
                                        <strong>Email:</strong> {item.email || '-'}
                                    </p>
                                    <p>
                                        <strong>Telefon:</strong> {item.phone || '-'}
                                    </p>
                                    <p>
                                        <strong>Tárgy:</strong> {item.subject || '-'}
                                    </p>
                                    {item.created_at && (
                                        <p>
                                            <strong>Érkezett:</strong>{' '}
                                            {new Date(item.created_at).toLocaleString('hu-HU')}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Üzenet:</strong> {item.message || '-'}
                                    </p>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    )
}