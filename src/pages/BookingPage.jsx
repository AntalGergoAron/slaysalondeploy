import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    getAllAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
} from '../services/appointmentService'
import { getAllServices } from '../services/serviceService'
import {
    getAllTimeSlots,
    markTimeSlotUnavailable,
    markTimeSlotAvailable,
} from '../services/timeSlotService'

const bookingHighlights = [
    {
        id: 1,
        title: 'Gyors online foglalás',
        text: 'Néhány kattintással kiválaszthatod a szolgáltatást és a szabad időpontot.',
    },
    {
        id: 2,
        title: 'Átlátható időtartam',
        text: 'Minden szolgáltatásnál jól látható az időigény, így könnyebb tervezni.',
    },
    {
        id: 3,
        title: 'Kényelmes jegyzetmező',
        text: 'Megadhatod, ha van referencia képed, külön kérésed vagy fontos tudnivaló.',
    },
]

const bookingTips = [
    {
        id: 1,
        title: 'Referencia kép',
        text: 'Ha van konkrét elképzelésed, érdemes a megjegyzés mezőben jelezni vagy magaddal hozni a mintaképet.',
    },
    {
        id: 2,
        title: 'Pontosság',
        text: 'Érdemes a lefoglalt időpont előtt néhány perccel megérkezni, hogy kényelmesen induljon az alkalom.',
    },
    {
        id: 3,
        title: 'Újrafoglalás',
        text: 'Ha rendszeresen jársz, a következő időpontot is könnyebb előre betervezni.',
    },
]

export default function BookingPage() {
    const { authUser, dbUser } = useAuth()

    const [appointments, setAppointments] = useState([])
    const [services, setServices] = useState([])
    const [timeSlots, setTimeSlots] = useState([])

    const [loading, setLoading] = useState(true)
    const [appointmentSubmitting, setAppointmentSubmitting] = useState(false)

    const [appointmentError, setAppointmentError] = useState('')
    const [appointmentSuccess, setAppointmentSuccess] = useState('')

    const [editingAppointment, setEditingAppointment] = useState(null)

    const [fieldErrors, setFieldErrors] = useState({
        service_id: '',
        time_slot_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
    })

    const [appointmentFormData, setAppointmentFormData] = useState({
        service_id: '',
        time_slot_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        notes: '',
        status: 'pending',
    })

    const isLoggedIn = !!authUser
    const isAdmin = dbUser?.role === 'admin'
    const isClient = isLoggedIn && !isAdmin

    const resetFieldErrors = () => {
        setFieldErrors({
            service_id: '',
            time_slot_id: '',
            customer_name: '',
            customer_email: '',
            customer_phone: '',
        })
    }

    const resetAppointmentForm = () => {
        setAppointmentFormData({
            service_id: '',
            time_slot_id: '',
            customer_name: dbUser?.full_name || '',
            customer_email: dbUser?.email || '',
            customer_phone: dbUser?.phone || '',
            notes: '',
            status: 'pending',
        })
        resetFieldErrors()
        setEditingAppointment(null)
    }

    const loadBookingData = async () => {
        try {
            setLoading(true)
            setAppointmentError('')

            const [servicesData, timeSlotsData, appointmentsData] = await Promise.all([
                getAllServices(),
                getAllTimeSlots(),
                dbUser ? getAllAppointments() : Promise.resolve([]),
            ])

            setServices(servicesData)
            setTimeSlots(timeSlotsData)
            setAppointments(appointmentsData)
        } catch (err) {
            setAppointmentError(err.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadBookingData()
    }, [dbUser])

    useEffect(() => {
        if (!editingAppointment) {
            setAppointmentFormData((prev) => ({
                ...prev,
                customer_name: dbUser?.full_name || '',
                customer_email: dbUser?.email || '',
                customer_phone: dbUser?.phone || '',
            }))
        }
    }, [dbUser, editingAppointment])

    const handleAppointmentChange = (event) => {
        const { name, value } = event.target

        setAppointmentFormData((prev) => ({
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

    const validateAppointmentForm = () => {
        const errors = {
            service_id: '',
            time_slot_id: '',
            customer_name: '',
            customer_email: '',
            customer_phone: '',
        }

        const trimmedName = appointmentFormData.customer_name.trim()
        const trimmedEmail = appointmentFormData.customer_email.trim()
        const trimmedPhone = appointmentFormData.customer_phone.trim()

        if (!appointmentFormData.service_id) {
            errors.service_id = 'Válassz szolgáltatást.'
        }

        if (!appointmentFormData.time_slot_id) {
            errors.time_slot_id = 'Válassz időpontot.'
        }

        if (!trimmedName) {
            errors.customer_name = 'A név megadása kötelező.'
        }

        if (!trimmedEmail) {
            errors.customer_email = 'Az email cím megadása kötelező.'
        } else {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailPattern.test(trimmedEmail)) {
                errors.customer_email = 'Adj meg egy érvényes email címet.'
            }
        }

        if (!trimmedPhone) {
            errors.customer_phone = 'A telefonszám megadása kötelező.'
        } else if (trimmedPhone.length < 6) {
            errors.customer_phone = 'Adj meg egy érvényesebb telefonszámot.'
        }

        setFieldErrors(errors)

        return (
            !errors.service_id &&
            !errors.time_slot_id &&
            !errors.customer_name &&
            !errors.customer_email &&
            !errors.customer_phone
        )
    }

    const handleEditAppointment = (appointment) => {
        if (!isAdmin) {
            setAppointmentError('Csak admin szerkeszthet foglalást.')
            return
        }

        setAppointmentError('')
        setAppointmentSuccess('')
        resetFieldErrors()
        setEditingAppointment(appointment)

        setAppointmentFormData({
            service_id: String(appointment.service_id),
            time_slot_id: String(appointment.time_slot_id),
            customer_name: appointment.customer_name || '',
            customer_email: appointment.customer_email || '',
            customer_phone: appointment.customer_phone || '',
            notes: appointment.notes || '',
            status: appointment.status || 'pending',
        })
    }

    const handleCancelEdit = () => {
        setAppointmentError('')
        setAppointmentSuccess('')
        resetAppointmentForm()
    }

    const handleAppointmentSubmit = async (event) => {
        event.preventDefault()

        if (!dbUser) {
            setAppointmentError('Foglaláshoz be kell jelentkezned.')
            return
        }

        setAppointmentError('')
        setAppointmentSuccess('')

        if (!validateAppointmentForm()) {
            setAppointmentError('Kérlek javítsd a hibás mezőket.')
            return
        }

        try {
            setAppointmentSubmitting(true)

            const payload = {
                user_id: Number(dbUser.id),
                service_id: Number(appointmentFormData.service_id),
                time_slot_id: Number(appointmentFormData.time_slot_id),
                customer_name: appointmentFormData.customer_name.trim(),
                customer_email: appointmentFormData.customer_email.trim(),
                customer_phone: appointmentFormData.customer_phone.trim(),
                notes: appointmentFormData.notes.trim(),
                status: appointmentFormData.status,
            }

            if (editingAppointment) {
                if (!isAdmin) {
                    setAppointmentError('Csak admin módosíthat foglalást.')
                    return
                }

                const oldTimeSlotId = Number(editingAppointment.time_slot_id)
                const newTimeSlotId = Number(appointmentFormData.time_slot_id)

                await updateAppointment(editingAppointment.id, payload)

                if (oldTimeSlotId !== newTimeSlotId) {
                    await markTimeSlotAvailable(oldTimeSlotId)
                    await markTimeSlotUnavailable(newTimeSlotId)
                }

                setAppointmentSuccess('A foglalás sikeresen módosítva lett.')
            } else {
                await createAppointment(payload)
                await markTimeSlotUnavailable(Number(appointmentFormData.time_slot_id))
                setAppointmentSuccess('A foglalás sikeresen létrejött.')
            }

            resetAppointmentForm()
            await loadBookingData()
        } catch (err) {
            if (
                err.message.includes('appointments_time_slot_id_key') ||
                err.message.includes('duplicate key value')
            ) {
                setAppointmentError('Ez az időpont már foglalt, kérlek válassz másikat.')
            } else {
                setAppointmentError(err.message)
            }
        } finally {
            setAppointmentSubmitting(false)
        }
    }

    const handleDeleteAppointment = async (appointment) => {
        if (!isAdmin) {
            setAppointmentError('Csak admin törölhet foglalást.')
            return
        }

        const confirmed = window.confirm(
            `${appointment.customer_name} foglalását biztosan törölni szeretnéd?`
        )

        if (!confirmed) {
            return
        }

        try {
            setAppointmentError('')
            setAppointmentSuccess('')

            await deleteAppointment(appointment.id)
            await markTimeSlotAvailable(appointment.time_slot_id)

            if (editingAppointment && editingAppointment.id === appointment.id) {
                resetAppointmentForm()
            }

            setAppointmentSuccess('A foglalás sikeresen törölve lett.')
            await loadBookingData()
        } catch (err) {
            setAppointmentError(err.message)
        }
    }

    const visibleAppointments = useMemo(() => {
        if (!dbUser) {
            return []
        }

        if (isAdmin) {
            return appointments
        }

        return appointments.filter((appointment) => appointment.user_id === dbUser.id)
    }, [appointments, dbUser, isAdmin])

    const selectableTimeSlots = useMemo(() => {
        return timeSlots.filter(
            (slot) =>
                slot.is_available || slot.id === Number(appointmentFormData.time_slot_id)
        )
    }, [timeSlots, appointmentFormData.time_slot_id])

    const bookableServices = useMemo(() => {
        return services.filter((service) => service.is_active)
    }, [services])

    if (loading) {
        return <p>Betöltés...</p>
    }

    return (
        <section className="page-shell">
            <div className="page-header">
                <h1>Foglalások</h1>
                <p className="page-intro">
                    Válassz szolgáltatást és szabad időpontot, majd kezeld a meglévő
                    foglalásaidat egy helyen.
                </p>

                {!isLoggedIn && <span className="role-badge">Visitor nézet</span>}
                {isClient && <span className="role-badge">Saját foglalások</span>}
                {isAdmin && <span className="role-badge">Admin mód</span>}
            </div>

            <div className="service-page-top-grid">
                {bookingHighlights.map((item) => (
                    <article className="service-page-info-card" key={item.id}>
                        <h3>{item.title}</h3>
                        <p className="service-page-note">{item.text}</p>
                    </article>
                ))}
            </div>

            {appointmentError && (
                <div className="alert alert--error">{appointmentError}</div>
            )}

            {appointmentSuccess && (
                <div className="alert alert--success">{appointmentSuccess}</div>
            )}

            {!isLoggedIn ? (
                <>
                    <div className="panel">
                        <div className="page-header">
                            <h2>Bejelentkezés szükséges</h2>
                            <p className="page-intro">
                                Foglaláshoz jelentkezz be vagy hozz létre egy fiókot.
                            </p>
                        </div>

                        <div className="form-actions">
                            <Link to="/fiok" className="button button--primary">
                                Tovább a Fiók oldalra
                            </Link>
                            <Link to="/szolgaltatasok" className="button button--secondary">
                                Szolgáltatások megtekintése
                            </Link>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="page-header">
                            <h2>Hogyan működik?</h2>
                        </div>

                        <div className="service-page-bottom-grid">
                            {bookingTips.map((item) => (
                                <article className="service-page-info-card" key={item.id}>
                                    <h3>{item.title}</h3>
                                    <p className="service-page-note">{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="panel">
                        <div className="page-header">
                            <h2>
                                {editingAppointment
                                    ? 'Foglalás szerkesztése'
                                    : 'Új foglalás létrehozása'}
                            </h2>
                            <p className="page-intro">
                                Add meg az alapadatokat, válassz szolgáltatást és időpontot,
                                majd küldd el a foglalásodat.
                            </p>
                        </div>

                        <form className="app-form" onSubmit={handleAppointmentSubmit}>
                            <div className="form-grid">
                                <div className="form-field">
                                    <label htmlFor="customer_name">Név</label>
                                    <input
                                        id="customer_name"
                                        name="customer_name"
                                        type="text"
                                        value={appointmentFormData.customer_name}
                                        onChange={handleAppointmentChange}
                                    />
                                    {fieldErrors.customer_name && (
                                        <p className="field-error">
                                            {fieldErrors.customer_name}
                                        </p>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="customer_email">Email</label>
                                    <input
                                        id="customer_email"
                                        name="customer_email"
                                        type="email"
                                        value={appointmentFormData.customer_email}
                                        onChange={handleAppointmentChange}
                                    />
                                    {fieldErrors.customer_email && (
                                        <p className="field-error">
                                            {fieldErrors.customer_email}
                                        </p>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="customer_phone">Telefonszám</label>
                                    <input
                                        id="customer_phone"
                                        name="customer_phone"
                                        type="text"
                                        value={appointmentFormData.customer_phone}
                                        onChange={handleAppointmentChange}
                                    />
                                    {fieldErrors.customer_phone && (
                                        <p className="field-error">
                                            {fieldErrors.customer_phone}
                                        </p>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="service_id">Szolgáltatás</label>
                                    <select
                                        id="service_id"
                                        name="service_id"
                                        value={appointmentFormData.service_id}
                                        onChange={handleAppointmentChange}
                                    >
                                        <option value="">Válassz szolgáltatást</option>
                                        {bookableServices.map((service) => (
                                            <option key={service.id} value={service.id}>
                                                {service.name} - {service.duration_minutes} perc -{' '}
                                                {service.price} Ft
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.service_id && (
                                        <p className="field-error">
                                            {fieldErrors.service_id}
                                        </p>
                                    )}
                                </div>

                                <div className="form-field">
                                    <label htmlFor="time_slot_id">Időpont</label>
                                    <select
                                        id="time_slot_id"
                                        name="time_slot_id"
                                        value={appointmentFormData.time_slot_id}
                                        onChange={handleAppointmentChange}
                                    >
                                        <option value="">Válassz időpontot</option>
                                        {selectableTimeSlots.map((slot) => (
                                            <option key={slot.id} value={slot.id}>
                                                {slot.slot_date} - {slot.start_time} - {slot.end_time}
                                            </option>
                                        ))}
                                    </select>
                                    {fieldErrors.time_slot_id && (
                                        <p className="field-error">
                                            {fieldErrors.time_slot_id}
                                        </p>
                                    )}
                                </div>

                                {isAdmin && (
                                    <div className="form-field">
                                        <label htmlFor="status">Státusz</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={appointmentFormData.status}
                                            onChange={handleAppointmentChange}
                                        >
                                            <option value="pending">Függőben</option>
                                            <option value="confirmed">Megerősítve</option>
                                            <option value="cancelled">Törölve</option>
                                        </select>
                                    </div>
                                )}

                                <div className="form-field form-field--full">
                                    <label htmlFor="notes">Megjegyzés</label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows="4"
                                        value={appointmentFormData.notes}
                                        onChange={handleAppointmentChange}
                                        placeholder="Ide írhatod, ha van referencia képed, külön kérésed vagy fontos tudnivaló."
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    className="button button--primary"
                                    type="submit"
                                    disabled={appointmentSubmitting}
                                >
                                    {appointmentSubmitting
                                        ? 'Mentés...'
                                        : editingAppointment
                                            ? 'Foglalás mentése'
                                            : 'Foglalás létrehozása'}
                                </button>

                                {editingAppointment && isAdmin && (
                                    <button
                                        className="button button--secondary"
                                        type="button"
                                        onClick={handleCancelEdit}
                                    >
                                        Mégse
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    <div className="panel">
                        <div className="page-header">
                            <h2>{isAdmin ? 'Összes foglalás' : 'Saját foglalásaim'}</h2>
                            <p className="page-intro">
                                {isAdmin
                                    ? 'Itt láthatod és kezelheted az összes beérkezett foglalást.'
                                    : 'Itt látod a saját foglalásaidat egy helyen.'}
                            </p>
                        </div>

                        {visibleAppointments.length === 0 ? (
                            <div className="empty-state">
                                {isAdmin
                                    ? 'Jelenleg nincs egyetlen foglalás sem.'
                                    : 'Még nincs foglalásod.'}
                            </div>
                        ) : (
                            <div className="booking-list">
                                {visibleAppointments.map((appointment) => (
                                    <article className="booking-card" key={appointment.id}>
                                        <h3>
                                            {appointment.services?.name || 'Ismeretlen szolgáltatás'}
                                        </h3>

                                        <p>
                                            <strong>Név:</strong> {appointment.customer_name}
                                        </p>
                                        <p>
                                            <strong>Email:</strong> {appointment.customer_email}
                                        </p>
                                        <p>
                                            <strong>Telefon:</strong> {appointment.customer_phone}
                                        </p>
                                        <p>
                                            <strong>Dátum:</strong>{' '}
                                            {appointment.time_slots?.slot_date || '-'}
                                        </p>
                                        <p>
                                            <strong>Idő:</strong>{' '}
                                            {appointment.time_slots?.start_time || '-'} -{' '}
                                            {appointment.time_slots?.end_time || '-'}
                                        </p>
                                        <p>
                                            <strong>Státusz:</strong> {appointment.status}
                                        </p>
                                        <p>
                                            <strong>Megjegyzés:</strong>{' '}
                                            {appointment.notes || '-'}
                                        </p>

                                        {isAdmin && (
                                            <p>
                                                <strong>Foglaló felhasználó:</strong>{' '}
                                                {appointment.users?.full_name ||
                                                    appointment.users?.email ||
                                                    'Nincs adat'}
                                            </p>
                                        )}

                                        <div className="card-actions">
                                            {isAdmin && (
                                                <button
                                                    className="button button--secondary"
                                                    type="button"
                                                    onClick={() =>
                                                        handleEditAppointment(appointment)
                                                    }
                                                >
                                                    Szerkesztés
                                                </button>
                                            )}

                                            {isAdmin && (
                                                <button
                                                    className="button button--secondary"
                                                    type="button"
                                                    onClick={() =>
                                                        handleDeleteAppointment(appointment)
                                                    }
                                                >
                                                    Törlés
                                                </button>
                                            )}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="panel">
                        <div className="page-header">
                            <h2>Hasznos tudnivalók</h2>
                        </div>

                        <div className="service-page-bottom-grid">
                            {bookingTips.map((item) => (
                                <article className="service-page-info-card" key={item.id}>
                                    <h3>{item.title}</h3>
                                    <p className="service-page-note">{item.text}</p>
                                </article>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    )
}